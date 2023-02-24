import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { applySort } from 'src/database/utils/sort';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Repository } from 'typeorm';
import { AdPaginationOptionsDto } from './dto/ad-pagination-options.dto';
import { CreateAdDto } from './dto/create-ad.dto';
import { DeleteMultipleAdsDto } from './dto/delete-multiple-ads.dto';
import { UpdateAdDto } from './dto/update-ad.dto';
import { Ad } from './entities/ad.entity';
import { AdNotFoundException } from './errors/ad-not-found.exception';

@Injectable()
export class AdsService {
    constructor(@InjectRepository(Ad) private readonly adsRepository: Repository<Ad>) {}

    async paginate({ perPage, offset, filters: {
        id,
    }, sort}: AdPaginationOptionsDto): Promise<PaginationResult<Ad>> {
        const queryBuilder = this.adsRepository.createQueryBuilder('ad')
            .leftJoinAndSelect('ad.seller', 'seller')
            .leftJoinAndSelect('ad.adPosition', 'adPosition')
            .take(perPage)
            .skip(offset);

        if (id) queryBuilder.where('ad.id = :id', { id });
        
        applySort({ sort, entityAlias: 'ad', queryBuilder });
        
        const [ads, total] = await queryBuilder.getManyAndCount();

        return new PaginationResult(ads, total, perPage);
    }
    
    async create({ image, ...createAdDto }: CreateAdDto): Promise<Ad> {
        const adPosition = Ad.create({
            ...createAdDto,
            imgPath: image.path,
        });

        return await this.adsRepository.save(adPosition);
    }

    async findOne(id: number): Promise<Ad> {
        const ad = await this.adsRepository.createQueryBuilder('ad')
            .leftJoinAndSelect('ad.seller', 'seller')
            .leftJoinAndSelect('ad.adPosition', 'adPosition')
            .where('ad.id = :id', { id })
            .getOne();

        if (!ad) {
            throw new AdNotFoundException();
        }

        return ad;
    }

    async update({ id, image, ...createAdDto }: UpdateAdDto): Promise<Ad> {
        const ad = await this.adsRepository.createQueryBuilder('ad')
            .where('ad.id = :id', { id })
            .getOne();

        if (!ad) {
            throw new AdNotFoundException();
        }

        Object.assign<Ad, Partial<Ad>>(ad, createAdDto);

        if (image) {
            ad.imgPath = image.path;
        }

        return await this.adsRepository.save(ad);
    }

    async delete(id: number): Promise<void> {
        const ad = await this.adsRepository.createQueryBuilder('ad')
            .where('ad.id = :id', { id })
            .getOne();

        if (!ad) {
            throw new AdNotFoundException();
        }

        await this.adsRepository.softRemove(ad);
    }

    async deleteMultiple({ ids }: DeleteMultipleAdsDto): Promise<void> {
        await this.adsRepository.softDelete(ids);
    }
}

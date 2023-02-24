import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationOptions } from 'src/support/pagination/pagination-options';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Repository } from 'typeorm';
import { CreateComboPurposeDto } from './dto/create-combo-purpose.dto';
import { DeleteMultipleComboPurposesDto } from './dto/delete-multiple-combo-purposes.dto';
import { UpdateComboPurpose } from './dto/update-combo-purpose.dto';
import { ComboPurpose } from './entities/combo-purpose.entity';
import { ComboPurposeNotFoundException } from './errors/combo-purpose-not-found.exception';

@Injectable()
export class ComboPurposesService {
    constructor(@InjectRepository(ComboPurpose) private readonly comboPurposesRepository: Repository<ComboPurpose>) {}

    async paginate({perPage, offset}: PaginationOptions): Promise<PaginationResult<ComboPurpose>> {
        const queryBuilder = this.comboPurposesRepository.createQueryBuilder('comboPurpose')
            .take(perPage)
            .skip(offset);

        const [comboPurposes, total] = await queryBuilder.getManyAndCount();

        return new PaginationResult(comboPurposes, total, perPage);
    }

    async create(createComboPurposeDto: CreateComboPurposeDto): Promise<ComboPurpose> {
        const comboPurpose = ComboPurpose.create(createComboPurposeDto);

        return await this.comboPurposesRepository.save(comboPurpose);
    }

    async findOne(id: number): Promise<ComboPurpose> {
        const comboPurpose = await this.comboPurposesRepository.createQueryBuilder('comboPurpose')
            .where('comboPurpose.id = :id', { id })
            .getOne();

        if (!comboPurpose) {
            throw new ComboPurposeNotFoundException();
        }

        return comboPurpose;
    }

    async update({id, ...updateComboPurpose}: UpdateComboPurpose): Promise<ComboPurpose> {
        const comboPurpose = await this.comboPurposesRepository.createQueryBuilder('comboPurpose')
            .where('comboPurpose.id = :id', { id })
            .getOne();

        if (!comboPurpose) {
            throw new ComboPurposeNotFoundException();
        }

        Object.assign<ComboPurpose, Partial<ComboPurpose>>(comboPurpose, updateComboPurpose);

        return await this.comboPurposesRepository.save(comboPurpose);
    }

    async delete(id: number): Promise<void> {
        const comboPurpose = await this.comboPurposesRepository.createQueryBuilder('comboPurpose')
            .where('comboPurpose.id = :id', { id })
            .getOne();

        if (!comboPurpose) {
            throw new ComboPurposeNotFoundException();
        }

        await this.comboPurposesRepository.softRemove(comboPurpose);
    }

    async deleteMultiple({ ids }: DeleteMultipleComboPurposesDto): Promise<void> {
        await this.comboPurposesRepository.softDelete(ids);
    }
}

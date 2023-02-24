import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { applySort } from 'src/database/utils/sort';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Repository } from 'typeorm';
import { CategoryImagesDto } from './dto/category-images.dto';
import { CategoryPaginationOptionsDto } from './dto/category-pagination-options.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { DeleteMultipleCategoriesDto } from './dto/delete-multiple-categories.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { BannerIsRequiredException } from './errors/banner-is-required.exception';
import { CategoryNotFoundException } from './errors/category-not-found.exception';
import { LogoIsRequiredException } from './errors/logo-is-required.exception';

@Injectable()
export class CategoriesService {
    constructor(@InjectRepository(Category) public readonly categoriesRepository: Repository<Category>) {}

    async paginate({perPage, offset, filters: {
        id,
        name,
        parentId,
        onlyParents,
    }, sort}: CategoryPaginationOptionsDto): Promise<PaginationResult<Category>> {
        const queryBuilder = this.categoriesRepository.createQueryBuilder('category')
            .leftJoinAndSelect('category.parentCategory', 'parentCategory')
            .take(perPage)
            .skip(offset);

        if (id) queryBuilder.andWhere('category.id = :id', { id });

        if (name) queryBuilder.andWhere('category.name LIKE :name', { name: `%${name}%` });

        if (parentId) queryBuilder.andWhere('category.parentId = :parentId', { parentId });

        if (onlyParents) queryBuilder.andWhere('category.parentId IS NULL');

        applySort({ sort, entityAlias: 'category', queryBuilder });

        const [categories, total] = await queryBuilder.getManyAndCount();

        return new PaginationResult(categories, total, perPage);
    }

    async create(
        createCategoryDto: CreateCategoryDto,
        {banner, appLogo}: CategoryImagesDto
    ): Promise<Category> {
        if (!banner) {
            throw new BannerIsRequiredException();
        }

        if (!appLogo) {
            throw new LogoIsRequiredException();
        }

        const category = Category.create({
            ...createCategoryDto,
            banner,
            appLogo,
        });

        return await this.categoriesRepository.save(category);
    }

    async findOne(id: number): Promise<Category> {
        const category = await this.categoriesRepository.createQueryBuilder('category')
            .leftJoinAndSelect('category.parentCategory', 'parentCategory')
            .where('category.id = :id', { id })
            .getOne();

        if (!category) {
            throw new CategoryNotFoundException();
        }

        return category;
    }

    async update(
        {id, ...updateCategoryDto}: UpdateCategoryDto,
        {banner, appLogo}: CategoryImagesDto
    ): Promise<Category> {
        const category = await this.categoriesRepository.createQueryBuilder('category')
            .where('category.id = :id', { id })
            .getOne();

        if (!category) {
            throw new CategoryNotFoundException();
        }

        Object.assign(category, updateCategoryDto);

        if (banner) {
            category.banner = banner;
        }

        if (appLogo) {
            category.appLogo = appLogo;
        }

        return await this.categoriesRepository.save(category);
    }
    
    async delete(id: number): Promise<void> {
        const category = await this.categoriesRepository.createQueryBuilder('category')
            .where('category.id = :id', { id })
            .getOne();

        if (!category) {
            throw new CategoryNotFoundException();
        }

        await this.categoriesRepository.softRemove(category);
    }

    async deleteMultiple({ ids }: DeleteMultipleCategoriesDto): Promise<void> {
        await this.categoriesRepository.softDelete(ids);
    }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Occupation } from 'src/occupations/entities/occupation.entity';
import { HashingService } from 'src/support/hashing.service';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/users/enums/role.enum';
import { In, Repository } from 'typeorm';
import { DeleteMultipleSellersDto } from './dto/delete-multiple-sellers.dto';
import { SellerPaginationOptionsDto } from './dto/seller-pagination-options.dto';
import { SellerFilesDto } from './dto/seller-images.dto';
import { UpdateSellerPasswordDto } from './dto/update-seller-password.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';
import { Seller } from './entities/seller.entity';
import { SellerNotFoundException } from './errors/seller-not-found.exception';
import { applySort } from 'src/database/utils/sort';

@Injectable()
export class SellersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(Occupation)
    private readonly occupationsRepository: Repository<Occupation>,
    private readonly hashingService: HashingService,
  ) {}

  async paginate({
    offset,
    perPage,
    filters: { id, userStatusCode, email, name, phoneNumber, minRating },
    sort,
  }: SellerPaginationOptionsDto): Promise<PaginationResult<User>> {
    const queryBuilder = this.usersRepository
      .createQueryBuilder('user')
      .innerJoinAndSelect('user.userStatus', 'userStatus')
      .innerJoinAndSelect('user.seller', 'seller')
      .leftJoinAndSelect('seller.occupations', 'occupation')
      .where('user.role = :role', { role: Role.SELLER })
      .take(perPage)
      .skip(offset);

    if (id) queryBuilder.andWhere('seller.id = :id', { id });

    if (userStatusCode)
      queryBuilder.andWhere('user.userStatusCode = :userStatusCode', {
        userStatusCode,
      });

    if (email)
      queryBuilder.andWhere('user.email LIKE :email', { email: `%${email}%` });

    if (name)
      queryBuilder.andWhere('seller.name LIKE :name', { name: `%${name}%` });

    if (phoneNumber)
      queryBuilder.andWhere('seller.phoneNumber LIKE :phoneNumber', {
        phoneNumber: `%${phoneNumber}%`,
      });

    if (minRating) {
      queryBuilder.andWhere(`seller.rating >= :minRating`, { minRating });
    }

    applySort({ sort, entityAlias: 'seller', queryBuilder });

    const [sellers, total] = await queryBuilder.getManyAndCount();

    return new PaginationResult(sellers, total, perPage);
  }

  async findOneById(
    id: number,
    withChatForClientId: number = 0,
  ): Promise<User> {
    const queryBuilder = this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.userStatus', 'userStatus')
      .leftJoinAndSelect('user.seller', 'seller')
      .leftJoinAndSelect('seller.occupations', 'occupation');

    if (withChatForClientId) {
      queryBuilder.leftJoinAndMapOne(
        'seller.chatWithClient',
        'seller.chats',
        'chatWithClient',
        'chatWithClient.clientId = :withChatForClientId',
        { withChatForClientId },
      );
    }

    const user = queryBuilder
      .where('seller.id = :id', { id })
      .andWhere('user.role = :role', { role: Role.SELLER })
      .getOne();

    if (!user) {
      throw new SellerNotFoundException();
    }

    return user;
  }

  async findOneBySlug(slug: string): Promise<User> {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.userStatus', 'userStatus')
      .leftJoinAndSelect('user.seller', 'seller')
      .leftJoinAndSelect('seller.occupations', 'occupation')
      .where('seller.slug = :slug', { slug })
      .andWhere('user.role = :role', { role: Role.SELLER })
      .getOne();

    if (!user) {
      throw new SellerNotFoundException();
    }

    return user;
  }

  async update(
    {
      id,
      userId,
      role,
      email,
      userStatusCode,
      occupationIds,
      ...updateSellerDto
    }: UpdateSellerDto,
    files: SellerFilesDto,
  ): Promise<User> {
    const queryBuilder = this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.seller', 'seller')
      .where('user.role = :role', { role: Role.SELLER });

    const isAdmin = role === Role.ADMIN;

    if (isAdmin) {
      queryBuilder.andWhere('seller.id = :id', { id });
    } else {
      queryBuilder.andWhere('user.id = :id', { id: userId });
    }

    const user = await queryBuilder.getOne();

    if (!user) {
      throw new SellerNotFoundException();
    }

    if (isAdmin) {
      Object.assign<User, Partial<User>>(user, { email, userStatusCode });
    }

    Object.assign<Seller, Partial<Seller>>(user.seller, {
      ...updateSellerDto,
      occupations: await this.occupationsRepository.find({
        id: In(occupationIds),
      }),
    });

    if (files.credential) {
      user.seller.credential = files.credential;
    }
    if (files.banner) {
      user.seller.banner = files.banner;
    }

    if (files.banner) {
      user.seller.banner = files.banner;
    }

    if (files.logo) {
      user.seller.logo = files.logo;
    }

    if (files.frontImage) {
      user.seller.frontImage = files.frontImage;
    }

    return await this.usersRepository.save(user);
  }

  async updatePassword({
    id,
    password,
  }: UpdateSellerPasswordDto): Promise<User> {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.seller', 'seller')
      .where('seller.id = :id', { id })
      .andWhere('user.role = :role', { role: Role.SELLER })
      .getOne();

    if (!user) {
      throw new SellerNotFoundException();
    }

    user.password = await this.hashingService.make(password);

    return await this.usersRepository.save(user);
  }

  async delete(id: number): Promise<void> {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.seller', 'seller')
      .where('user.id = :id', { id })
      .andWhere('user.role = :role', { role: Role.SELLER })
      .getOne();

    if (!user) {
      throw new SellerNotFoundException();
    }

    await this.usersRepository.softRemove(user);
  }

  async deleteMultiple({ ids }: DeleteMultipleSellersDto): Promise<void> {
    await this.usersRepository.softDelete(ids);
  }
}

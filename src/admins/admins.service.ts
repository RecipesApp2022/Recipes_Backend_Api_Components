import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HashingService } from 'src/support/hashing.service';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Admin } from 'src/admins/entities/admin.entity';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/users/enums/role.enum';
import { UserStatusCode } from 'src/users/enums/user-status-code.enum';
import { Repository } from 'typeorm';
import { AdminPaginationOptionsDto } from './dto/admin-pagination-options.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { DeleteMultipleAdminsDto } from './dto/delete-multiple-admins.dto';
import { UpdateAdminPasswordDto } from './dto/update-admin-password.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { AdminNotFoundException } from './errors/admin-not-found.exception';
import { applySort } from 'src/database/utils/sort';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AuthEvent } from 'src/auth/enums/auth-event.enum';
import { UserRegisteredEvent } from 'src/auth/dto/user-registered.event';

@Injectable()
export class AdminsService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly hashingService: HashingService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async paginate({
    offset,
    perPage,
    filters: { id, email, name, userStatusCode },
    sort,
  }: AdminPaginationOptionsDto): Promise<PaginationResult<User>> {
    const queryBuilder = this.usersRepository
      .createQueryBuilder('user')
      .take(perPage)
      .offset(offset)
      .innerJoinAndSelect('user.userStatus', 'userStatus')
      .leftJoinAndSelect('user.admin', 'admin')
      .where('user.role = :role', { role: Role.ADMIN });

    if (id) queryBuilder.andWhere('user.id = :id', { id });

    if (userStatusCode)
      queryBuilder.andWhere('user.userStatusCode = :userStatusCode', {
        userStatusCode,
      });

    if (email)
      queryBuilder.andWhere('user.email LIKE :email', { email: `%${email}%` });

    if (name)
      queryBuilder.andWhere('user.name LIKE :name', { name: `%${name}%` });

    applySort({ sort, entityAlias: 'user', queryBuilder });

    const [users, total] = await queryBuilder.getManyAndCount();

    return new PaginationResult(users, total, perPage);
  }

  async create({
    email,
    password,
    image,
    ...createAdminDto
  }: CreateAdminDto): Promise<User> {
    const user = User.create({
      email,
      role: Role.ADMIN,
      password: await this.hashingService.make(password),
      userStatusCode: UserStatusCode.ACTIVE,
    });

    user.admin = Admin.create(createAdminDto);

    if (image) {
      user.admin.imgPath = image.path;
    }

    const savedUser = await this.usersRepository.save(user);

    this.eventEmitter.emit(
      AuthEvent.USER_REGISTERED,
      new UserRegisteredEvent({
        userId: user.id,
      }),
    );

    return savedUser;
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .innerJoinAndSelect('user.userStatus', 'userStatus')
      .leftJoinAndSelect('user.admin', 'admin')
      .where('user.role = :role', { role: Role.ADMIN })
      .andWhere('user.id = :id', { id })
      .getOne();

    if (!user) {
      throw new AdminNotFoundException();
    }

    return user;
  }

  async update({
    id,
    email,
    image,
    userStatusCode,
    ...adminData
  }: UpdateAdminDto): Promise<User> {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.admin', 'admin')
      .where('user.role = :role', { role: Role.ADMIN })
      .andWhere('user.id = :id', { id })
      .getOne();

    if (!user) {
      throw new AdminNotFoundException();
    }

    Object.assign(user, { email, userStatusCode });

    Object.assign(user.admin, adminData);

    if (image) {
      user.admin.imgPath = image.path;
    }

    return await this.usersRepository.save(user);
  }

  async updatePassword({
    id,
    password,
  }: UpdateAdminPasswordDto): Promise<User> {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.admin', 'admin')
      .where('user.role = :role', { role: Role.ADMIN })
      .andWhere('user.id = :id', { id })
      .getOne();

    if (!user) {
      throw new AdminNotFoundException();
    }

    user.password = await this.hashingService.make(password);

    return await this.usersRepository.save(user);
  }

  async delete(id: number): Promise<void> {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .where('user.role = :role', { role: Role.ADMIN })
      .andWhere('user.id = :id', { id })
      .getOne();

    if (!user) {
      throw new AdminNotFoundException();
    }

    await this.usersRepository.softRemove(user);
  }

  async deleteMultiple({ ids }: DeleteMultipleAdminsDto): Promise<void> {
    await this.usersRepository.softDelete(ids);
  }
}

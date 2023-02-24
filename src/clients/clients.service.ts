import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRegisteredEvent } from 'src/auth/dto/user-registered.event';
import { AuthEvent } from 'src/auth/enums/auth-event.enum';
import { applySort } from 'src/database/utils/sort';
import { HashingService } from 'src/support/hashing.service';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/users/enums/role.enum';
import { UserNotFoundException } from 'src/users/errors/user-not-found.exception';
import { Repository } from 'typeorm';
import { ClientPaginationOptionsDto } from './dto/client-pagination-options.dto';
import { CreateClientDto } from './dto/create-client.dto';
import { DeleteMultipleClientsDto } from './dto/delete-multiple-clients.dto';
import { UpdateClientPasswordDto } from './dto/update-client-password.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client } from './entities/client.entity';
import { ClientNotFoundException } from './errors/client-not-found.exception';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly hashingService: HashingService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async paginate({
    offset,
    perPage,
    filters,
    sort,
  }: ClientPaginationOptionsDto): Promise<PaginationResult<User>> {
    const queryBuilder = this.usersRepository
      .createQueryBuilder('user')
      .innerJoinAndSelect('user.client', 'client')
      .innerJoinAndSelect('user.userStatus', 'userStatus')
      .take(perPage)
      .skip(offset);

    if (filters.id) queryBuilder.andWhere('user.id = :id', { id: filters.id });

    if (filters.userStatusCode)
      queryBuilder.andWhere('user.userStatusCode = :userStatusCode', {
        userStatusCode: filters.userStatusCode,
      });

    if (filters.email)
      queryBuilder.andWhere('user.email LIKE :email', {
        email: `%${filters.email}%`,
      });

    if (filters.name)
      queryBuilder.andWhere('client.name LIKE :name', {
        name: `%${filters.name}%`,
      });

    if (filters.phoneNumber)
      queryBuilder.andWhere('client.phoneNumber LIKE :phoneNumber', {
        phoneNumber: `%${filters.phoneNumber}%`,
      });

    applySort({ sort, entityAlias: 'user', queryBuilder });

    const [clients, total] = await queryBuilder.getManyAndCount();

    return new PaginationResult(clients, total, perPage);
  }

  async create({
    name,
    phoneNumber,
    image,
    password,
    ...createClientDto
  }: CreateClientDto): Promise<User> {
    const user = User.create({
      ...createClientDto,
      password: await this.hashingService.make(password),
      role: Role.CLIENT,
    });

    user.client = Client.create({
      name,
      phoneNumber,
      imgPath: image.path,
    });

    const savedClient = await this.usersRepository.save(user);

    this.eventEmitter.emit(
      AuthEvent.USER_REGISTERED,
      new UserRegisteredEvent({
        userId: user.id,
      }),
    );

    return savedClient;
  }

  async findOne(id: number, role: Role, userId: number): Promise<User> {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.client', 'client')
      .leftJoinAndSelect('user.userStatus', 'userStatus')
      .where('user.id = :id', { id: role !== Role.ADMIN ? userId : id })
      .andWhere('user.role = :role', { role: Role.CLIENT })
      .getOne();

    if (!user) {
      throw new ClientNotFoundException();
    }

    return user;
  }

  async update({
    id,
    name,
    phoneNumber,
    image,
    role,
    userId,
    userStatusCode,
    ...updateClientDto
  }: UpdateClientDto): Promise<User> {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.client', 'client')
      .leftJoinAndSelect('user.userStatus', 'userStatus')
      .where('user.id = :id', { id: role !== Role.ADMIN ? userId : id })
      .andWhere('user.role = :role', { role: Role.CLIENT })
      .getOne();

    if (!user) {
      throw new ClientNotFoundException();
    }

    Object.assign(user, updateClientDto);

    if (role === Role.ADMIN) {
      user.userStatusCode = userStatusCode;
    }

    Object.assign(user.client, { name, phoneNumber });

    if (image) {
      user.client.imgPath = image.path;
    }

    return await this.usersRepository.save(user);
  }

  async updatePassword({
    id,
    password,
  }: UpdateClientPasswordDto): Promise<User> {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.client', 'client')
      .where('user.id = :id', { id })
      .andWhere('user.role = :role', { role: Role.CLIENT })
      .getOne();

    if (!user) {
      throw new ClientNotFoundException();
    }

    user.password = await this.hashingService.make(password);

    return await this.usersRepository.save(user);
  }

  async delete(id: number): Promise<void> {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.client', 'client')
      .where('user.id = :id', { id })
      .andWhere('user.role = :role', { role: Role.CLIENT })
      .getOne();

    await this.usersRepository.softRemove(user);
  }

  async deleteMultiple({ ids }: DeleteMultipleClientsDto): Promise<void> {
    await this.usersRepository.softDelete(ids);
  }
}

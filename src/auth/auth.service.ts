import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from 'src/clients/entities/client.entity';
import { MailService } from 'src/mail/mail.service';
import { Occupation } from 'src/occupations/entities/occupation.entity';
import { Seller } from 'src/sellers/entities/seller.entity';
import { HashingService } from 'src/support/hashing.service';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/users/enums/role.enum';
import { UserStatusCode } from 'src/users/enums/user-status-code.enum';
import { UserNotFoundException } from 'src/users/errors/user-not-found.exception';
import { In, Repository } from 'typeorm';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { RegisterClientDto } from './dto/register-client.dto';
import { RegisterSellersDto } from './dto/register-seller.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SellerRegisteredEvent } from './dto/seller-registered.event';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UserRegisteredEvent } from './dto/user-registered.event';
import { PasswordReset } from './entities/password-reset.entity';
import { AuthEvent } from './enums/auth-event.enum';
import { InvalidCredentialsException } from './errors/invalid-credentials.exception';
import { PasswordDoesntMatchException } from './errors/password-doesnt-match.exception';

type RegisterResponse = { user: User; accessToken: string };

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(Occupation)
    private readonly occupationsRepository: Repository<Occupation>,
    @InjectRepository(PasswordReset)
    private readonly passwordResetsRepository: Repository<PasswordReset>,
    private readonly jwtService: JwtService,
    private readonly hashingService: HashingService,
    private readonly mailService: MailService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async validateUser(
    email: string,
    password: string,
    role: Role,
  ): Promise<Partial<User>> {
    const user = await this.usersRepository.findOne({
      where: { email, role },
      relations: ['client', 'seller', 'admin', 'userStatus'],
    });

    if (!user) {
      return null;
    }

    const { password: userPassword, ...restOfUser } = user;

    const passwordMatches = await this.hashingService.check(
      password,
      userPassword,
    );

    if (!passwordMatches) {
      return null;
    }

    return restOfUser;
  }

  login(user: User) {
    return {
      user,
      accessToken: this.jwtService.sign(user),
    };
  }

  async register({
    email,
    password,
    ...registerClientDto
  }: RegisterClientDto): Promise<RegisterResponse> {
    let user = Object.assign(new User(), {
      email,
      password: await this.hashingService.make(password),
      role: Role.CLIENT,
      userStatusCode: UserStatusCode.ACTIVE,
    });

    user.client = Object.assign(new Client(), registerClientDto);

    user = await this.usersRepository.save(user);

    this.eventEmitter.emit(
      AuthEvent.USER_REGISTERED,
      new UserRegisteredEvent({
        userId: user.id,
      }),
    );

    const { password: _, ...userWithoutPassword } = user;

    return {
      user,
      accessToken: this.jwtService.sign({ ...userWithoutPassword }),
    };
  }

  async registerStore({
    email,
    password,
    credential,
    occupationIds,
    ...storeData
  }: RegisterSellersDto): Promise<RegisterResponse> {
    let user = User.create({
      email,
      password: await this.hashingService.make(password),
      role: Role.SELLER,
      userStatusCode: UserStatusCode.INACTIVE,
    });

    user.seller = Seller.create({
      ...storeData,
      credential: credential.path,
      occupations: await this.occupationsRepository.find({
        id: In(occupationIds),
      }),
    });

    user = await this.usersRepository.save(user);

    this.eventEmitter.emit(
      AuthEvent.USER_REGISTERED,
      new UserRegisteredEvent({
        userId: user.id,
      }),
    );

    this.eventEmitter.emit(
      AuthEvent.SELLER_REGISTERED,
      new SellerRegisteredEvent({
        userId: user.id,
        sellerId: user.seller.id,
        sellerSlug: user.seller.slug,
      }),
    );

    return {
      user,
      accessToken: null,
    };
  }

  async updatePassword({
    userId,
    currentPassword,
    password,
  }: UpdatePasswordDto): Promise<void> {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .where('user.id = :userId', { userId })
      .getOne();

    if (!user) {
      throw new UserNotFoundException();
    }

    const passwordMatches = await this.hashingService.check(
      currentPassword,
      user.password,
    );

    if (!passwordMatches) {
      throw new PasswordDoesntMatchException();
    }

    user.password = await this.hashingService.make(password);

    await this.usersRepository.save(user);
  }

  async forgotPassword({ email, role }: ForgotPasswordDto): Promise<void> {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .andWhere('user.role = :role', { role })
      .getOne();

    if (!user) {
      throw new UserNotFoundException();
    }

    const token = this.jwtService.sign(
      { id: user.id, email: user.email },
      { expiresIn: '1h' },
    );

    const passwordReset = PasswordReset.create({ email, token });

    await this.passwordResetsRepository.save(passwordReset);

    await this.mailService.sendForgotPasswordEmail({ email, token, role });
  }

  async resetPassword({
    email,
    password,
    token,
  }: ResetPasswordDto): Promise<void> {
    const passwordReset = await this.passwordResetsRepository
      .createQueryBuilder('passwordReset')
      .where('passwordReset.email = :email', { email })
      .andWhere('passwordReset.token = :token', { token })
      .getOne();

    if (!passwordReset) {
      throw new InvalidCredentialsException();
    }

    const tokenIsValid = await this.jwtService
      .verifyAsync(token)
      .catch(() => false);

    if (!tokenIsValid) {
      throw new InvalidCredentialsException();
    }

    const user = await this.usersRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .getOne();

    if (!user) {
      throw new UserNotFoundException();
    }

    user.password = await this.hashingService.make(password);

    await this.usersRepository.save(user);

    await this.passwordResetsRepository.remove(passwordReset);
  }
}

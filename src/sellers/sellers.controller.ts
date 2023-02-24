import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { plainToClass } from 'class-transformer';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AllowAny } from 'src/support/custom-decorators/allow-any';
import { JwtUserToBodyInterceptor } from 'src/support/interceptors/jwt-user-to-body.interceptor';
import { ParamsToBodyInterceptor } from 'src/support/interceptors/params-to-body.interceptor';
import { UserRoleToBodyInterceptor } from 'src/support/interceptors/user-role-to-body.interceptor';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Role } from 'src/users/enums/role.enum';
import { DeleteMultipleSellersDto } from './dto/delete-multiple-sellers.dto';
import { ReadSellerDto } from './dto/read-seller.dto';
import { UpdateSellerPasswordDto } from './dto/update-seller-password.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';
import { SellersPaginationPipe } from './pipes/seller-pagination.pipe';
import { SellersService } from './sellers.service';

@Controller('sellers')
export class SellersController {
  constructor(private readonly sellersService: SellersService) {}

  @Get()
  @AllowAny()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(new JwtUserToBodyInterceptor())
  async paginate(
    @Query(SellersPaginationPipe) options: any,
  ): Promise<PaginationResult<ReadSellerDto>> {
    return (await this.sellersService.paginate(options)).toClass(ReadSellerDto);
  }

  @Get(':id(\\d+)')
  @AllowAny()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(new JwtUserToBodyInterceptor())
  async findOneById(
    @Param('id') id: string,
    @Query('withChatForClientId') withChatForClientId: string = '0',
  ): Promise<ReadSellerDto> {
    return plainToClass(
      ReadSellerDto,
      await this.sellersService.findOneById(+id, +withChatForClientId),
    );
  }

  @Get(':slug')
  @AllowAny()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(new JwtUserToBodyInterceptor())
  async findOneBySlug(@Param('slug') slug: string): Promise<ReadSellerDto> {
    return plainToClass(
      ReadSellerDto,
      await this.sellersService.findOneBySlug(slug),
    );
  }

  @Put(':id')
  @Roles(Role.ADMIN, Role.SELLER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'banner', maxCount: 1 },
      { name: 'logo', maxCount: 1 },
      { name: 'frontImage', maxCount: 1 },
      { name: 'credential', maxCount: 1 },
    ]),
    new ParamsToBodyInterceptor({ id: 'id' }),
    new JwtUserToBodyInterceptor(),
    new UserRoleToBodyInterceptor(),
  )
  async update(
    @Body() updateSellerDto: UpdateSellerDto,
    @UploadedFiles() images,
  ): Promise<ReadSellerDto> {
    return plainToClass(
      ReadSellerDto,
      this.sellersService.update(updateSellerDto, {
        banner: images?.banner?.[0]?.path,
        logo: images?.logo?.[0]?.path,
        frontImage: images?.frontImage?.[0]?.path,
      }),
    );
  }

  @Put(':id/password')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(new ParamsToBodyInterceptor({ id: 'id' }))
  async updatePassword(
    @Body() updateSellerPasswordDto: UpdateSellerPasswordDto,
  ): Promise<ReadSellerDto> {
    return plainToClass(
      ReadSellerDto,
      await this.sellersService.updatePassword(updateSellerPasswordDto),
    );
  }

  @Delete(':id(\\d+)')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async delete(@Param('id') id: string): Promise<void> {
    await this.sellersService.delete(+id);
  }

  @Delete('multiple')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async deleteMultiple(
    @Body() deleteMultipleSellersDto: DeleteMultipleSellersDto,
  ): Promise<void> {
    await this.sellersService.deleteMultiple(deleteMultipleSellersDto);
  }
}

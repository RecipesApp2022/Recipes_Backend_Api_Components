import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { plainToClass } from 'class-transformer';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { FileToBodyInterceptor } from 'src/support/interceptors/file-to-body.interceptor';
import { ParamsToBodyInterceptor } from 'src/support/interceptors/params-to-body.interceptor';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { ReadAdminDto } from 'src/admins/dto/read-admin.dto';
import { Role } from 'src/users/enums/role.enum';
import { AdminsService } from './admins.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { DeleteMultipleAdminsDto } from './dto/delete-multiple-admins.dto';
import { UpdateAdminPasswordDto } from './dto/update-admin-password.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { AdminPaginationPipe } from './pipes/admin-pagination.pipe';

@Controller('admins')
@UseGuards(JwtAuthGuard)
export class AdminsController {
    constructor(private readonly adminsService: AdminsService) {}

    @Get()
    @Roles(Role.ADMIN)
    @UseGuards(RolesGuard)
    async paginate(@Query(AdminPaginationPipe) options: any): Promise<PaginationResult<ReadAdminDto>> {
        return (await this.adminsService.paginate(options)).toClass(ReadAdminDto);
    }

    @Post()
    @Roles(Role.ADMIN)
    @UseGuards(RolesGuard)
    @UseInterceptors(FileInterceptor('image'), new FileToBodyInterceptor('image'))
    async create(@Body() createAdminDto: CreateAdminDto): Promise<ReadAdminDto> {
        return plainToClass(ReadAdminDto, await this.adminsService.create(createAdminDto));
    }

    @Get(':id')
    @Roles(Role.ADMIN)
    @UseGuards(RolesGuard)
    async findOne(@Param('id') id: string): Promise<ReadAdminDto> {
      return plainToClass(ReadAdminDto, await this.adminsService.findOne(+id));
    }

    @Put(':id')
    @Roles(Role.ADMIN)
    @UseGuards(RolesGuard)
    @UseInterceptors(FileInterceptor('image'), new FileToBodyInterceptor('image'), new ParamsToBodyInterceptor({id: 'id'}))
    async update(@Body() updateAdminDto: UpdateAdminDto): Promise<ReadAdminDto> {
        return plainToClass(ReadAdminDto, await this.adminsService.update(updateAdminDto));
    }

    @Put(':id/password')
    @Roles(Role.ADMIN)
    @UseGuards(RolesGuard)
    @UseInterceptors(new ParamsToBodyInterceptor({id: 'id'}))
    async updatePassword(@Body() updateAdminPasswordDto: UpdateAdminPasswordDto): Promise<ReadAdminDto> {
        return plainToClass(ReadAdminDto, await this.adminsService.updatePassword(updateAdminPasswordDto));
    }

    @Delete(':id(\\d+)')
    @Roles(Role.ADMIN)
    @UseGuards(RolesGuard)
    async delete(@Param('id') id: string): Promise<void> {
        await this.adminsService.delete(+id);
    }

    @Delete('multiple')
    @Roles(Role.ADMIN)
    @UseGuards(RolesGuard)
    async deleteMultiple(@Body() deleteMultipleAdminsDto: DeleteMultipleAdminsDto): Promise<void> {
        await this.adminsService.deleteMultiple(deleteMultipleAdminsDto);
    }
}

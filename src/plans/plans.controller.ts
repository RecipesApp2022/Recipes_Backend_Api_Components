import { Body, Controller, Delete, Get, Param, Post, Put, Query, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { plainToClass } from 'class-transformer';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AllowAny } from 'src/support/custom-decorators/allow-any';
import { FileToBodyInterceptor } from 'src/support/interceptors/file-to-body.interceptor';
import { JwtUserToBodyInterceptor } from 'src/support/interceptors/jwt-user-to-body.interceptor';
import { ParamsToBodyInterceptor } from 'src/support/interceptors/params-to-body.interceptor';
import { SellerIdToBodyInterceptor } from 'src/support/interceptors/seller-id-to-body.interceptor';
import { SlugifierInterceptor } from 'src/support/interceptors/slugifier.interceptor';
import { UserRoleToBodyInterceptor } from 'src/support/interceptors/user-role-to-body.interceptor';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Role } from 'src/users/enums/role.enum';
import { CreatePlanImageDto } from './dto/create-plan-image-dto';
import { CreatePlanDto } from './dto/create-plan.dto';
import { DeletePlanImageDto } from './dto/delete-plan-image.dto';
import { DeletePlanDto } from './dto/delete-plan.dto';
import { ReadPlanDto } from './dto/read-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { PlanImage } from './entities/plan-image.entity';
import { PlanPaginationPipe } from './pipes/plan-pagination.pipe';
import { PlansService } from './plans.service';

@Controller('plans')
export class PlansController {
    constructor(private readonly plansService: PlansService) {}

    @Get()
    @AllowAny()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(new JwtUserToBodyInterceptor('clientId'))
    async paginate(
        @Query(PlanPaginationPipe) options: any,
        @Body('clientId') clientId: string
    ): Promise<PaginationResult<ReadPlanDto>> {
        return (await this.plansService.paginate(options, +clientId)).toClass(ReadPlanDto);
    }

    @Post()
    @Roles(Role.SELLER, Role.CLIENT)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @UseInterceptors(
        FilesInterceptor('images'),
        new SlugifierInterceptor({ name: 'slug' }),
        SellerIdToBodyInterceptor,
        new JwtUserToBodyInterceptor('clientId'),
        new UserRoleToBodyInterceptor()
    )
    async create(@Body() createPlanDto: CreatePlanDto, @UploadedFiles() images: Express.Multer.File[]): Promise<ReadPlanDto> {
        return plainToClass(ReadPlanDto, await this.plansService.create(createPlanDto, images));
    }

    @Get(':id(\\d+)')
    @AllowAny()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(new JwtUserToBodyInterceptor('clientId'))
    async findOneById(
        @Param('id') id: string,
        @Body('clientId') clientId: string
    ): Promise<ReadPlanDto> {
        return plainToClass(ReadPlanDto, await this.plansService.findOne(+id, false, +clientId));
    }

    @Get(':slug')
    @AllowAny()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(new JwtUserToBodyInterceptor('clientId'))
    async findOneBySlug(
        @Param('slug') slug: string,
        @Body('clientId') clientId: string
    ): Promise<ReadPlanDto> {
        return plainToClass(ReadPlanDto, await this.plansService.findOne(slug, true, +clientId));
    }

    @Put(':id')
    @Roles(Role.SELLER, Role.CLIENT)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @UseInterceptors(new UserRoleToBodyInterceptor(), new JwtUserToBodyInterceptor('clientId'), SellerIdToBodyInterceptor, new ParamsToBodyInterceptor({ id: 'id' }))
    async update(@Body() updatePlanDto: UpdatePlanDto): Promise<ReadPlanDto> {
        return plainToClass(ReadPlanDto, await this.plansService.update(updatePlanDto));
    }

    @Delete(':id')
    @Roles(Role.SELLER, Role.CLIENT)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @UseInterceptors(new UserRoleToBodyInterceptor(), new JwtUserToBodyInterceptor('clientId'), SellerIdToBodyInterceptor, new ParamsToBodyInterceptor({ id: 'id' }))
    async delete(@Body() deletePlanDto: DeletePlanDto): Promise<void> {
        await this.plansService.delete(deletePlanDto);
    }

    @Post(':id/images')
    @Roles(Role.SELLER, Role.CLIENT)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @UseInterceptors(
        FileInterceptor('image'),
        new FileToBodyInterceptor('image'),
        new ParamsToBodyInterceptor({id: 'id'}),
        new UserRoleToBodyInterceptor(),
        new JwtUserToBodyInterceptor('clientId'),
        SellerIdToBodyInterceptor
        )
    async createPlanImage(@Body() createPlanImageDto: CreatePlanImageDto): Promise<PlanImage> {
        return await this.plansService.createPlanImage(createPlanImageDto);
    }

    @Delete(':id/images/:imageId')
    @Roles(Role.SELLER, Role.CLIENT)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @UseInterceptors(new UserRoleToBodyInterceptor(), new JwtUserToBodyInterceptor('clientId'), SellerIdToBodyInterceptor, new ParamsToBodyInterceptor({id: 'id', imageId: 'imageId'}))
    async deletePlanImage(@Body() deleteImageImageDto: DeletePlanImageDto): Promise<void> {
        await this.plansService.deletePlanImage(deleteImageImageDto);
    }
}

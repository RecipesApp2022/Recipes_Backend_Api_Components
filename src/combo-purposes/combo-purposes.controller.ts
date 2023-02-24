import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ParamsToBodyInterceptor } from 'src/support/interceptors/params-to-body.interceptor';
import { PaginationPipe } from 'src/support/pagination/pagination-pipe';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Role } from 'src/users/enums/role.enum';
import { ComboPurposesService } from './combo-purposes.service';
import { CreateComboPurposeDto } from './dto/create-combo-purpose.dto';
import { DeleteMultipleComboPurposesDto } from './dto/delete-multiple-combo-purposes.dto';
import { ReadComboPurposeDto } from './dto/read-combo-purpose.dto';
import { UpdateComboPurpose } from './dto/update-combo-purpose.dto';

@Controller('combo-purposes')
export class ComboPurposesController {
    constructor(private readonly comboPurposesService: ComboPurposesService) {}

    @Get()
    async paginate(@Query(PaginationPipe) options: any): Promise<PaginationResult<ReadComboPurposeDto>> {
        return (await this.comboPurposesService.paginate(options)).toClass(ReadComboPurposeDto);
    }

    @Post()
    @Roles(Role.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    async create(@Body() createComboPurposeDto: CreateComboPurposeDto): Promise<ReadComboPurposeDto> {
        return plainToClass(ReadComboPurposeDto, await this.comboPurposesService.create(createComboPurposeDto));
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<ReadComboPurposeDto> {
        return plainToClass(ReadComboPurposeDto, await this.comboPurposesService.findOne(+id));
    }

    @Put(':id')
    @Roles(Role.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @UseInterceptors(new ParamsToBodyInterceptor({ id: 'id' }))
    async update(@Body() updateComboPurpose: UpdateComboPurpose): Promise<ReadComboPurposeDto> {
        return plainToClass(ReadComboPurposeDto, await this.comboPurposesService.update(updateComboPurpose));
    }

    @Delete(':id(\\d+)')
    @Roles(Role.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    async delete(@Param('id') id: string): Promise<void> {
        await this.comboPurposesService.delete(+id);
    }

    @Delete('multiple')
    @Roles(Role.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    async deleteMultiple(@Body() deleteMultipleComboPurposesDto: DeleteMultipleComboPurposesDto): Promise<void> {
        await this.comboPurposesService.deleteMultiple(deleteMultipleComboPurposesDto);
    }
}

import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToClass, plainToInstance } from 'class-transformer';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ReadRecipeDto } from 'src/recipes/dto/read-recipe.dto';
import { JwtUserToBodyInterceptor } from 'src/support/interceptors/jwt-user-to-body.interceptor';
import { ParamsToBodyInterceptor } from 'src/support/interceptors/params-to-body.interceptor';
import { QueryParamsToBodyInterceptor } from 'src/support/interceptors/query-params-to-body.interceptor';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Role } from 'src/users/enums/role.enum';
import { CreateEventDto } from './dto/create-event.dto';
import { DeleteEventDto } from './dto/delete-event.dto';
import { FindRecipesForDayDto } from './dto/find-recipes-for-day.dto';
import { ReadEventDto } from './dto/read-event.dto';
import { EventsService } from './events.service';
import { EventPaginationPipe } from './pipes/event-pagination.pipe';

@Controller('events')
export class EventsController {
    constructor(private readonly eventsService: EventsService) {}

    @Get()
    async paginate(@Query(EventPaginationPipe) options: any): Promise<PaginationResult<ReadEventDto>> {
        return (await this.eventsService.paginate(options)).toClass(ReadEventDto);
    }
    
    @Post()
    @Roles(Role.CLIENT)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @UseInterceptors(new JwtUserToBodyInterceptor('clientId'))
    async create(@Body() createEventDto: CreateEventDto): Promise<ReadEventDto> {
        return plainToClass(ReadEventDto, await this.eventsService.create(createEventDto));
    }

    @Get(':id(\\d+)')
    async getOne(@Param('id') id: string): Promise<ReadEventDto> {
        return plainToClass(ReadEventDto, await this.eventsService.findOne(+id));
    }

    @Delete(':id')
    @Roles(Role.CLIENT)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @UseInterceptors(new JwtUserToBodyInterceptor('clientId'), new ParamsToBodyInterceptor({ id: 'id' }))
    async delete(@Body() deleteEventDto: DeleteEventDto): Promise<void> {
        await this.eventsService.delete(deleteEventDto);
    }

    @Get('/recipes')
    @Roles(Role.CLIENT)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @UseInterceptors(new QueryParamsToBodyInterceptor({ date: 'date' }), new JwtUserToBodyInterceptor('clientId'))
    async findRecipesForDay(@Body() findRecipesForDayDto: FindRecipesForDayDto): Promise<ReadRecipeDto[]> {
        return plainToInstance(ReadRecipeDto, await this.eventsService.findRecipesForDay(findRecipesForDayDto));
    }
}

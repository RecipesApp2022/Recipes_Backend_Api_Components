import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtUserToBodyInterceptor } from 'src/support/interceptors/jwt-user-to-body.interceptor';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Role } from 'src/users/enums/role.enum';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { DeleteFavoriteDto } from './dto/delete-favorite.dto';
import { ReadFavoriteDto } from './dto/read-favorite.dto';
import { FavoritesService } from './favorites.service';
import { FavoritePaginationPipe } from './pipes/favorite-pagination.pipe';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  async paginate(
    @Query(FavoritePaginationPipe) options: any,
  ): Promise<PaginationResult<ReadFavoriteDto>> {
    return (await this.favoritesService.paginate(options)).toClass(
      ReadFavoriteDto,
    );
  }

  @Post()
  @Roles(Role.CLIENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(new JwtUserToBodyInterceptor('clientId'))
  async create(@Body() createFavoriteDto: CreateFavoriteDto): Promise<{
    favorite: ReadFavoriteDto;
    nextSlug: string;
  }> {
    const result = await this.favoritesService.create(createFavoriteDto);

    return {
      favorite: plainToClass(ReadFavoriteDto, result.favorite),
      nextSlug: result.nextSlug,
    };
  }

  @Delete()
  @Roles(Role.CLIENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(new JwtUserToBodyInterceptor('clientId'))
  async delete(@Body() deleteFavoriteDto: DeleteFavoriteDto): Promise<void> {
    await this.favoritesService.delete(deleteFavoriteDto);
  }
}

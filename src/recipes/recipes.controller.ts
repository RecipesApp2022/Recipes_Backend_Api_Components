import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
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
import { CreateRecipeImageDto } from './dto/create-recipe-image-dto';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { DeleteMultipleRecipesDto } from './dto/delete-multiple-recipes.dto';
import { DeleteRecipeImageDto } from './dto/delete-recipe-image.dto';
import { DeleteRecipeDto } from './dto/delete-recipe.dto';
import { ReadRecipeDto } from './dto/read-recipe.dto';
import { UpdateRecipeDto } from './dto/upate-recipe.dto';
import { RecipeImage } from './entities/recipe-image.entity';
import { RecipeByHierarchyPaginationPipe } from './pipes/recipe-by-hierarchy-pagination.pipe';
import { RecipePaginationPipe } from './pipes/recipe-pagination.pipe';
import { RecipesService } from './recipes.service';

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Get()
  @AllowAny()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(new JwtUserToBodyInterceptor('clientId'))
  async paginate(
    @Query(RecipePaginationPipe) options: any,
    @Body('clientId') clientId: string,
  ): Promise<PaginationResult<ReadRecipeDto>> {
    return (await this.recipesService.paginate(options, +clientId)).toClass(
      ReadRecipeDto,
    );
  }

  @Get('by-hierarchy')
  @Roles(Role.CLIENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(new JwtUserToBodyInterceptor('clientId'))
  async paginateOrderedByHierarchy(
    @Query(RecipeByHierarchyPaginationPipe) options: any,
    @Body('clientId') clientId: string,
  ): Promise<PaginationResult<ReadRecipeDto>> {
    return (
      await this.recipesService.paginateOrderedByHierarchy(options, +clientId)
    ).toClass(ReadRecipeDto);
  }

  @Post()
  @Roles(Role.SELLER, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(
    FilesInterceptor('images'),
    new SlugifierInterceptor({ name: 'slug' }),
    SellerIdToBodyInterceptor,
    new UserRoleToBodyInterceptor('role'),
  )
  async create(
    @Body() createRecipeDto: CreateRecipeDto,
    @UploadedFiles() images: Express.Multer.File[],
  ): Promise<ReadRecipeDto> {
    return plainToClass(
      ReadRecipeDto,
      await this.recipesService.create(createRecipeDto, images),
    );
  }

  @Get(':id(\\d+)')
  @AllowAny()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(new JwtUserToBodyInterceptor('clientId'))
  async findOneById(
    @Param('id') id: string,
    @Body('clientId') clientId: string,
  ): Promise<ReadRecipeDto> {
    return plainToClass(
      ReadRecipeDto,
      await this.recipesService.findOne(+id, false, +clientId),
    );
  }

  @Get(':slug')
  @AllowAny()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(new JwtUserToBodyInterceptor('clientId'))
  async findOneBySlug(
    @Param('slug') slug: string,
    @Body('clientId') clientId: string,
  ): Promise<ReadRecipeDto> {
    return plainToClass(
      ReadRecipeDto,
      await this.recipesService.findOne(slug, true, +clientId),
    );
  }

  @Put(':id')
  @Roles(Role.SELLER, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(
    new ParamsToBodyInterceptor({ id: 'id' }),
    new UserRoleToBodyInterceptor('role'),
    SellerIdToBodyInterceptor,
  )
  async update(
    @Body() updateRecipeDto: UpdateRecipeDto,
  ): Promise<ReadRecipeDto> {
    return plainToClass(
      ReadRecipeDto,
      await this.recipesService.update(updateRecipeDto),
    );
  }

  @Delete(':id(\\d+)')
  @Roles(Role.ADMIN, Role.SELLER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(
    new ParamsToBodyInterceptor({ id: 'id' }),
    new UserRoleToBodyInterceptor(),
    SellerIdToBodyInterceptor,
  )
  async delete(@Body() deleteRecipeDto: DeleteRecipeDto): Promise<void> {
    await this.recipesService.delete(deleteRecipeDto);
  }

  @Delete('multiple')
  @Roles(Role.ADMIN, Role.SELLER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(new UserRoleToBodyInterceptor(), SellerIdToBodyInterceptor)
  async deleteMultiple(
    @Body() deleteMultipleRecipesDto: DeleteMultipleRecipesDto,
  ): Promise<void> {
    await this.recipesService.deleteMultiple(deleteMultipleRecipesDto);
  }

  @Post(':id/images')
  @Roles(Role.SELLER, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(
    FileInterceptor('image'),
    new FileToBodyInterceptor('image'),
    new ParamsToBodyInterceptor({ id: 'id' }),
    SellerIdToBodyInterceptor,
    new UserRoleToBodyInterceptor(),
  )
  async createRecipeImage(
    @Body() createRecipeImageDto: CreateRecipeImageDto,
  ): Promise<RecipeImage> {
    return await this.recipesService.createRecipeImage(createRecipeImageDto);
  }

  @Delete(':id/images/:imageId')
  @Roles(Role.SELLER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(
    SellerIdToBodyInterceptor,
    new ParamsToBodyInterceptor({ id: 'id', imageId: 'imageId' }),
    new UserRoleToBodyInterceptor(),
  )
  async deleteRecipeImage(
    @Body() deleteRecipeImageDto: DeleteRecipeImageDto,
  ): Promise<void> {
    await this.recipesService.deleteRecipeImage(deleteRecipeImageDto);
  }
}

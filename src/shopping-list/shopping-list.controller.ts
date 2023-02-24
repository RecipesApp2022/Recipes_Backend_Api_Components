import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  UseGuards,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { plainToClass, plainToInstance } from 'class-transformer';
import { Response } from 'express';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtUserToBodyInterceptor } from 'src/support/interceptors/jwt-user-to-body.interceptor';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Role } from 'src/users/enums/role.enum';
import { GenerateShoppingListImageDto } from './dto/generate-shopping-list-image.dto';
import { GenerateShoppingListDto } from './dto/generate-shopping-list.dto';
import { ReadShoppingListItemDto } from './dto/read-shopping-list-item.dto';
import { ReadShoppingListDto } from './dto/read-shopping-list.dto';
import { StoreShoppingListImage } from './dto/store-shopping-list-image.dto';
import { ShoppingListPaginationPipe } from './pipes/shopping-list-pagination.pipe';
import { ShoppingListService } from './shopping-list.service';

@Controller('shopping-list')
export class ShoppingListController {
  constructor(private readonly shoppingListService: ShoppingListService) {}

  @Get()
  async paginate(
    @Query(ShoppingListPaginationPipe) options: any,
  ): Promise<PaginationResult<ReadShoppingListDto>> {
    return (await this.shoppingListService.paginate(options)).toClass(
      ReadShoppingListDto,
    );
  }

  @Post()
  @Roles(Role.CLIENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(new JwtUserToBodyInterceptor('clientId'))
  async generate(@Body() generateShoppingListDto: GenerateShoppingListDto) {
    return plainToInstance(
      ReadShoppingListItemDto,
      await this.shoppingListService.generate(generateShoppingListDto),
    );
  }

  @Post('image')
  @Roles(Role.CLIENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async generateImage(
    @Res() res: Response,
    @Body() generateShoppingListImageDto: GenerateShoppingListImageDto,
  ) {
    const image = await this.shoppingListService.generateImage(
      generateShoppingListImageDto,
    );

    if (!generateShoppingListImageDto.asBase64) {
      res.setHeader('Content-type', 'image/png');
    }

    res.send(image);
  }

  @Post('store-image')
  @Roles(Role.CLIENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(new JwtUserToBodyInterceptor('clientId'))
  async storeImage(@Body() storeShoppingListImageDto: StoreShoppingListImage) {
    return plainToClass(
      ReadShoppingListDto,
      await this.shoppingListService.storeImage(storeShoppingListImageDto),
    );
  }
}

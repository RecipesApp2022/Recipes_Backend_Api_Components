import { Body, Controller, Get, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtUserToBodyInterceptor } from 'src/support/interceptors/jwt-user-to-body.interceptor';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Role } from 'src/users/enums/role.enum';
import { ReadSavedDto } from './dto/read-saved.dto';
import { ToggleSavedDto } from './dto/toggle-saved.dto';
import { SavedPaginationPipe } from './pipes/saved-pagination.pipe';
import { SavedService } from './saved.service';

@Controller('saved')
export class SavedController {
    constructor(private readonly savedService: SavedService) {}

    @Get()
    async paginate(@Query(SavedPaginationPipe) options: any): Promise<PaginationResult<ReadSavedDto>> {
        return (await this.savedService.paginate(options)).toClass(ReadSavedDto);
    }

    @Post('toggle')
    @Roles(Role.CLIENT)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @UseInterceptors(new JwtUserToBodyInterceptor('clientId'))
    async toggle(@Body() toggleSavedDto: ToggleSavedDto): Promise<boolean> {
        return await this.savedService.toggle(toggleSavedDto);
    }
}

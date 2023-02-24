import { Body, Controller, Get, UseGuards, UseInterceptors, Query } from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { SellerIdToBodyInterceptor } from 'src/support/interceptors/seller-id-to-body.interceptor';
import { UserRoleToBodyInterceptor } from 'src/support/interceptors/user-role-to-body.interceptor';
import { Role } from 'src/users/enums/role.enum';
import { ReadDashBoardSummary } from './dto/read-dashboard-summary.dto';
import { SummariesService } from './summaries.service';

@Controller('summaries')
export class SummariesController {
    constructor(private readonly summariesService: SummariesService) {}

    @Get('dashboard')
    @Roles(Role.SELLER, Role.ADMIN, Role.CLIENT)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @UseInterceptors(SellerIdToBodyInterceptor, new UserRoleToBodyInterceptor())
    async dashboard(
        @Body('sellerId') sellerId: string,
        @Body('role') role: string,
        @Query('sellerId') sellerIdFromQuery: string
    ): Promise<ReadDashBoardSummary> {
        return await this.summariesService.dashboard(+sellerIdFromQuery || +sellerId, role as Role);
    }
}

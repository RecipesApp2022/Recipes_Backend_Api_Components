import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from 'src/clients/entities/client.entity';
import { Combo } from 'src/combos/entities/combo.entity';
import { Plan } from 'src/plans/entities/plan.entity';
import { Recipe } from 'src/recipes/entities/recipes.entity';
import { SellerRating } from 'src/seller-ratings/entities/seller-rating.entity';
import { Role } from 'src/users/enums/role.enum';
import { Repository } from 'typeorm';
import { ReadDashBoardSummary } from './dto/read-dashboard-summary.dto';

@Injectable()
export class SummariesService {
    constructor(
        @InjectRepository(Client) private readonly clientsRepository: Repository<Client>,
        @InjectRepository(Recipe) private readonly recipesRepository: Repository<Recipe>,
        @InjectRepository(Plan) private readonly plansRepository: Repository<Plan>,
        @InjectRepository(Combo) private readonly combosRepository: Repository<Combo>,
        @InjectRepository(SellerRating) private readonly sellerRatingsRepository: Repository<SellerRating>
    ) {}

    async dashboard(sellerId: number, role: Role): Promise<ReadDashBoardSummary> {
        // Que tengan ordenes pertenecientes al seller
        const clientsCount = await this.clientsRepository.createQueryBuilder('client').getCount();

        const recipesCountQb = this.recipesRepository.createQueryBuilder('recipe');
            
        const plansCountQb = this.plansRepository.createQueryBuilder('plan');

        const combosCountQb = this.combosRepository.createQueryBuilder('combo');

        const reviewsCountQb = this.sellerRatingsRepository.createQueryBuilder('sellerRating');

        if (role !== Role.ADMIN) {
            recipesCountQb.where('recipe.sellerId = :sellerId', { sellerId });
            plansCountQb.where('plan.sellerId = :sellerId', { sellerId });
            combosCountQb.where('combo.sellerId = :sellerId', { sellerId });
            reviewsCountQb.where('sellerRating.sellerId = :sellerId', { sellerId });
        }
        
        return {
            clientsCount,
            recipesCount: await recipesCountQb.getCount(),
            plansCount: await plansCountQb.getCount(),
            combosCount: await combosCountQb.getCount(),
            reviewsCount: await reviewsCountQb.getCount(),
        };
    }
}

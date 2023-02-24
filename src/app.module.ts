import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { SupportModule } from './support/support.module';
import { ValidationModule } from './validation/validation.module';
import { SellersModule } from './sellers/sellers.module';
import { ClientsModule } from './clients/clients.module';
import { AdminsModule } from './admins/admins.module';
import { UserStatusesModule } from './user-statuses/user-statuses.module';
import { CategoriesModule } from './categories/categories.module';
import { MealPeriodsModule } from './meal-periods/meal-periods.module';
import { RecipeDifficultiesModule } from './recipe-difficulties/recipe-difficulties.module';
import { IngredientTypesModule } from './ingredient-types/ingredient-types.module';
import { IngredientsModule } from './ingredients/ingredients.module';
import { OccupationsModule } from './occupations/occupations.module';
import { MeasurementUnitsModule } from './measurement-units/measurement-units.module';
import { RecipesModule } from './recipes/recipes.module';
import { PlansModule } from './plans/plans.module';
import { ComboPurposesModule } from './combo-purposes/combo-purposes.module';
import { CombosModule } from './combos/combos.module';
import { AdPositionsModule } from './ad-positions/ad-positions.module';
import { AdsModule } from './ads/ads.module';
import { SummariesModule } from './summaries/summaries.module';
import { FavoritesModule } from './favorites/favorites.module';
import { SavedModule } from './saved/saved.module';
import { CommentsModule } from './comments/comments.module';
import { ChatsModule } from './chats/chats.module';
import { EventsModule } from './events/events.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentGatewaysModule } from './payment-gateways/payment-gateways.module';
import { PaymentMethodsModule } from './payment-methods/payment-methods.module';
import { PurchasedProductsModule } from './purchased-products/purchased-products.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { RatingsModule } from './ratings/ratings.module';
import { SellerRatingsModule } from './seller-ratings/seller-ratings.module';
import { MailModule } from './mail/mail.module';
import { NotificationsModule } from './notifications/notifications.module';
import { NotificationTypesModule } from './notification-types/notification-types.module';
import { EmailContactsModule } from './email-contacts/email-contacts.module';
import { ShoppingListModule } from './shopping-list/shopping-list.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    SupportModule,
    ValidationModule,
    SellersModule,
    ClientsModule,
    AdminsModule,
    UserStatusesModule,
    CategoriesModule,
    MealPeriodsModule,
    RecipeDifficultiesModule,
    IngredientTypesModule,
    IngredientsModule,
    OccupationsModule,
    MeasurementUnitsModule,
    RecipesModule,
    PlansModule,
    ComboPurposesModule,
    CombosModule,
    AdPositionsModule,
    AdsModule,
    SummariesModule,
    FavoritesModule,
    SavedModule,
    CommentsModule,
    ChatsModule,
    EventsModule,
    OrdersModule,
    PaymentGatewaysModule,
    PaymentMethodsModule,
    PurchasedProductsModule,
    RatingsModule,
    SellerRatingsModule,
    MailModule,
    NotificationsModule,
    NotificationTypesModule,
    EmailContactsModule,
    ShoppingListModule,
  ],
})
export class AppModule {}

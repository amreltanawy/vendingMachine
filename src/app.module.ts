import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthController } from './presentation/controllers/auth.controller';
import { UserModule } from './modules/user.module';
import { AuthModule } from './modules/auth.module';
import { UserController } from './presentation/controllers/user.controller';
import { ProductController } from './presentation/controllers/product.controller';
import { ProductModule } from './modules/product.module';
import { DatabaseModule } from './modules/database.module';
import { IdempotencyService } from './application/common/services/idempotency.service';

@Module({
  imports: [
    DatabaseModule,
    CqrsModule.forRoot(), // Add this line for global CQRS support
    AuthModule,
    UserModule,
    ProductModule,
  ],
  controllers: [
    AuthController,
    UserController,
    ProductController,
  ],
  providers: [IdempotencyService],
})
export class AppModule { }

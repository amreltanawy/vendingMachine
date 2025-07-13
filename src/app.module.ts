import { Module } from '@nestjs/common';
import { AuthController } from './presentation/controllers/auth.controller';
import { UserModule } from './modules/user.module';
import { AuthModule } from './modules/auth.module';
import { UserController } from './presentation/controllers/user.controller';
import { ProductController } from './presentation/controllers/product.controller';
import { ProductModule } from './modules/product.module';
import { DatabaseModule } from './modules/database.module';

@Module({
  imports: [
    DatabaseModule, // Use the database module instead of inline config
    AuthModule,
    UserModule,
    ProductModule,
  ],
  controllers: [AuthController, UserController, ProductController],
  providers: [],
})
export class AppModule { }

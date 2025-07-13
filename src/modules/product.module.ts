// src/modules/product.module.ts
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';


// Repository Interfaces and Implementations
import { IProductRepository } from '../domain/product/repositories/product.irepository';
import { ProductRepository } from '../infrastructure/database/repositories/product.repository';
import { IProductEventRepository } from '../domain/product-event/repositories/product-event.irepository';
import { ProductEventRepository } from '../infrastructure/database/repositories/product-event.repository';

// Command Handlers
import { CreateProductHandler } from '../application/product/handlers/create-product.handler';
import { UpdateProductHandler } from '../application/product/handlers/update-product.handler';
import { DeleteProductHandler } from '../application/product/handlers/delete-product.handler';
import { PurchaseProductHandler } from '../application/product/handlers/purchase-product.handler';
import { CreateProductEventHandler } from '../application/product-event/handlers/create-product-event.handler';

// Query Handlers
import { GetProductHandler } from '../application/product/handlers/get-product.handler';
import { GetAllProductsHandler } from '../application/product/handlers/get-all-products.handler';
import { GetProductsBySellerHandler } from '../application/product/handlers/get-product-by-seller.handler';
import { GetProductEventsHandler } from '../application/product-event/handlers/get-product-events.handler';

// Application Services
import { ProductApplicationService } from '../application/product/services/product.service';
import { ProductEventApplicationService } from '../application/product-event/services/product-event.service';

// Domain Services
import { ChangeCalculatorService, } from '../domain/vending-machine/service/change-calculator.service';

// Controllers
import { ProductController } from '../presentation/controllers/product.controller';

// External Dependencies
import { UserModule } from './user.module';
import { DatabaseModule } from './database.module';

const CommandHandlers = [
    CreateProductHandler,
    UpdateProductHandler,
    DeleteProductHandler,
    PurchaseProductHandler,
    CreateProductEventHandler,
];

const QueryHandlers = [
    GetProductHandler,
    GetAllProductsHandler,
    GetProductsBySellerHandler,
    GetProductEventsHandler,
];

@Module({
    imports: [
        DatabaseModule,
        CqrsModule,
        UserModule, // Required for user repository dependency
    ],
    controllers: [
        ProductController,
    ],
    providers: [
        // Command and Query Handlers
        ...CommandHandlers,
        ...QueryHandlers,

        // Application Services
        ProductApplicationService,
        ProductEventApplicationService,

        // Domain Services
        ChangeCalculatorService,

        // Repository Implementations
        {
            provide: IProductRepository,
            useClass: ProductRepository,
        },
        {
            provide: IProductEventRepository,
            useClass: ProductEventRepository,
        },

    ],
    exports: [
        // Export services for potential use in other modules
        ProductApplicationService,
        ProductEventApplicationService,
        IProductRepository,
        IProductEventRepository,
        ChangeCalculatorService,
    ],
})
export class ProductModule { }

// src/presentation/controllers/product.controller.ts

import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    UseGuards,
    Request,
    HttpCode,
    HttpStatus,
    UseInterceptors
} from '@nestjs/common';
import { JwtAuthGuard } from '../../infrastructure/security/authentication/jwt-auth.guard';
import { RolesGuard } from '../../infrastructure/security/authorization/roles.guard';
import { Roles } from '../../infrastructure/security/authorization/roles.decorator';
import { ProductApplicationService } from '../../application/product/services/product.service';
import { CreateProductDto } from '../../application/product/dtos/create-product.dto';
import { UpdateProductDto } from '../../application/product/dtos/update-product.dto';
import { ProductResponseDto } from '../../application/product/dtos/product-response.dto';
import { IdempotencyKey } from '../decorators/idempotency.decorator';
import { IdempotencyInterceptor } from '../interceptors/idempotency.interceptor';

/**
 * REST controller for product operations in the vending machine.
 * Handles HTTP requests and delegates to the application service.
 * 
 * @class ProductController
 */
@Controller('products')
@UseInterceptors(IdempotencyInterceptor)
export class ProductController {
    /**
     * Creates an instance of ProductController.
     * 
     * @param {ProductApplicationService} productService - The product application service
     */
    constructor(private readonly productService: ProductApplicationService) { }

    /**
     * Creates a new product.
     * Only sellers can create products.
     * 
     * @param {any} req - The request object containing user information
     * @param {CreateProductDto} createProductDto - The product creation data
     * @returns {Promise<{ id: string; message: string }>} The created product ID and success message
     */
    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('seller')
    @HttpCode(HttpStatus.CREATED)
    async createProduct(
        @Request() req: any,
        @Body() createProductDto: CreateProductDto,
        @IdempotencyKey() idempotencyKey: string
    ): Promise<{ id: string; message: string }> {
        const productId = await this.productService.createProduct(
            req.user.userId,
            createProductDto
        );
        return {
            id: productId,
            message: 'Product created successfully'
        };
    }

    /**
     * Retrieves all products with optional pagination and filtering.
     * Can be accessed by anyone (no authentication required).
     * 
     * @param {number} [page=1] - The page number for pagination
     * @param {number} [limit=10] - The number of products per page
     * @param {string} [sellerId] - Optional filter by seller ID
     * @returns {Promise<ProductResponseDto[]>} Array of product data
     */
    @Get()
    async getAllProducts(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Query('sellerId') sellerId?: string
    ): Promise<ProductResponseDto[]> {
        return await this.productService.getAllProducts(
            Number(page),
            Number(limit),
            sellerId
        );
    }

    /**
     * Retrieves a single product by ID.
     * Can be accessed by anyone (no authentication required).
     * 
     * @param {string} id - The product ID
     * @returns {Promise<ProductResponseDto>} The product data
     */
    @Get(':id')
    async getProduct(@Param('id') id: string): Promise<ProductResponseDto> {
        return await this.productService.getProduct(id);
    }

    /**
     * Updates an existing product.
     * Only the seller who created the product can update it.
     * 
     * @param {any} req - The request object containing user information
     * @param {string} id - The product ID
     * @param {UpdateProductDto} updateProductDto - The product update data
     * @returns {Promise<{ message: string }>} Success message
     */
    @Put(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('seller')
    async updateProduct(
        @Request() req: any,
        @Param('id') id: string,
        @Body() updateProductDto: UpdateProductDto,
        @IdempotencyKey() idempotencyKey: string
    ): Promise<{ message: string }> {
        await this.productService.updateProduct(
            req.user.userId,
            id,
            updateProductDto
        );
        return { message: 'Product updated successfully' };
    }

    /**
     * Deletes a product.
     * Only the seller who created the product can delete it.
     * 
     * @param {any} req - The request object containing user information
     * @param {string} id - The product ID
     * @returns {Promise<{ message: string }>} Success message
     */
    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('seller')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteProduct(
        @Request() req: any,
        @Param('id') id: string,
        @IdempotencyKey() idempotencyKey: string
    ): Promise<{ message: string }> {
        await this.productService.deleteProduct(req.user.userId, id);
        return { message: 'Product deleted successfully' };
    }

    /**
     * Retrieves products created by the authenticated seller.
     * Only sellers can access this endpoint.
     * 
     * @param {any} req - The request object containing user information
     * @param {number} [page=1] - The page number for pagination
     * @param {number} [limit=10] - The number of products per page
     * @returns {Promise<ProductResponseDto[]>} Array of product data
     */
    @Get('seller/my-products')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('seller')
    async getMyProducts(
        @Request() req: any,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10
    ): Promise<ProductResponseDto[]> {
        return await this.productService.getProductsBySeller(
            req.user.userId,
            Number(page),
            Number(limit)
        );
    }
}

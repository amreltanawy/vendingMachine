import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "../../../../src/presentation/controllers/auth.controller";
import { AuthService } from "../../../../src/application/auth/auth.service";
import { BadRequestException } from "@nestjs/common";
import { v4 as uuidv4 } from 'uuid';

type RoleLiteral = 'buyer' | 'seller';

/**
 * Unit tests for AuthController.
 * Tests authentication behavior and error scenarios.
 *
 * @group unit
 * @group controller
 * @group auth
 */
describe("AuthController", () => {
    let controller: AuthController;
    let authService: jest.Mocked<AuthService>;

    beforeEach(async () => {
        // Arrange - Setup test module with mocked dependencies
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: {
                        login: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get(AuthController);
        authService = module.get(AuthService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("login", () => {
        /**
         * Test successful login.
         */
        it("should return access token and user data on successful login", async () => {
            // Arrange
            const loginDto = { username: "testuser", password: "password123" };
            const expectedResult = {
                access_token: "jwt-token",
                user: {
                    id: uuidv4(),
                    username: "testuser",
                    role: "buyer" as RoleLiteral,
                },
            };

            authService.login.mockResolvedValue(expectedResult);

            // Act
            const result = await controller.login(loginDto);

            // Assert
            expect(result).toEqual(expectedResult);
            expect(authService.login).toHaveBeenCalledWith("testuser", "password123");
        });

        /**
         * Test login with invalid credentials.
         */
        it("should throw error for invalid credentials", async () => {
            // Arrange
            const loginDto = { username: "testuser", password: "wrongpassword" };
            const authError = new BadRequestException("Invalid credentials");

            authService.login.mockRejectedValue(authError);

            // Act & Assert
            await expect(controller.login(loginDto)).rejects.toThrow(authError);
            expect(authService.login).toHaveBeenCalledWith("testuser", "wrongpassword");
        });

        /**
         * Test login with missing username.
         */
        it("should handle missing username", async () => {
            // Arrange
            const loginDto = { username: "", password: "password123" };
            const authError = new BadRequestException("Username is required");

            authService.login.mockRejectedValue(authError);

            // Act & Assert
            await expect(controller.login(loginDto)).rejects.toThrow(authError);
        });

        /**
         * Test login with missing password.
         */
        it("should handle missing password", async () => {
            // Arrange
            const loginDto = { username: "testuser", password: "" };
            const authError = new BadRequestException("Password is required");

            authService.login.mockRejectedValue(authError);

            // Act & Assert
            await expect(controller.login(loginDto)).rejects.toThrow(authError);
        });

        /**
         * Test service error propagation.
         */
        it("should propagate service errors", async () => {
            // Arrange
            const loginDto = { username: "testuser", password: "password123" };
            const serviceError = new Error("Database connection failed");

            authService.login.mockRejectedValue(serviceError);

            // Act & Assert
            await expect(controller.login(loginDto)).rejects.toThrow(serviceError);
        });
    });
}); 
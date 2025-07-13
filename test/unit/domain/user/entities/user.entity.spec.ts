import { User } from "../../../../../src/domain/user/entities/user.entity";
import { UserId } from "../../../../../src/domain/user/value-objects/user-id.vo";
import { UserRole } from "../../../../../src/domain/user/value-objects/user-role.vo";
import { Money } from "../../../../../src/domain/shared/value-objects/money.vo";
import { UserCreatedEvent } from "../../../../../src/domain/user/events/user-created.event";
import { DepositAddedEvent } from "../../../../../src/domain/user/events/deposit-added.event";
import { UserRoleException } from "../../../../../src/domain/user/exceptions/user-domain.exceptions";
import { InsufficientFundsException } from "../../../../../src/domain/shared/exceptions/money-domain.exceptions";

/**
 * Unit tests for User domain entity.
 * Tests business logic, invariants, and domain events emission.
 *
 * @group unit
 * @group domain
 * @group user
 */
describe("User Entity", () => {
    let userId: UserId;
    let buyerRole: UserRole;
    let sellerRole: UserRole;
    let deposit: Money;
    let createdAt: Date;
    let updatedAt: Date;

    beforeEach(() => {
        userId = UserId.create();
        buyerRole = UserRole.buyer();
        sellerRole = UserRole.seller();
        deposit = Money.fromCents(0);
        createdAt = new Date();
        updatedAt = new Date();
    });

    describe("create", () => {
        it("should create a user with valid parameters", () => {
            // Arrange
            const username = "testuser";

            // Act
            const user = User.create(userId, username, buyerRole, deposit, createdAt, updatedAt);

            // Assert
            expect(user.id).toBe(userId);
            expect(user.username).toBe(username);
            expect(user.role).toBe(buyerRole);
            expect(user.deposit.cents).toBe(0);
        });

        it("should emit UserCreatedEvent when user is created", () => {
            // Arrange
            const username = "testuser";

            // Act
            const user = User.create(userId, username, buyerRole, deposit, createdAt, updatedAt);

            // Assert
            const events = user.getUncommittedEvents();
            expect(events).toHaveLength(1);
            expect(events[0]).toBeInstanceOf(UserCreatedEvent);
            expect((events[0] as UserCreatedEvent).aggregateId).toBe(userId.value);
        });

        it("should create a seller user correctly", () => {
            // Arrange
            const username = "seller";

            // Act
            const user = User.create(userId, username, sellerRole, deposit, createdAt, updatedAt);

            // Assert
            expect(user.canManageProducts()).toBe(true);
            expect(user.canBuyProduct()).toBe(false);
        });
    });

    describe("addDeposit", () => {
        let buyer: User;

        beforeEach(() => {
            buyer = User.create(userId, "buyer", buyerRole, deposit, createdAt, updatedAt);
        });

        it("should add deposit for buyer role", () => {
            // Arrange
            const depositAmount = Money.fromCents(50);

            // Act
            buyer.addDeposit(depositAmount);

            // Assert
            expect(buyer.deposit.cents).toBe(50);
        });

        it("should accumulate multiple deposits", () => {
            // Arrange
            const firstDeposit = Money.fromCents(50);
            const secondDeposit = Money.fromCents(100);

            // Act
            buyer.addDeposit(firstDeposit);
            buyer.addDeposit(secondDeposit);

            // Assert
            expect(buyer.deposit.cents).toBe(150);
        });

        it("should emit DepositAddedEvent when deposit is added", () => {
            // Arrange
            const depositAmount = Money.fromCents(20);

            // Act
            buyer.addDeposit(depositAmount);

            // Assert
            const events = buyer.getUncommittedEvents();
            expect(events).toHaveLength(2); // UserCreatedEvent + DepositAddedEvent
            expect(events[1]).toBeInstanceOf(DepositAddedEvent);
            expect((events[1] as DepositAddedEvent).amountInCents).toBe(20);
        });

        it("should throw error when seller tries to deposit", () => {
            // Arrange
            const seller = User.create(userId, "seller", sellerRole, deposit, createdAt, updatedAt);
            const depositAmount = Money.fromCents(50);

            // Act & Assert
            expect(() => {
                seller.addDeposit(depositAmount);
            }).toThrow(UserRoleException);
        });
    });

    describe("spendMoney", () => {
        let buyer: User;

        beforeEach(() => {
            const initialDeposit = Money.fromCents(100);
            buyer = User.create(userId, "buyer", buyerRole, initialDeposit, createdAt, updatedAt);
        });

        it("should spend money when sufficient funds available", () => {
            // Arrange
            const spendAmount = Money.fromCents(50);

            // Act
            buyer.spendMoney(spendAmount);

            // Assert
            expect(buyer.deposit.cents).toBe(50);
        });

        it("should spend exact amount when all funds used", () => {
            // Arrange
            const spendAmount = Money.fromCents(100);

            // Act
            buyer.spendMoney(spendAmount);

            // Assert
            expect(buyer.deposit.cents).toBe(0);
        });

        it("should throw error when insufficient funds", () => {
            // Arrange
            const spendAmount = Money.fromCents(150);

            // Act & Assert
            expect(() => {
                buyer.spendMoney(spendAmount);
            }).toThrow(InsufficientFundsException);
        });

        it("should throw error when seller tries to spend money", () => {
            // Arrange
            const seller = User.create(userId, "seller", sellerRole, deposit, createdAt, updatedAt);
            const spendAmount = Money.fromCents(50);

            // Act & Assert
            expect(() => {
                seller.spendMoney(spendAmount);
            }).toThrow(UserRoleException);
        });
    });

    describe("resetDeposit", () => {
        let buyer: User;

        beforeEach(() => {
            const initialDeposit = Money.fromCents(100);
            buyer = User.create(userId, "buyer", buyerRole, initialDeposit, createdAt, updatedAt);
        });

        it("should reset deposit to zero", () => {
            // Act
            buyer.resetDeposit();

            // Assert
            expect(buyer.deposit.cents).toBe(0);
        });

        it("should throw error when seller tries to reset deposit", () => {
            // Arrange
            const seller = User.create(userId, "seller", sellerRole, deposit, createdAt, updatedAt);

            // Act & Assert
            expect(() => {
                seller.resetDeposit();
            }).toThrow(UserRoleException);
        });
    });
}); 
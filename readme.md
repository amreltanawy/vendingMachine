<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" class="logo" width="120"/>

# Vending Machine API

A robust, production-ready NestJS API for a vending machine system, built with
**Clean Architecture**, **Domain-Driven Design (DDD)**, and **CQRS** principles.
Features comprehensive user management, product operations, secure transactions,
and idempotency support.

This project with made with the help of an AI tool perplexity labs
[here](https://www.perplexity.ai/search/you-are-tasked-with-generating-2Gy.abkZSPCePWlxagxCNw)
is the conversation url

The git repository used in this project is accessible through
[this link](https://github.com/amreltanawy/vendingMachine)

## 🚀 Features

- **User Management**: Buyer and seller roles with authentication
- **Product Management**: CRUD operations for vending machine products
- **Purchase System**: Complete transaction flow with change calculation
- **Deposit Management**: Coin-based deposit system with valid denominations
- **Idempotency**: Redis-based request deduplication for safe retries
- **Audit Trail**: Complete product event tracking
- **Role-Based Authorization**: JWT-based authentication with role guards
- **Comprehensive Testing**: Unit, integration, and E2E test suites

## 📁 Project Structure

```
src/
├── domain/                
├── application/         # Use cases, application services, CQRS commands/queries/handlers
├── infrastructure/      # External concerns (database, security, mappers, adapters)
├── presentation/        # Controllers, filters, pipes (HTTP layer)
├── modules/             # NestJS modules (bounded contexts)
├── app.module.ts        # Main application module
test/
├── unit/                # Unit tests (domain, application logic)
├── integration/         # Integration tests (repositories, infrastructure)
├── e2e/                 # End-to-end tests (API workflows)
```

### Layer Description

- **Domain:** Pure business logic, no dependencies on frameworks or
  infrastructure.
- **Application:** Orchestrates use cases, thin services, CQRS handlers.
- **Infrastructure:** Implements interfaces for persistence, authentication, and
  external services.
- **Presentation:** HTTP controllers, request validation, exception handling.

## Coding Conventions

- **Clean Architecture:** All dependencies point inward; domain is
  framework-agnostic.
- **SOLID Principles:** Each class, service, or module has a single
  responsibility; abstractions are favored over concrete implementations.
- **Domain-Driven Design:**
  - Ubiquitous language in code, reflecting business concepts.
  - Rich domain models (aggregates, value objects).
  - Explicit bounded contexts mapped to modules.
- **CQRS:** Commands mutate state, queries fetch data.
- **Testing:**
  - Test-first (TDD) approach.
  - Unit tests for business logic.
  - Integration and E2E tests for workflows.
- **Error Handling:** Explicit exceptions, global exception filter for API
  responses.
- **Validation:** DTOs validated with `class-validator`.
- **Consistent Naming:**
  - Classes: `PascalCase`
  - Variables/functions: `camelCase`
  - DTOs: `*Dto`
  - Handlers: `*Handler`
  - Value Objects: `*Vo`
- **Directory Structure:** Follows Clean Architecture and DDD boundaries.

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm (v9+)
- PostgreSQL (or use Docker for local development)

### Installation

```bash
npm install
```

### Database Setup

- Configure your `.env` file (see
  [Environment Variables](#environment-variables)).
- Run database migrations (if needed):

```bash
npm run migration:run
```

### Running the Application

```bash
npm run start:dev
```

The API will be available at `http://localhost:3000`.

## Available Commands

| Command                    | Description                                  |
| :------------------------- | :------------------------------------------- |
| `npm run start:dev`        | Start the server in development mode (watch) |
| `npm run start:prod`       | Start the server in production mode          |
| `npm run build`            | Compile TypeScript to JavaScript             |
| `npm run test`             | Run all unit and integration tests           |
| `npm run test:watch`       | Watch and rerun tests on file changes        |
| `npm run test:cov`         | Run tests with coverage report               |
| `npm run test:e2e`         | Run end-to-end (E2E) tests                   |
| `npm run lint`             | Lint and auto-fix code style issues          |
| `npm run format`           | Format code using Prettier                   |
| `npm run migration:run`    | Run database migrations                      |
| `npm run migration:create` | Create a new migration file                  |
| `npm run migration:revert` | Revert the last migration                    |

## Environment Variables

Create a `.env` file at the project root:

```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=vending_machine
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRATION=3600
NODE_ENV=development
PORT=3000
LOG_LEVEL=debug
```

## Testing

- **Unit Tests:**

```bash
npm run test
```

- **Integration Tests:**

```bash
npm run test
```

- **E2E Tests:**

```bash
npm run test:e2e
```

Test coverage reports are generated with:

```bash
npm run test:cov
```

## Docker Usage

### Build and Run with Docker Compose

```bash
docker-compose up --build
```

- The API will be available at `http://localhost:3000`.
- PostgreSQL will be available at port `5432`.

## Additional Notes

- **API Documentation:** The API follows REST principles and consumes/produces
  `application/json`.
- **Security:** JWT authentication and role-based authorization are enforced.
- **Validation \& Error Handling:** All endpoints validate input and return
  clear error messages.
- **Extensibility:** The architecture allows easy addition of new features,
  domains, or integrations.

For any questions or contributions, please refer to the codebase and follow the
outlined conventions for consistency and maintainability.

<div style="text-align: center">⁂</div>

[^1]: FlapKap-Backend-Challenge.pdf

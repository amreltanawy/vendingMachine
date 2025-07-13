import 'reflect-metadata';

// Configure Jest timeout
jest.setTimeout(30000);

// Mock Redis for unit tests
jest.mock('ioredis', () => {
    return jest.fn().mockImplementation(() => ({
        get: jest.fn(),
        set: jest.fn(),
        setex: jest.fn(),
        del: jest.fn(),
        exists: jest.fn(),
        expire: jest.fn(),
        disconnect: jest.fn(),
    }));
});

// Mock bcrypt for consistent testing
jest.mock('bcryptjs', () => ({
    hash: jest.fn().mockResolvedValue('hashed_password'),
    compare: jest.fn().mockResolvedValue(true),
    genSalt: jest.fn().mockResolvedValue('salt'),
}));

// Global test utilities
global.console = {
    ...console,
    // Uncomment to suppress console output during tests
    log: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
};

// Clean up after each test
afterEach(() => {
    jest.clearAllMocks();
});

// Global error handler for unhandled promises
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
}); 
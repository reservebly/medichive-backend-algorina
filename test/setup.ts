import 'reflect-metadata';

// Mock environment variables for testing
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.DATABASE_URL = 'file:./test.db';
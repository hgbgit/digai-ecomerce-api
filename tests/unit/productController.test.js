const request = require('supertest');
const app = require('../../src/index');
const Product = require('../../src/models/Product');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri(), { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('Product Controller', () => {
    it('should create a product', async () => {
        const res = await request(app)
            .post('/api/products')
            .send({
                name: 'Test Product',
                description: 'Test Description',
                price: 100,
                stock: 50
            });

        expect(res.status).toBe(201);
        expect(res.body.name).toBe('Test Product');
    });
});

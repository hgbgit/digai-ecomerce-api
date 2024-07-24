const request = require('supertest');
const app = require('../../src/index');
const {startMockServer, stopMockServer, getMockToken} = require("./helpers");

beforeAll(startMockServer);

afterAll(stopMockServer);

describe('Product Controller', () => {
    it('should create a product', async () => {
        const res = await request(app)
            .post('/api/products')
            .set('Authorization', `Bearer ${getMockToken()}`)
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

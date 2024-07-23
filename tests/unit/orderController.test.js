const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../src/index');
const Order = require('../../src/models/Order');
const User = require('../../src/models/User');
const Product = require('../../src/models/Product');

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('Order Controller', () => {
    let user, product, token;

    beforeEach(async () => {
        await User.deleteMany({});
        await Product.deleteMany({});
        await Order.deleteMany({});

        user = new User({ name: 'Test User', email: 'test@example.com', password: 'password' });
        await user.save();

        product = new Product({ name: 'Test Product', description: 'Test Description', price: 100, stock: 10 });
        await product.save();

        token = user.generateAuthToken();
    });

    test('should create a new order', async () => {
        const res = await request(app)
            .post('/api/orders')
            .set('Authorization', token)
            .send({ userId: user._id, products: [{ productId: product._id, quantity: 1 }] });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('_id');
        expect(res.body.products[0].productId).toBe(String(product._id));
    });

    test('should not create an order with invalid data', async () => {
        const res = await request(app)
            .post('/api/orders')
            .set('Authorization', token)
            .send({ userId: user._id, products: [{ productId: 'invalid-id', quantity: 1 }] });

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error');
    });

    test('should get a specific order', async () => {
        const order = new Order({ userId: user._id, products: [{ productId: product._id, quantity: 1 }], status: 'pending' });
        await order.save();

        const res = await request(app)
            .get(`/api/orders/${order._id}`)
            .set('Authorization', token);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('_id');
        expect(res.body._id).toBe(String(order._id));
    });

    test('should return 404 for non-existent order', async () => {
        const res = await request(app)
            .get(`/api/orders/${mongoose.Types.ObjectId()}`)
            .set('Authorization', token);

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('error');
    });

    test('should update order status', async () => {
        const order = new Order({ userId: user._id, products: [{ productId: product._id, quantity: 1 }], status: 'pending' });
        await order.save();

        const res = await request(app)
            .put(`/api/orders/${order._id}`)
            .set('Authorization', token)
            .send({ status: 'shipped' });

        expect(res.status).toBe(200);
        expect(res.body.status).toBe('shipped');
    });

    test('should not update with invalid status', async () => {
        const order = new Order({ userId: user._id, products: [{ productId: product._id, quantity: 1 }], status: 'pending' });
        await order.save();

        const res = await request(app)
            .put(`/api/orders/${order._id}`)
            .set('Authorization', token)
            .send({ status: 'invalid-status' });

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error');
    });

    test('should list all orders of a user', async () => {
        const order1 = new Order({ userId: user._id, products: [{ productId: product._id, quantity: 1 }], status: 'pending' });
        const order2 = new Order({ userId: user._id, products: [{ productId: product._id, quantity: 2 }], status: 'pending' });
        await order1.save();
        await order2.save();

        const res = await request(app)
            .get(`/api/orders/user/${user._id}`)
            .set('Authorization', token);

        expect(res.status).toBe(200);
        expect(res.body.length).toBe(2);
    });

    test('should return empty list if user has no orders', async () => {
        const res = await request(app)
            .get(`/api/orders/user/${mongoose.Types.ObjectId()}`)
            .set('Authorization', token);

        expect(res.status).toBe(200);
        expect(res.body.length).toBe(0);
    });
});

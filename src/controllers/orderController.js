const Order = require('../models/Order');

exports.createOrder = async (req, res) => {
    const {userId, products} = req.body;
    const order = new Order({userId, products, status: 'pending'});
    await order.save();
    res.status(201).json(order);
};

exports.updateOrder = async (req, res) => {
    const {id} = req.params;
    const {status} = req.body;
    const order = await Order.findByIdAndUpdate(id, {status}, {new: true});

    if (!order)
        return res.status(404).json({error: 'Order not found'});
    res.status(200).json(order);
};

exports.getOrder = async (req, res) => {
    const {id} = req.params;
    const order = await Order.findById(id);

    if (!order)
        return res.status(404).json({error: 'Order not found'});

    res.status(200).json(order);
};

exports.getUserOrders = async (req, res) => {
    const {userId} = req.params;
    const orders = await Order.find({userId});
    res.status(200).json(orders);
};


const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
    products: [{productId: mongoose.Schema.Types.ObjectId, quantity: Number}],
    status: {type: String, default: 'pending'}
}, {timestamps: true});

module.exports = mongoose.model('Order', orderSchema);


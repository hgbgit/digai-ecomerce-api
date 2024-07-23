const Product = require('../models/Product');

exports.createProduct = async (req, res) => {
    const {name, description, price, stock} = req.body;
    const product = new Product({name, description, price, stock});
    await product.save();
    res.status(201).json(product);
};

exports.updateProduct = async (req, res) => {
    const {id} = req.params;
    const {name, description, price, stock} = req.body;
    const product = await Product.findByIdAndUpdate(id, {name, description, price, stock}, {new: true});

    if (!product)
        return res.status(404).json({error: 'Product not found'});
    res.status(200).json(product);
};

exports.deleteProduct = async (req, res) => {
    const {id} = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product)
        return res.status(404).json({error: 'Product not found'});

    res.status(200).json({message: 'Product deleted successfully'});
};

exports.getProduct = async (req, res) => {
    const {id} = req.params;
    const product = await Product.findById(id);

    if (!product)
        return res.status(404).json({error: 'Product not found'});

    res.status(200).json(product);
};

exports.getProducts = async (req, res) => {
    const products = await Product.find();
    res.status(200).json(products);
};


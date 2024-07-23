const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.post('/', [auth, admin], productController.createProduct);
router.put('/:id', [auth, admin], productController.updateProduct);
router.delete('/:id', [auth, admin], productController.deleteProduct);
router.get('/:id', productController.getProduct);
router.get('/', productController.getProducts);

module.exports = router;


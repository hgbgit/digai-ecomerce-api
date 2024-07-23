const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/auth');

router.post('/', auth, orderController.createOrder);
router.put('/:id', auth, orderController.updateOrder);
router.get('/:id', auth, orderController.getOrder);
router.get('/user/:userId', auth, orderController.getUserOrders);

module.exports = router;


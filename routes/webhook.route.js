const express = require('express');
const {
    completeCompanyOrder
} = require('../controllers/company-order.controller');
const { completeUserOrder } = require('../controllers/user-order.controller');
const { verifyRazorWare } = require('../helpers/razorPay.helper');
const router = express.Router();

router.post('/razorpay', verifyRazorWare, completeCompanyOrder);
router.get('/delhivery/:id', completeUserOrder);

const webhookRouter = (app) => {
    app.use('/webhook', router);
};

module.exports = webhookRouter;

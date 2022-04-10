const express = require('express');
const {
    createCompanyOrder,
    allCompanyOrders,
    myCompanyOrders
} = require('../controllers/company-order.controller');
const { validate } = require('../helpers/jwt.helper');
const { ensurePermission } = require('../helpers/permission.helper');
const router = express.Router();

router.post('/create', createCompanyOrder);
router.get('/my', myCompanyOrders);
router.get('/all', ensurePermission('*'), allCompanyOrders);

const companyOrderRouter = (app) => {
    app.use('/company-order', validate, router);
};

module.exports = companyOrderRouter;

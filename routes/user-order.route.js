const express = require('express');
const {
    createUserOrder,
    myUserOrders,
    allUserOrders
} = require('../controllers/user-order.controller');
const { validate } = require('../helpers/jwt.helper');
const { ensurePermission } = require('../helpers/permission.helper');
const router = express.Router();

router.post('/create', createUserOrder);
router.get('/my', myUserOrders);
router.get('/all', ensurePermission('*'), allUserOrders);

const userOrderRouter = (app) => {
    app.use('/user-order', validate, router);
};

module.exports = userOrderRouter;

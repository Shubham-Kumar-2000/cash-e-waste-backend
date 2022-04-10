const authRouter = require('./auth.route');
const companyOrderRouter = require('./company-order.route');
const itemRouter = require('./item.route');
const userOrderRouter = require('./user-order.route');
const userRouter = require('./users.route');
const webhookRouter = require('./webhook.route');

const router = (app) => {
    userRouter(app);
    authRouter(app);
    companyOrderRouter(app);
    itemRouter(app);
    userOrderRouter(app);
    webhookRouter(app);
};

module.exports = router;

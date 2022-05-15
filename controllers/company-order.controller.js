const { COMPANY_ORDER_STATUS } = require('../config/constants');
const CustomError = require('../errors/custom.error');
const NotFoundError = require('../errors/notFound.error');
const { generateOrder } = require('../helpers/razorPay.helper');
const Item = require('../models/items.model');
const CompanyOrder = require('../models/company-orders.model');

exports.createCompanyOrder = async (req, res, next) => {
    try {
        const items = await Item.find({
            _id: {
                $in: req.body.items.map((item) => item._id)
            }
        });
        if (items.length == 0) {
            throw new NotFoundError('Items not found');
        }

        const orderItems = items.map((item) => {
            if (
                item.stock <
                req.body.items.find(
                    (item) => String(item._id) == String(item._id)
                ).quantity
            ) {
                throw new CustomError('Not enough stock');
            }
            return {
                itemId: item._id,
                itemName: item.name,
                price: item.price,
                quantity: req.body.items.find(
                    (item) => String(item._id) == String(item._id)
                ).quantity
            };
        });
        const order = new CompanyOrder({
            userId: req.user._id,
            items: orderItems,
            total: orderItems.reduce(
                (acc, item) => acc + item.price * item.quantity,
                0
            )
        });

        const razorpayOrder = await generateOrder(
            order.total,
            'INR',
            order._id
        );
        order.orderId = razorpayOrder.id;

        await order.save();

        res.status(200).json({
            order
        });
    } catch (e) {
        next(e);
    }
};

exports.completeCompanyOrder = async (req, res, next) => {
    try {
        res.status(200).json({
            err: false
        });
        const order = await CompanyOrder.getPendingById(
            req.body.payload.order.entity.receipt
        );
        if (!order) {
            throw new NotFoundError('Order not found');
        }
        if (!order.userId) {
            throw new NotFoundError('User not found');
        }

        order.status = COMPANY_ORDER_STATUS.PAID;
        await order.save();

        await Promise.all(
            order.items.map((item) =>
                Item.updateItemStock(item.itemId, 0 - item.quantity)
            )
        );

        res.status(200).json({
            order
        });
    } catch (e) {
        next(e);
    }
};

exports.myCompanyOrders = async (req, res, next) => {
    try {
        const orders = await CompanyOrder.find({
            userId: req.user._id
        }).sort({ createdAt: -1 });

        res.status(200).json({
            orders
        });
    } catch (e) {
        next(e);
    }
};

exports.allCompanyOrders = async (req, res, next) => {
    try {
        const orders = await CompanyOrder.find({ ...req.query }).sort({
            createdAt: -1
        });

        res.status(200).json({
            orders
        });
    } catch (e) {
        next(e);
    }
};

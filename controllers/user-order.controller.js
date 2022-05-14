const { USER_ORDER_STATUS } = require('../config/constants');
const NotFoundError = require('../errors/notFound.error');
const { decrypt } = require('../helpers/crypto.helper');
const Item = require('../models/items.model');
const UserOrder = require('../models/user-orders.model');
const User = require('../models/user.model');
const Fire = require('../helpers/5ire.helper');

exports.createUserOrder = async (req, res, next) => {
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
            return {
                itemId: item._id,
                itemName: item.name,
                coins: item.coins,
                quantity: req.body.items.find(
                    (item) => String(item._id) == String(item._id)
                ).quantity
            };
        });
        const order = new UserOrder({
            userId: req.user._id,
            items: orderItems,
            totalCoins: orderItems.reduce(
                (acc, item) => acc + item.coins * item.quantity,
                0
            ),
            location: req.body.location
        });

        await order.save();

        res.status(200).json({
            order
        });
    } catch (e) {
        next(e);
    }
};

exports.completeUserOrder = async (req, res, next) => {
    try {
        const order = await UserOrder.getPendingById(req.params.id);
        if (!order) {
            throw new NotFoundError('Order not found');
        }
        if (!order.userId) {
            throw new NotFoundError('User not found');
        }

        const user = order.userId;
        if (user.wallet) {
            order.txHash = await Fire.transfer(
                decrypt(user.wallet.address),
                order.totalCoins
            );
        } else {
            await User.addPendingCoins(user._id, order.totalCoins);
        }

        order.status = USER_ORDER_STATUS.COMPLETED;
        await order.save();

        await Promise.all(
            order.items.map((item) =>
                Item.updateItemStock(item.itemId, item.quantity)
            )
        );

        res.status(200).json({
            order
        });
    } catch (e) {
        next(e);
    }
};

exports.myUserOrders = async (req, res, next) => {
    try {
        const orders = await UserOrder.find({
            userId: req.user._id
        }).sort({ createdAt: -1 });

        res.status(200).json({
            orders
        });
    } catch (e) {
        next(e);
    }
};

exports.allUserOrders = async (req, res, next) => {
    try {
        const orders = await UserOrder.find({ ...req.query }).sort({
            createdAt: -1
        });

        res.status(200).json({
            orders
        });
    } catch (e) {
        next(e);
    }
};

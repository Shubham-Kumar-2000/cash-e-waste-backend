const mongoose = require('mongoose');
const configConsts = require('../config/constants');
const addressSchema = require('./address.model');

const orderItemsSchema = new mongoose.Schema({
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'item' },
    itemName: { type: String, default: null },
    quantity: { type: Number, default: 1 },
    coins: { type: Number, default: 0 }
});

const userOrderSchema = new mongoose.Schema(
    {
        location: { type: addressSchema },
        items: { type: [orderItemsSchema], default: [] },
        totalCoins: { type: Number, default: 0.1 },
        status: {
            type: String,
            default: configConsts.USER_ORDER_STATUS.PENDING,
            enum: Object.values(configConsts.USER_ORDER_STATUS)
        },
        txHash: { type: String, default: null },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        }
    },
    { timestamps: true }
);

userOrderSchema.statics.getPendingById = (id) => {
    return UserOrder.findOne({
        _id: id,
        status: configConsts.USER_ORDER_STATUS.PENDING
    }).populate('userId');
};

const UserOrder = mongoose.model('user-order', userOrderSchema);
module.exports = UserOrder;

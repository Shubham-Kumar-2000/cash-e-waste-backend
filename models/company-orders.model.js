const mongoose = require('mongoose');
const configConsts = require('../config/constants');

const orderItemsSchema = new mongoose.Schema({
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'item' },
    itemName: { type: String, default: null },
    quantity: { type: Number, default: 1 },
    price: { type: Number, default: 0 }
});

const companyOrderSchema = new mongoose.Schema(
    {
        items: { type: [orderItemsSchema], default: [] },
        total: { type: Number, default: 0.1 },
        status: {
            type: String,
            default: configConsts.COMPANY_ORDER_STATUS.PENDING,
            enum: Object.values(configConsts.COMPANY_ORDER_STATUS)
        },
        orderId: { type: String, default: null },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        }
    },
    { timestamps: true }
);

companyOrderSchema.statics.getPendingById = (id) => {
    return CompanyOrder.findOne({
        _id: id,
        status: configConsts.COMPANY_ORDER_STATUS.PENDING
    }).populate('userId');
};

const CompanyOrder = mongoose.model('company-order', companyOrderSchema);
module.exports = CompanyOrder;

const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
    {
        name: { type: String, default: null },

        company: { type: String, required: false },
        stock: { type: Number, default: 0 },
        coins: { type: Number, default: 0.1 },
        price: { type: Number, default: 100 },

        avatar: { type: String, default: null }
    },
    { timestamps: true }
);

itemSchema.index({ name: 1, company: 1 }, { unique: true });

itemSchema.statics.getCompanies = () => {
    return Item.distinct('company');
};

itemSchema.statics.updateItem = (id, update) => {
    return Item.findOneAndUpdate(
        {
            _id: id
        },
        { $set: update },
        {
            new: true
        }
    );
};

itemSchema.statics.updateItemStock = (id, stock) => {
    return Item.findOneAndUpdate(
        {
            _id: id
        },
        { $inc: { stock } },
        {
            new: true
        }
    );
};

const Item = mongoose.model('item', itemSchema);
module.exports = Item;

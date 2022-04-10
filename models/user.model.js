const mongoose = require('mongoose');
const configConsts = require('../config/constants');

const walletSchema = new mongoose.Schema({
    publicKey: { type: String },
    address: { type: String },
    name: { type: String }
});

const userSchema = new mongoose.Schema(
    {
        name: { type: String, default: null },

        phone: { type: String, required: false },
        wallet: { type: walletSchema },
        email: {
            type: String,
            unique: true
        },

        status: { type: String, default: configConsts.USER_STATUS.ACTIVE },
        permissions: {
            type: [String],
            default: []
        },
        avatar: { type: String, default: null },
        pendingCoins: { type: Number, default: 0 }
    },
    { timestamps: true }
);

userSchema.statics.checkIfUserExists = function (username, kind) {
    const where = {
        status: {
            $in: [
                configConsts.USER_STATUS.ACTIVE,
                configConsts.USER_STATUS.DELETED
            ]
        }
    };
    if (!kind) {
        where['email'] = username;
    } else {
        where[kind] = username;
    }
    return this.findOne(where);
};

userSchema.statics.getUser = (userId) => {
    return User.findOne({
        _id: userId,
        status: configConsts.USER_STATUS.ACTIVE
    });
};

userSchema.statics.disconnectWallet = (userId) => {
    return User.findOneAndUpdate(
        {
            _id: userId,
            status: configConsts.USER_STATUS.ACTIVE
        },
        {
            $unset: {
                wallet: ''
            }
        },
        { new: true }
    );
};

userSchema.statics.addPendingCoins = (userId, coins) => {
    return User.findOneAndUpdate(
        {
            _id: userId,
            status: configConsts.USER_STATUS.ACTIVE
        },
        {
            $inc: {
                pendingCoins: coins
            }
        },
        { new: true }
    );
};

const User = mongoose.model('user', userSchema);
module.exports = User;

const NotFoundError = require('../errors/notFound.error');
const User = require('../models/user.model');
const Fire = require('../helpers/5ire.helper');
const { encrypt, decrypt } = require('../helpers/crypto.helper');

exports.profile = async (req, res, next) => {
    try {
        const user = await User.getUser(req.user._id);
        if (!user) {
            throw new NotFoundError('User not found');
        }
        res.status(200).json({
            err: false,
            user
        });
    } catch (e) {
        next(e);
    }
};

exports.connectWallet = async (req, res, next) => {
    try {
        const user = await User.getUser(req.user._id);
        if (!user) {
            throw new NotFoundError('User not found');
        }
        let phrase = req.body.phrase;
        if (!phrase) {
            phrase = await Fire.createAccount(`${user.name}'s wallet`);
        }

        const userRing = await Fire.getKeyRing(phrase);

        user.wallet = {
            publicKey: encrypt(JSON.stringify(Array.from(userRing.publicKey))),
            address: encrypt(userRing.address),
            name: userRing.meta.name
        };

        await Fire.transfer(userRing.address, user.pendingCoins);
        user.pendingCoins = 0;

        await user.save();

        res.status(200).json({
            error: false,
            user,
            phrase
        });
    } catch (e) {
        next(e);
    }
};

exports.disconnectWallet = async (req, res, next) => {
    try {
        const user = await User.disconnectWallet(req.user._id);
        if (!user) {
            throw new NotFoundError('User not found');
        }

        res.status(200).json({
            error: false,
            user
        });
    } catch (e) {
        next(e);
    }
};

exports.getBalance = async (req, res, next) => {
    try {
        const user = await User.getUser(req.user._id);
        if (!user) {
            throw new NotFoundError('User not found');
        }
        if (!user.wallet) {
            throw new Error('Wallet not connected');
        }
        const wallet = await Fire.getBalance(Uint8Array.from(JSON.parse(decrypt(user.wallet.publicKey))));

        res.status(200).json({
            wallet
        });
    } catch (e) {
        next(e);
    }
};

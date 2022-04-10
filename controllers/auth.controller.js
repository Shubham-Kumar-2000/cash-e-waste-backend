// const { encrypt } = require('../helpers/crypto.helper');
const { sign } = require('../helpers/jwt.helper');
const User = require('../models/user.model');

exports.login = async (req, res, next) => {
    try {
        let existingUser = await User.checkIfUserExists(
            req.user.email,
            'email'
        );
        if (!existingUser) {
            const user = new User({
                name: req.user.name,
                email: req.user.email,
                phone: req.user.phone,
                avatar: req.user.avatar
            });
            await user.save();
            existingUser = user;
        }
        const token = sign({
            _id: existingUser._id,
            name: existingUser.name,
            permissions: existingUser.permissions,
            avatar: existingUser.avatar
        });
        res.status(200).json({
            error: false,
            token,
            user: existingUser
        });
    } catch (e) {
        next(e);
    }
};

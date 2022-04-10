const RazorPay = require('razorpay');
const instance = new RazorPay({
    key_id: process.env.RAZOR_ID,
    key_secret: process.env.RAZOR_SECRET
});

exports.generateOrder = (amount, currency, receipt) => {
    return instance.orders.create({
        amount: amount * 100, // amount in the smallest currency unit
        currency,
        receipt,
        payment_capture: '1'
    });
};

exports.verifyRazorWare = (req, res, next) => {
    if (
        RazorPay.validateWebhookSignature(
            JSON.stringify(req.body),
            req.headers['x-razorpay-signature'],
            process.env.RAZOR_WEBHOOK_SECRET
        )
    )
        next();
    else
        res.status(400).json({
            err: true,
            msg: 'Razor Validation failed'
        });
};

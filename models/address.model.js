const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const addressSchema = new Schema(
    {
        name: { type: String },
        address: { type: String },
        city: { type: String },
        state: { type: String },
        pincode: { type: String, default: '700000' },
        country: { type: String, default: 'IN' },
        geoLocation: {
            type: { type: String, default: 'Point' },
            coordinates: { type: [Number], default: [0, 0] }
        }
    },
    { timestamps: true }
);

addressSchema.index({ address: 'text', city: 'text', state: 'text' });
addressSchema.index({ geoLocation: '2dsphere' });

module.exports = addressSchema;

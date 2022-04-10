const NotFoundError = require('../errors/notFound.error');
const Item = require('../models/items.model');

exports.getCompanies = async function (req, res, next) {
    try {
        const companies = await Item.getCompanies();

        res.status(200).json({
            companies
        });
    } catch (e) {
        next(e);
    }
};

exports.getItems = async function (req, res, next) {
    try {
        const filter = {};
        if (req.query.company) filter.company = req.query.company;

        const items = await Item.find(filter);

        res.status(200).json({
            items
        });
    } catch (e) {
        next(e);
    }
};

exports.addItem = async function (req, res, next) {
    try {
        const item = new Item(req.body);
        await item.save();

        res.status(200).json({
            item
        });
    } catch (e) {
        next(e);
    }
};

exports.updateItems = async function (req, res, next) {
    try {
        const item = await Item.updateItem(req.params.id, req.body);
        if (!item) {
            throw new NotFoundError('Item not found');
        }
        res.status(200).json({
            item
        });
    } catch (e) {
        next(e);
    }
};

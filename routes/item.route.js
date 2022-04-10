const express = require('express');
const {
    getCompanies,
    getItems,
    addItem,
    updateItems
} = require('../controllers/item.controller');
const { validate } = require('../helpers/jwt.helper');
const { ensurePermission } = require('../helpers/permission.helper');
const router = express.Router();

router.get('/companies', getCompanies);
router.get('/', getItems);
router.post('/add', validate, ensurePermission('*'), addItem);
router.post('/update/:id', validate, ensurePermission('*'), updateItems);

const itemRouter = (app) => {
    app.use('/item', router);
};

module.exports = itemRouter;

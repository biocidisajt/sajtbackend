const { check } = require('express-validator');

exports.walletCreateValidator = [
    check('name')
        .not()
        .isEmpty()
        .withMessage('Name is required')
];

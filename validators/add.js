const { check } = require('express-validator');

exports.addCreateValidator = [
    check('name')
        .not()
        .isEmpty()
        .withMessage('Name is required')
];

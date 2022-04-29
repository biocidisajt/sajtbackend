const { check } = require('express-validator');

exports.iconCreateValidator = [
    check('name')
        .not()
        .isEmpty()
        .withMessage('Name is required')
     
];

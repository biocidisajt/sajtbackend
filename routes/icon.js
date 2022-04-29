const express = require('express');
const router = express.Router();
const { create, list,  remove,read } = require('../controllers/icon');

// validators
const { runValidation } = require('../validators');
const { iconCreateValidator } = require('../validators/icon');
const { requireSignin, adminMiddleware } = require('../controllers/auth');

router.post('/icon', iconCreateValidator, runValidation, requireSignin, adminMiddleware, create);
router.get('/icons', list);
router.get('/icon/:slug', read);
router.delete('/icon/:slug', requireSignin, adminMiddleware, remove);

module.exports = router;

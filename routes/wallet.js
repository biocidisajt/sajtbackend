const express = require('express');
const router = express.Router();
const { create, list,  remove,read } = require('../controllers/wallet');

// validators
const { runValidation } = require('../validators');
const { walletCreateValidator } = require('../validators/wallet');
const { requireSignin, adminMiddleware } = require('../controllers/auth');

router.post('/wallet', walletCreateValidator, runValidation, requireSignin, adminMiddleware, create);
router.get('/wallets', list);
router.get('/wallet/:slug', read);
router.delete('/wallet/:slug', requireSignin, adminMiddleware, remove);

module.exports = router;

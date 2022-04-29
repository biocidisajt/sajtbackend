const express = require('express');
const router = express.Router();
const {    create,
    list,
    listAllAdds,
    read,
    remove,
    update,
    photo,
  listByUser,
    listSearch,
} = require('../controllers/recommended');

// validators
const { requireSignin, adminMiddleware, authMiddleware, canUpdateDeleteAdd } = require('../controllers/auth');

router.post('/recommended', requireSignin, adminMiddleware, create);
router.get('/recommendeds', list);
router.post('/recommendeds-adds', listAllAdds);
router.get('/recommended/:slug', read);
router.delete('/recommended/:slug', requireSignin, adminMiddleware, remove);
router.put('/recommended/:slug', requireSignin, adminMiddleware, update);
router.get('/recommended/photo/:slug', photo);

router.get('/recommendeds/search', listSearch);


// auth user recommended crud
router.post('/user/recommended', requireSignin, authMiddleware, create);
router.get('/:username/recommendeds', listByUser);
router.delete('/user/recommended/:slug', requireSignin, authMiddleware, canUpdateDeleteAdd, remove);
router.put('/user/recommended/:slug', requireSignin, authMiddleware, canUpdateDeleteAdd, update);


module.exports = router;

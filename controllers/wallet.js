const Wallet = require('../models/wallet');
const slugify = require('slugify');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.create = (req, res) => {
    const { name,walletSymbol,walletAddress,walletMinet } = req.body;
    let slug = slugify(name).toLowerCase();
    let wallet = new Wallet({ name, slug ,walletSymbol,walletAddress,walletMinet });

    wallet.save((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(data);
    });
};

exports.list = (req, res) => {
  Wallet.find({})
    .sort({ createdAt: -1 })
    .exec((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(data);
    });
};

exports.read = (req, res) => {
    const slug = req.params.slug.toLowerCase();

Wallet.findOne({ slug })
    .sort({ createdAt: -1 })
    .select('slug name walletSymbol walletAddress walletMinet')
    .exec((err, wallet) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        // res.json(category);
        
                res.json({wallet: wallet});
            });
    
};

exports.remove = (req, res) => {
    const slug = req.params.slug.toLowerCase();

  Wallet.findOneAndRemove({ slug }).exec((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({
            message: 'wallet deleted successfully'
        });
    });
};
const Icon = require('../models/icon');
const slugify = require('slugify');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.create = (req, res) => {
    const { name,iconLink,iconCode } = req.body;
    let slug = slugify(name).toLowerCase();
    let icon = new Icon({ name, slug ,iconLink,iconCode });

    icon.save((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(data);
    });
};

exports.list = (req, res) => {
   Icon.find({})
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

   Icon.findOne({ slug })
    .sort({ createdAt: -1 })
    .select('slug name iconLink iconCode ')
    .exec((err, icon) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        // res.json(category);
        
                res.json({icon: icon});
            });
    
};

exports.remove = (req, res) => {
    const slug = req.params.slug.toLowerCase();

    Icon.findOneAndRemove({ slug }).exec((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({
            message: 'Icon deleted successfully'
        });
    });
};
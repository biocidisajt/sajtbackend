
const Add = require('../models/recommended');
const Category = require('../models/category');
const Tag = require('../models/tag');
const User = require('../models/user');
const formidable = require('formidable');
const slugify = require('slugify');
const stripHtml = require('string-strip-html');
const _ = require('lodash');
const { errorHandler } = require('../helpers/dbErrorHandler');
const fs = require('fs');
const { smartTrim } = require('../helpers/recommended');

exports.create = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        console.log("fields, files => ", fields, files);
        if (err) {
            return res.status(400).json({
                error: 'Image could not upload'
            });
        }
        const photo=files;

        const { title,addLink,body,expdate,addimg } = fields;

        if (!title || !title.length) {
            return res.status(400).json({
                error: 'title is required'
            });
        }
        if (!addimg || !addimg.length) {
            return res.status(400).json({
                error: 'image is required'
            });
        }
          
        let add = new Add();
      
        add.title = title;
       add.addLink=addLink;
       add.expdate=expdate;
       add.addimg=addimg;
      
       add.body = body;
       add.slug = slugify(title).toLowerCase();
       add.mtitle = `${title} | ${process.env.APP_NAME}`;

        add.postedBy = req.auth._id;
        // categories and tag
 
        if (files.photo) {
            if (files.photo.size > 10000000) {
                return res.status(400).json({
                    error: 'Image should be less then 1mb in size'
                });
            }
           add.photo.data = fs.readFileSync(files.photo.path);
           add.photo.contentType = files.photo.type;
        }

       add.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            // res.json(result);
    else {
                                    res.json(result ,files,fields );
                                }
                            }
                        );
                    
                }
            );

    };

// list, listAllBlogsCategoriesTags, read, remove, update

exports.list = (req, res) => {
   Add.find({})
  
        .populate('postedBy', '_id name username')
        .select('_id title slug   addLink expdate addimg postedBy createdAt updatedAt')
        .sort({ createdAt: -1 })
        .exec((err, data) => {
            if (err) {
                return res.json({
                    error: errorHandler(err)
                });
            }
            res.json(data);
        });
};

exports.listAllAdds = (req, res) => {
    let limit = req.body.limit ? parseInt(req.body.limit) : 10000;
    let skip = req.body.skip ? parseInt(req.body.skip) : 0;

    let adds;


  Add.find({})

        .populate('postedBy', '_id name username profile')
        .skip(skip)
        .limit(limit)
        .select('_id title  slug  addLink expdate addimg    postedBy createdAt updatedAt')
   
        .sort({ createdAt: -1 })

        .exec((err, data) => {
            if (err) {
                return res.json({
                    error: errorHandler(err)
                });
            }
           adds = data; // blogs
            // get all categories
          
                    // return all blogs categories tags
                    res.json({ adds,  size: adds.length });
                });
         
};

exports.read = (req, res) => {
    const slug = req.params.slug.toLowerCase();
 Add.findOne({ slug })
        // .select("-photo")

        .populate('postedBy', '_id name username')
        .select('_id title addLink expdate addimg  body slug mtitle  postedBy createdAt updatedAt')
        .sort({ createdAt: -1 })
        .exec((err, data) => {
            if (err) {
                return res.json({
                    error: errorHandler(err)
                });
            }
            res.json(data);
        });
};

exports.remove = (req, res) => {
    const slug = req.params.slug.toLowerCase();
 Add.findOneAndRemove({ slug }).exec((err, data) => {
        if (err) {
            return res.json({
                error: errorHandler(err)
            });
        }
        res.json({
            message: 'Add deleted successfully'
        });
    });
};

exports.update = (req, res) => {
    const slug = req.params.slug.toLowerCase();

  Add.findOne({ slug }).exec((err, oldAdd) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }

        let form = new formidable.IncomingForm();
        form.keepExtensions = true;

        form.parse(req, (err, fields, files) => {
            if (err) {
                return res.status(400).json({
                    error: 'Image could not upload'
                });
            }

            let slugBeforeMerge = oldAdd.slug;
            oldAdd = _.merge(oldAdd, fields);
            oldAdd.slug = slugBeforeMerge;

            const { body,title,addLink ,expdate, addimg } = fields;


            if (files.photo) {
                if (files.photo.size > 10000000) {
                    return res.status(400).json({
                        error: 'Image should be less then 1mb in size'
                    });
                }
                oldAdd.photo.data = fs.readFileSync(files.photo.path);
                oldAdd.photo.contentType = files.photo.type;
            }

            oldAdd.save((err, result) => {
                if (err) {
                    return res.status(400).json({
                        error: errorHandler(err)
                    });
                }
                // result.photo = undefined;
                res.json(result);
            });
        });
    });
};

exports.photo = (req, res) => {
    const slug = req.params.slug.toLowerCase();
 Add.findOne({ slug })
        .select('photo')
        .exec((err, add) => {
            if (err || !add) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.set('Content-Type', add.photo.contentType);
            return res.send(add.photo.data);
        });
};


exports.listSearch = (req, res) => {
    console.log(req.query);
    const { search } = req.query;
    if (search) {
     Add.find(
            {
                $or: [{ title: { $regex: search, $options: 'i' } }//, { body: { $regex: search, $options: 'i' } }
            ]
            },
            (err, blogs) => {
                if (err) {
                    return res.status(400).json({
                        error: errorHandler(err)
                    });
                }
                res.json(blogs);
            }
        ).sort({ createdAt: -1 })
        .select('-photo -body ');
        
    }
};

exports.listByUser = (req, res) => {
    User.findOne({ username: req.params.username }).exec((err, user) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        let userId = user._id;
       Add.find({ postedBy: userId })
   
            .populate('postedBy', '_id name username')
            .select('_id title  slug addLink expdate addimg  postedBy createdAt updatedAt')
            .sort({ createdAt: -1 })
            .exec((err, data) => {
                if (err) {
                    return res.status(400).json({
                        error: errorHandler(err)
                    });
                }
                res.json(data);
            });
    });
};

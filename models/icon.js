const mongoose = require('mongoose');

const iconSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
            max: 32
        },
        slug:{
            type: String,
            unique: true,
            index: true
        },
        iconLink: {
            type: String,
          
  
        },
        iconCode: {
            type: String,
          
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Icon', iconSchema);

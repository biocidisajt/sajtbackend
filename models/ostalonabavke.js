const mongoose = require('mongoose');

const ostalonabavkeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
            maxlength: 32
        },
        slug: {
            type: String,
            unique: true,
            index: true
        },
        nameSp:{
            type:String,
        },
        nameEn:{
            type:String,
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Ostalonabavke',ostalonabavkeSchema);

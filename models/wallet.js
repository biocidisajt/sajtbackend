const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema(
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
        walletAddress: {
            type: String,
          
  
        },
        walletMinet:{
            type: String,
        },
        walletSymbol: {
            type: String,
           
          
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Wallet', walletSchema);

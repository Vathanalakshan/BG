const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const logSchema = mongoose.Schema({
    userid:{
        type: String,
        required: true,
        trim: true
    },
    action:{
        type: String,
        required: true,
        enum: ["achat","vente"]
    },
    item:{
        type: String,
        required: true,
        enum: ["dollars","bitcoin","ethereum","leotoken","nem","hederahashgraph","icon","algorand","dai"]

    },
    amount:{
        type: Number,
        default : 0,
    },
    date:{
        type:Date,
        required: true,
        default: Date.now
    }
});

const Log = mongoose.model('Log',logSchema);
module.exports={Log}
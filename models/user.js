const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const SALT = 10;

const userSchema = mongoose.Schema({
    identifiant:{
        type: String,
        required: true,
        unique: 1,
        trim: true
    },
    password:{
        type: String,
        required: true,
        minlength:6,
        trim: true
    },
    dollars:{
        type: Number,
        default : 100000,
    },
    bitcoin:{
        type: Number,
        default : 0,
    },
    ethereum:{
        type: Number,
        default : 0,
    },
    leotoken:{
        type: Number,
        default : 0,
    },
    nem:{
        type: Number,
        default : 0,
    },
    hederahashgraph:{
        type: Number,
        default : 0,
    },
    icon:{
        type: Number,
        default : 0,
    },
    algorand:{
        type: Number,
        default : 0,
    },
    dai:{
        type: Number,
        default : 0,
    },
    xp:{
        type: Number,
        default : 0,
    }
});

    userSchema.pre('save', function(next){
    let user = this;

    if(user.isModified('password')) {
        bcrypt.genSalt(SALT, function(err,salt){
            if(err) return next(err);
            bcrypt.hash(user.password, salt , function (err,hash){
                if(err) return next(err);
                user.password = hash;
                next();
            })
        })
    } else(
        next()
    )
});


userSchema.methods.comparePassword = function(candidatePassword, cb){
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
        if(err) return cb(err);
        cb(null, isMatch)
    })
};

const User = mongoose.model('User',userSchema);
module.exports={User};
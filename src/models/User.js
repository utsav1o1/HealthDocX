const mongoose = require('mongoose');
const crypto = require('crypto');

const bcrypt = require('bcryptjs');
const { create } = require('connect-mongo');

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, 'Please Enter Your Name'],
        trim:true,
    },
    email:{
        type:String,
        required:[true, 'Please Enter Your Email'],
        unique:true,
        lowercase:true,
        trim:true,
        match: [/\S+@\S+\.\S+/, 'Please use a valid email address'],
    },
    password:{
        type:String,
        required:[true, 'Please Enter Your Password'],
        minlength:[6, 'Password must be atleast 6 characters'],
        select:false,
    },
    createdAt:{
        type:Date,
        default:Date.now,
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date,
});

UserSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.getResetPasswordToken = function(){
    const resetToken = crypto.randomBytes(20).toString('hex');
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    return resetToken;
};

const User = mongoose.model('User', UserSchema);
module.exports = User;
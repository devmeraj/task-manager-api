const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Task = require('./task');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        validate(value){
            if(value.match(/\d/)){
                throw new Error("Should not contain number");
            }
        },
        
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate(email) {
            if(!validator.isEmail(email)){
                throw new Error("Please provide a valid email");
            }
        }
    },
    age: {
        type: Number,
        default: 0,
    },
    password: {
        type: String,
        trim: true,
        required: true,
        minlength: 7
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {timestamps: true});

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
});

userSchema.pre('save', async function() {
    const user = this;
    if(user.isModified('password')){
        try{
            const hashedPassword = await bcrypt.hash(user.password, 8);
            user.password = hashedPassword
        } catch(err){
            throw new Error("Server Error");
        }
    }
});

userSchema.pre('remove', async function() {
    try {
        await Task.deleteMany({owner: this._id});
    } catch (err) {
        throw new Error(err);
    }

});

userSchema.methods.toJSON = function () {
    const user = this;
    const updatedUser = user.toObject();

    delete updatedUser.password;
    delete updatedUser.tokens;

    return updatedUser;
    
}

userSchema.methods.generateWebToken = function () {
    const user = this;
    const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET_KEY, {expiresIn: '7 days'});
    user.tokens.push({token});

    return token;
}

userSchema.statics.findAndLogin = async (email, password) => {
    
    const user =  await User.findOne({email});
    if(!user){
        throw new Error("Invalid Login...")
    }
    const isValidLogin = await bcrypt.compare(password, user.password);
    
    if(isValidLogin){
        return user;
    }
    throw new Error('Invalid Login....')
}

userSchema.indexes();

const User = new mongoose.model('User', userSchema);

module.exports = User;
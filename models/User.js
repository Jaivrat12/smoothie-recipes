import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({

    email: {
        type: String,
        required: [true, 'Please Enter an email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please Enter a valid email'],
    },
    password: {
        type: String,
        required: [true, 'Please Enter a password'],
        minLength: [6, 'Minimum password length is 6 characters'],
    },
});

// Hashing Password, fire a funciton before doc is saved to db
userSchema.pre('save', async function (next) {

    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Static method to login a user
userSchema.statics.login = async function(email, password) {

    const user = await this.findOne({ email });
    if(user) {

        const auth = await bcrypt.compare(password, user.password);
        if(auth) return user;
        throw Error('incorrect password');
    }
    throw Error('incorrect email');
};

const User = mongoose.model('user', userSchema);

export default User;
import User from "../models/User.js";
import jwt from 'jsonwebtoken';

// Handle Errors
const handleErrors = (err) => {

    // console.log(err.message, err.code);

    const errors = { email: '', password: '' };

    // Incorrect Login Credentials
    if(err.message === 'incorrect email') {
        errors.email = 'That Email ID is not registered';
    }
    if(err.message === 'incorrect password') {
        errors.password = 'Wrong Password';
    }

    // Duplicate Error Code
    if(err.code === 11000) {

        errors.email = 'This Email ID is already registered';
        return errors;
    }

    // Validation Errors
    if(err.message.includes('user validation failed')) {

        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        });
    }

    return errors;
};

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({ id }, 'some secret lol', { expiresIn: maxAge });
};

const signup_get = (req, res) => res.render('signup');
const login_get = (req, res) => res.render('login');

const signup_post = async (req, res) => {

    const { email, password } = req.body;

    try {

        const user = await User.create({ email, password });
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(201).json({ user: user._id });
    }
    catch (err) {

        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
};

const login_post = async (req, res) => {

    const { email, password } = req.body;
    
    try {

        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json({ user: user._id });
    }
    catch (err) {

        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
};

const logout_get = (req, res) => {

    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
};

export {

    signup_get, signup_post,
    login_get, login_post,
    logout_get
};
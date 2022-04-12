import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const requireAuth = (req, res, next) => {

    const token = req.cookies.jwt;
    if(token) {

        jwt.verify(token, 'some secret lol', (err, decodedToken) => {

            if(err) {

                console.log(err.message);
                res.redirect('/login');
            }
            else next();
        });
    }
    else res.redirect('/login');
};

// Check current user
const checkUser = (req, res, next) => {

    const token = req.cookies.jwt;
    if(token) {

        jwt.verify(token, 'some secret lol', async (err, decodedToken) => {

            if(err) {

                console.log(err.message);
                res.locals.user = null;
                next();
            }
            else {

                let user = await User.findById(decodedToken.id);
                res.locals.user = user;
                next();
            }
        });
    }
    else {

        res.locals.user = null;
        next();
    }
};

export { requireAuth, checkUser };
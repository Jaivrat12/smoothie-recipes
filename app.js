import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/authRoutes.js';
import { checkUser, requireAuth } from './middleware/authMiddleware.js';

import nodemailer from 'nodemailer';

// app setup
const app = express();
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
app.set('view engine', 'ejs');

app.listen(3000);

// database connection
const dbURI = 'mongodb+srv://elite:test1234@express-blogs.xgip4.mongodb.net/smoothies-recipes-db';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
        .then(result => {

            // app.listen(3000);
            console.log('Listening to requests on PORT 3000...');
        })
        .catch(err => console.log(err));

// routes
app.get('*', checkUser);
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'));
app.use(authRoutes);

// mailing
const transporter = nodemailer.createTransport({

    port: 465,
    host: 'smtp.gmail.com',
    auth: {
        user: 'jaivratdas321@gmail.com',
        pass: '',
    },
    secure: true,
});

const mailData = {

    from: 'jaivratdas321@gmail.com',
    to: 'jaivratdas123456@gmail.com',
    subject: 'Sending Email using Node.js',
    text: 'That was easy!',
    html: '<b>Hey there! </b><br> This is our first message sent with Nodemailer<br/>',
};

app.get('/mail', (req, res) => {

    transporter.sendMail(mailData, (err, info) => {

        if(err)
            console.log(err)
        else
            console.log(info);
    });
    res.end();
});
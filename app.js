if(process.env.NODE_ENV != 'production'){
    require('dotenv').config();
}
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const googleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const rateLimiter = require('express-rate-limit');
const passport = require('passport');
require('./passport');
const path = require('path');



const mongoose = require('mongoose');

main().then(()=>{
    console.log("Database Connected");
}).catch((err)=>{
    console.log(err);
})

// routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const listingRoutes = require('./routes/listing.routes');

// models
const userModel = require('./models/user.models');
const ExpressError = require('./utils/ExpressError');
const { isUserLoggedIn } = require('./middleware/middlewares');

const limite = rateLimiter({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    message: {message: "Too many request..."}
})

app.use(limite);


app.use(cookieParser());
app.use(express.urlencoded({extended: true, limit: '50kb'}));
app.use(express.json());

app.use(passport.initialize());


app.use('/auth',authRoutes);
app.use('/user', userRoutes);
app.use('/listing', listingRoutes);

async function main() {
    mongoose.connect('mongodb://127.0.0.1:27017/AffiliateAPP');
}


app.use((err, req, res, next) => {
    let { status = 500, message = "Some error happend" } = err;
    res.status(status).json({message});
})


module.exports = app;
const mongoose = require('mongoose');
const userModels = require('../models/user.models');
const { userSchemaValidator, LoginFormValidator } = require('../validations/schemaValidations');
const { accessTokenAndRefreshTokenGenerator } = require('../tokenGenerator');
const jwt = require('jsonwebtoken');
const {asyncWrapper} = require('../utils/AsyncWrapper');
const bcrypt = require('bcrypt');

module.exports.signUpUser = asyncWrapper(async(req, res)=>{
    const {error, value} = userSchemaValidator.validate(req.body);

    if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }


    const { name, email, password, role } = value;
    const checkUser = await userModels.findOne({email});
    if(checkUser) return res.json({message: "An user already exist with this mail"});


    const newUser = await userModels.create({
        name,
        email,
        password,
        role,
      });
      console.log(newUser._id);

    const {accessToken, refreshToken} = await accessTokenAndRefreshTokenGenerator(newUser._id);

    const options = {
        httpOnly : true,
        secured: process.env.NODE_ENV == 'production',
    }

    return res
    .status(200)
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', refreshToken, options)
    .json(
        {
            user: newUser,
            accessToken,
            refreshToken,
        }
    )
})

module.exports.loginUser = asyncWrapper(async(req, res)=>{
    const {error, value} = LoginFormValidator.validate(req.body);

    const {email, password} = value;

    const user = await userModels.findOne({email});
    if(!user) return res.json({message: "Wrong email or password"});

    const checkPassword = await user.verifyPassword(password);

    if(!checkPassword) return res.json({message: "Wrong email or password"});

    const {accessToken, refreshToken} = await accessTokenAndRefreshTokenGenerator(user._id);

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV == 'production'
    }

    return res
    .status(200)
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', refreshToken, options)
    .json(
        {
            user: user,
            accessToken,
            refreshToken,
        }
    )
})


module.exports.refreshToken = asyncWrapper(async (req, res)=>{
    const token = req.cookies.refreshToken;

    if(!token) return res.json({message: "Refresh token is missing please login"});


    

    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, async(err, user)=>{
        if(err) return res.status(403).json({message: "Invalid Refresh Token"});

        const userData = await userModels.findById(user._id).select(['-password']);
        const newAccessToken = jwt.sign(
            {
                _id: userData._id,
                name: userData.name,
                email: userData.email,
                role: userData.role,
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
            }
        )

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV == 'product',
        }

        return res
        .status(200)
        .cookie("accessToken", newAccessToken, options)
        .json(
            {
                accessToken: newAccessToken,
                message: "access Token Refreshed",
            }
        )
    })
})

module.exports.signupWithGoogle = (req, res)=>{
    const user = req.user;
    const accessToken = jwt.sign(
        {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    )
    const refreshToken = jwt.sign(
        {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    )

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV == 'production'
    }

    res.cookie('accessToken', accessToken, options).cookie('refreshToken', refreshToken, options);

    res.status(200).json({message: "Logged In"});
}



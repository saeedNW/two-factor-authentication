/** import jsonwebtoken */
const jwt = require("jsonwebtoken");
/** import user model */
const userModel = require("../model/userModel");
/** import system config */
const config = require("../conf/config");

/**
 * register controller
 * @param req
 * @param res
 * @param next
 * @return {Promise<void>}
 */
const registerUser = async (req, res, next) => {
    try {
        const {name, email, password} = req.body;

        const user = await userModel.findOne({email});

        if (user) {
            const error = new Error("user already exists")
            error.status = 422
            throw error
        }

        await userModel.create({name, email, password});

        res.status(201).json({
            success: true,
            message: "user created successfully"
        })
    } catch (err) {
        next(err);
    }
}

/**
 * login controller
 * @param req
 * @param res
 * @param next
 * @return {Promise<void>}
 */
const loginUser = async (req, res, next) => {
    try {
        const {email, password} = req.body;

        const user = await userModel.findOne({email});

        if (!user) {
            const error = new Error("user didn't found")
            error.status = 422
            throw error
        }

        if (!user.comparePassword(password)) {
            const error = new Error("wrong login info")
            error.status = 422
            throw error
        }

        const token = jwt.sign({email: user.email}, config.JWT_SECRET, {
            expiresIn: 60 * 60 * 24
        });

        res.status(200).json({
            success: true,
            message: "user logged in successfully",
            data: {
                token
            }
        });

    } catch (err) {
        next(err);
    }
}

module.exports = {
    registerUser,
    loginUser
}
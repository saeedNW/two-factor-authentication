/** import jsonwebtoken module */
const jwt = require("jsonwebtoken");
/** import config */
const config = require("../conf/config");
/** import user model */
const userModel = require("../model/userModel");

/** check if user is logged in */
exports.authenticated = async (req, res, next) => {
    const authHeader = req.get("Authorization");

    try {
        if (!authHeader) {
            const error = new Error("access denied")
            error.status = 401
            throw error;
        }

        const token = authHeader.split(" ")[1]; //Bearer Token => ['Bearer', token]

        if (!token) {
            const error = new Error("access denied")
            error.status = 401
            throw error;
        }

        const decodedToken = jwt.verify(token, config.JWT_SECRET);

        if (!decodedToken) {
            const error = new Error("access denied")
            error.status = 401
            throw error;
        }

        const user = await userModel.findById(decodedToken.id);

        if (!user){
            const error = new Error("user notfound")
            error.status = 404
            throw error;
        }

        req.user = user;
        next();
    } catch (err) {
        next(err);
    }
};

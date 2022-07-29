/** import jsonwebtoken module */
const jwt = require("jsonwebtoken");
/** import config */
const config = require("../conf/config");

/** check if user is logged in */
exports.authenticated = (req, res, next) => {
    const authHeader = req.get("Authorization");

    try {
        if (!authHeader) {
            const error = new Error("access denied")
            error.status(401)
            throw error;
        }

        const token = authHeader.split(" ")[1]; //Bearer Token => ['Bearer', token]

        const decodedToken = jwt.verify(token, config.JWT_SECRET);

        if (!decodedToken) {
            const error = new Error("access denied")
            error.status(401)
            throw error;
        }

        req.userId = decodedToken.user.userId;
        next();
    } catch (err) {
        next(err);
    }
};

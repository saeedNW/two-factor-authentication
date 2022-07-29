/** import auth router */
const authRouter = require("./auth");
/** import user router */
const userRouter = require("./user");

/**
 * initializing application Routers
 * @param app
 */
exports.initializeRouters = (app) => {
    /** initialize auth router */
    app.use('/auth', authRouter);
    /** initialize user router */
    app.use('/user', userRouter);
}
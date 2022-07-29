exports.errorHandler = (error, req, res, next) => {
    const status = error.status || 500;
    const message = error.message || "Error occurred, try again";

    res.status(status).json({
        success: false,
        message
    });
};

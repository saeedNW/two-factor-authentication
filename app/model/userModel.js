/** import mongoose */
const mongoose = require("mongoose");
/** extract schema method from mongoose module */
const {Schema} = mongoose

/** define user collection schema */
const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    twoFactorStatus: {
        type: Boolean,
        default: false
    },
    twoFactorSecret: {
        type: Object,
        default: null
    },
    twoFactorRecoveryCodes: {
        type: [String],
        default: []
    }
}, {timestamps: true});

/**
 * user schema password comparer method
 * @param password
 * @return {boolean}
 */
userSchema.methods.comparePassword = function (password) {
    return password === this.password;
}

module.exports = mongoose.model("User", userSchema);
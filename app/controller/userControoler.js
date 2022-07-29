/** import user model */
const userModel = require("../model/userModel");
/** import system config */
const config = require("../conf/config");
/** import speakeasy module */
const speakeasy = require("speakeasy");

/**
 * two-factor activation process controller
 * @param req
 * @param res
 * @param next
 * @return {Promise<void>}
 */
const twoFactorActivation = async (req, res, next) => {
    /** extract user from request */
    const user = req.user;

    try {
        /** return error if 2FA already activated */
        if (user.twoFactorStatus) {
            const error = new Error("already activated")
            error.status = 403
            throw error
        }

        /** create 2FA secret */
        const secret = speakeasy.generateSecret();

        /**
         * extract 2FA needed secrets from secrets
         */
        const twoFactorSecret = {
            secret: secret.base32,
            QRCode: secret.otpauth_url.replace("SecretKey", "TwoFactorManager") /** set project name in QR code */
        }

        /** update user two-factor secret keys */
        user.twoFactorSecret = twoFactorSecret;
        await user.save();

        res.status(200).json({
            success: true,
            message: "2FA secrets created successfully, you need to verify secrets to activate 2FA feature",
            data: {...twoFactorSecret}
        })
    } catch (err) {
        next(err);
    }
}

/**
 * two-factor verification and activation controller
 * @param req
 * @param res
 * @param next
 * @return {Promise<void>}
 */
const twoFactorVerification = async (req, res, next) => {
    /** extract user from request */
    const user = req.user;
    /** extract user 2FA secret from user info */
    const {secret} = user.twoFactorSecret
    /** extract 2FA token from request */
    const {token} = req.body;

    try {
        /** return error if 2FA already activated */
        if (user.twoFactorStatus) {
            const error = new Error("already activated")
            error.status = 403
            throw error
        }

        /** verify user token */
        const verified = speakeasy.totp.verify({
            secret,
            encoding: 'base32',
            token
        });

        /** return error if verification failed */
        if (!verified) {
            const error = new Error("verification failed")
            error.status = 422
            throw error
        }

        /** create user recovery codes */
        const recoveryCodes = recoveryCodeGenerator();

        /** update user info */
        user.twoFactorStatus = true;
        user.twoFactorRecoveryCodes = recoveryCodes;
        await user.save()

        res.status(200).json({
            success: true,
            message: "two-factor authentication activated successfully",
            data: {recoveryCodes}
        })
    } catch (err) {
        next(err);
    }
}

const twoFactorValidation = async (req, res, next) => {
    /** extract data from request */
    const {email, token} = req.body;

    try {
        /** search database for user */
        const user = await userModel.findOne({email});

        /** return error if user didn't found */
        if (!user) {
            const error = new Error("user notfound")
            error.status = 404
            throw error;
        }

        /** extract user 2FA secret from user info */
        const {secret} = user.twoFactorSecret;

        /** validate user token */
        const tokenValidates = speakeasy.totp.verify({
            secret,
            encoding: 'base32',
            token,
            window: 1
        });

        /**
         * return error if token was invalid
         */
        if (!tokenValidates) {
            const error = new Error("wrong token")
            error.status = 401
            throw error;
        }

        res.status(200).json({
            success: true,
            message: "user logged in successfully"
        })
    } catch (err) {
        next(err);
    }
}

const twoFactorRecovery = async (req, res, next) => {
    /** extract data from request */
    const {email, recoveryCoed} = req.body;
    try {
        /** search database for user */
        const user = await userModel.findOne({email});

        /** return error if user didn't found */
        if (!user) {
            const error = new Error("user notfound")
            error.status = 404
            throw error;
        }

        /** validate user recovery code */
        const validateRecoveryCode = user.twoFactorRecoveryCodes.includes(recoveryCoed);

        /**
         * return error if recovery code was invalid
         */
        if (!validateRecoveryCode) {
            const error = new Error("wrong recovery code")
            error.status = 401
            throw error;
        }

        /** disable user two-factor authentication */
        user.twoFactorStatus = false;
        await user.save();

        res.status(200).json({
            success: true,
            message: "2FA disabled, user logged in successfully"
        })
    } catch (err) {
        next(err);
    }
}

/**
 * generate recovery codes
 * @param codesCount count of recovery codes
 * @param length recovery codes length
 * @return {*[]}
 * @example
 * // returns ['tcery-Rr6cO', 't7uG3-dGn39', 'iGvNK-aSdgZ', 'X3gPF-dqeU4', 'b1xxx-3ppfg', 'VxZ3d-YYlJO', 'Eke9X-0kusT', 'a6ucJ-8RWSP']
 * recoveryCodeGenerator();
 */
const recoveryCodeGenerator = (codesCount = 8, length = 5) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    const codes = []

    for (let i = 0; i < codesCount; i++) {
        let result = '';
        const charactersLength = characters.length;
        for (let j = 0; j < length; j++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        result += "-"
        for (let j = 0; j < length; j++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        codes.push(result)
    }

    return codes;
}


module.exports = {
    twoFactorActivation,
    twoFactorVerification,
    twoFactorValidation,
    twoFactorRecovery
}
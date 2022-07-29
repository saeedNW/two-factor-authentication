/** import express module */
const express = require('express');
/** create express Router instance */
const router = express.Router();

/** import user authentication checker */
const {authenticated} = require("../middleware/auth");

/** import 2FA process handlers */
const {
    twoFactorActivation,
    twoFactorVerification,
    twoFactorValidation,
    twoFactorRecovery
} = require("../controller/userControoler");


/**
 * @swagger
 * tags:
 *  name: 2FA-Manager
 *  description: authentication phone verification routes
 */

/**
 * @swagger
 * /user/two-factor/activation:
 *  post:
 *      summary: two-factor activation route
 *      description: activate user two-factor authentication
 *      tags: [2FA-Manager]
 *      parameters:
 *          - name: Authorization
 *            description: authorization Bearer token
 *            in: header
 *            required: true
 *            type: string
 *            example: Bearer yourToken...
 *      responses:
 *          200:
 *              description: returns 2FA activator secret and QR generator
 *          401:
 *              description: authentication failed
 *          403:
 *              description: access denied, already activated
 *          404:
 *              description: user not found
 *          500:
 *              description: server internal error
 */
router.post("/two-factor/activation", authenticated, twoFactorActivation)

/**
 * @swagger
 * /user/two-factor/verification:
 *  post:
 *      summary: two-factor verification route
 *      description: verify user two-factor authentication
 *      tags: [2FA-Manager]
 *      parameters:
 *          - name: Authorization
 *            description: authorization Bearer token
 *            in: header
 *            required: true
 *            type: string
 *            example: Bearer yourToken...
 *          - name: token
 *            description: 2FA token
 *            in: formData
 *            type: string
 *            required: true
 *            example: 259684
 *      responses:
 *          200:
 *              description: 2FA activated successFully, return recovery codes
 *          401:
 *              description: authentication failed
 *          403:
 *              description: access denied, already activated
 *          404:
 *              description: user not found
 *          500:
 *              description: server internal error
 */
router.post("/two-factor/verification", authenticated, twoFactorVerification)

/**
 * @swagger
 * /user/two-factor/validation:
 *  post:
 *      summary: two-factor token validation route
 *      description: validate user two-factor token
 *      tags: [2FA-Manager]
 *      parameters:
 *          - name: email
 *            description: user email address
 *            in: formData
 *            required: true
 *            type: string
 *            format: email
 *            example: example@example.com
 *          - name: token
 *            description: 2FA token
 *            in: formData
 *            type: string
 *            required: true
 *            example: 259684
 *      responses:
 *          200:
 *              description: token is valid, user logged in successfully
 *          401:
 *              description: authentication failed, wrong token
 *          404:
 *              description: user not found
 *          500:
 *              description: server internal error
 */
router.post("/two-factor/validation", twoFactorValidation)

/**
 * @swagger
 * /user/two-factor/recovery:
 *  post:
 *      summary: two-factor authentication recovery route
 *      description: using recovery code to disable two-factor authentication
 *      tags: [2FA-Manager]
 *      parameters:
 *          - name: email
 *            description: user email address
 *            in: formData
 *            required: true
 *            type: string
 *            format: email
 *            example: example@example.com
 *          - name: recoveryCoed
 *            description: 2FA recovery code
 *            in: formData
 *            type: string
 *            required: true
 *            example: t7uG3-dGn39
 *      responses:
 *          200:
 *              description: two-factor authentication disabled, user logged in successfully
 *          401:
 *              description: authentication failed, wrong recovery code
 *          404:
 *              description: user not found
 *          500:
 *              description: server internal error
 */
router.post("/two-factor/recovery", twoFactorRecovery)

module.exports = router;

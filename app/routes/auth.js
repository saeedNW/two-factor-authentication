/** import express module */
const express = require('express');
/** create express Router instance */
const router = express.Router();

/** import register and login handler */
const {registerUser, loginUser} = require("../controller/authController");

/**
 * @swagger
 * tags:
 *  name: Authentication
 *  description: authentication phone verification routes
 */

/**
 * @swagger
 * /auth/register:
 *  post:
 *      summary: user register route
 *      description: user registration process manager
 *      tags: [Authentication]
 *      parameters:
 *          - name: name
 *            description: user full name
 *            in: formData
 *            type: string
 *            required: true
 *            minLength: 3
 *          - name: email
 *            description: user email address
 *            in: formData
 *            type: string
 *            format: email
 *            required: true
 *            example: example@example.com
 *          - name: password
 *            description: user password
 *            in: formData
 *            type: string
 *            required: true
 *            example: Aa1111
 *      responses:
 *          201:
 *              description: user registered successfully
 *          422:
 *              description: validation error
 *          500:
 *              description: server internal error
 */
router.post('/register', registerUser)

/**
 * @swagger
 * /auth/login:
 *  post:
 *      summary: user login route
 *      description: user login process manager
 *      tags: [Authentication]
 *      parameters:
 *          - name: email
 *            description: user email address
 *            in: formData
 *            type: string
 *            format: email
 *            required: true
 *            example: example@example.com
 *          - name: password
 *            description: user password
 *            in: formData
 *            type: string
 *            required: true
 *            example: Aa1111
 *      responses:
 *          200:
 *              description: return user auth token
 *          404:
 *              description: used didn't found
 *          422:
 *              description: validation error
 *          500:
 *              description: server internal error
 */
router.post('/login', loginUser)

module.exports = router;

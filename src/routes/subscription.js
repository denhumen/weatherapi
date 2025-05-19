// src/routes/subscription.js
const express = require('express');
const { body, param, validationResult } = require('express-validator');
const {
  subscribe,
  confirm,
  unsubscribe
} = require('../controllers/subscriptionController');

const router = express.Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     Subscription:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         email:
 *           type: string
 *         city:
 *           type: string
 *         frequency:
 *           type: string
 */

/**
 * @openapi
 * /subscribe:
 *   post:
 *     tags:
 *       - subscription
 *     summary: Subscribe an email for weather updates
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - city
 *               - frequency
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               city:
 *                 type: string
 *               frequency:
 *                 type: string
 *                 enum: [hourly, daily]
 *     responses:
 *       201:
 *         description: Subscription request received (confirmation token generated)
 *       400:
 *         description: Validation error
 *       409:
 *         description: Email already subscribed
 */
router.post(
  '/subscribe',
  [
    body('email').isEmail().withMessage('Must be a valid email'),
    body('city').notEmpty().withMessage('City is required'),
    body('frequency')
      .isIn(['hourly','daily'])
      .withMessage('Frequency must be "hourly" or "daily"'),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
  subscribe
);

/**
 * @openapi
 * /confirm/{token}:
 *   get:
 *     tags:
 *       - subscription
 *     summary: Confirm an email subscription
 *     parameters:
 *       - in: path
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: Confirmation token
 *     responses:
 *       200:
 *         description: Subscription confirmed
 *       400:
 *         description: Validation error
 *       404:
 *         description: Token not found
 */
router.get(
  '/confirm/:token',
  [
    param('token').isUUID().withMessage('Token must be a UUID'),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
  confirm
);

/**
 * @openapi
 * /unsubscribe/{token}:
 *   get:
 *     tags:
 *       - subscription
 *     summary: Unsubscribe from weather updates
 *     parameters:
 *       - in: path
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: Unsubscribe token
 *     responses:
 *       200:
 *         description: Unsubscribed successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Token not found
 */
router.get(
  '/unsubscribe/:token',
  [
    param('token').isUUID().withMessage('Token must be a UUID'),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
  unsubscribe
);

module.exports = router;
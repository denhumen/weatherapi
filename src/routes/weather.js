// src/routes/weather.js
const express = require('express');
const { query, validationResult } = require('express-validator');
const weatherController = require('../controllers/weatherController');

const router = express.Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     WeatherResponse:
 *       type: object
 *       properties:
 *         temperature:
 *           type: number
 *         humidity:
 *           type: number
 *         description:
 *           type: string
 */

/**
 * @openapi
 * /weather:
 *   get:
 *     tags:
 *       - weather
 *     summary: Get current weather by city
 *     parameters:
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         required: true
 *         description: City name
 *     responses:
 *       200:
 *         description: A weather object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WeatherResponse'
 */
router.get(
    '/',
    [
      query('city')
        .notEmpty().withMessage('Query parameter "city" is required'),
    ],
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    },
    weatherController.getWeather
  );

module.exports = router;

require('dotenv').config();
const path           = require('path');
const express        = require('express');
const cors           = require('cors');
const swaggerUi      = require('swagger-ui-express');
const swaggerJsdoc   = require('swagger-jsdoc');
const { sequelize }  = require('./models');
const subscriptionRouter = require('./routes/subscription');
const weatherRouter      = require('./routes/weather');

const app = express();

app.use(express.static(path.join(__dirname, '../public')));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Weather API',
      version: '1.0.0',
      description: 'Subscribe for weather updates',
    },
    servers: [
      { url: '/api', description: 'All paths are relative to /api' }
    ],
    tags: [
      { name: 'weather',      description: 'Weather forecast operations' },
      { name: 'subscription', description: 'Subscription management operations' }
    ]
  },
  apis: [ path.join(__dirname, 'routes/*.js') ],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api', subscriptionRouter);
app.use('/api/weather', weatherRouter);

app.get('/subscribe', (_req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/', (_req, res) => res.redirect('/docs'));

const port = process.env.PORT || 3000;

module.exports = app;
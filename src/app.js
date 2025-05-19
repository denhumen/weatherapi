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
app.use(cors());
app.use(express.json());

// ——— swagger-jsdoc setup —————————————————————————————
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
// ——————————————————————————————————————————————————————

app.use('/api', subscriptionRouter);
app.use('/api/weather', weatherRouter);

// Redirect root → docs
app.get('/', (_req, res) => res.redirect('/docs'));

sequelize.authenticate()
  .then(() => console.log('✅ Database connected'))
  .catch(err => console.error('❌ DB connection error:', err));

const port = process.env.PORT || 3000;
app.listen(port, () =>
  console.log(`🚀 Server listening on http://localhost:${port}`)
);

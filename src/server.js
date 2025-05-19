const app       = require('./app');
const { sequelize } = require('./models');

const port = process.env.PORT || 3000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');
    app.listen(port, () => {
        console.log(`🚀 Server listening on http://localhost:${port}`);
        require('./scheduler');
    });
  } catch (err) {
    console.error('❌ DB connection error', err);
  }
})();

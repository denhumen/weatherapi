const { Subscription } = require('../models');
const { v4: uuidv4 } = require('uuid');

exports.subscribe = async (req, res) => {
  try {
    const { email, city, frequency } = req.body;
    const existing = await Subscription.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: 'Email already subscribed' });
    }
    const token = uuidv4();
    await Subscription.create({ email, city, frequency, token });
    console.log(`👉  Confirmation URL: http://localhost:${process.env.PORT||3000}/api/confirm/${token}`);
    return res.status(201).json({ message: 'Subscription successful. Confirmation email sent.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.confirm = async (req, res) => {
  try {
    const { token } = req.params;
    const sub = await Subscription.findOne({ where: { token } });
    if (!sub) {
      return res.status(404).json({ message: 'Token not found' });
    }
    sub.confirmed = true;
    await sub.save();
    return res.json({ message: 'Subscription confirmed successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.unsubscribe = async (req, res) => {
  try {
    const { token } = req.params;
    const sub = await Subscription.findOne({ where: { token } });
    if (!sub) {
      return res.status(404).json({ message: 'Token not found' });
    }
    await sub.destroy();
    return res.json({ message: 'Unsubscribed successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

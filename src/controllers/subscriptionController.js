const { Subscription } = require('../models');
const { v4: uuidv4 }   = require('uuid');
const nodemailer        = require('nodemailer');

const transporter = nodemailer.createTransport({
  host:     process.env.SMTP_HOST,
  port:     Number(process.env.SMTP_PORT),
  secure:   process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const BASE_URL = process.env.BASE_URL || `http://localhost:${process.env.PORT||3000}`;

exports.subscribe = async (req, res) => {
  try {
    const { email, city, frequency } = req.body;

    const existing = await Subscription.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: 'Email already subscribed' });
    }

    const token = uuidv4();
    const sub = await Subscription.create({ email, city, frequency, token });

    const confirmUrl = `${BASE_URL}/api/confirm/${token}`;

    await transporter.sendMail({
      from:    process.env.EMAIL_FROM,
      to:      email,
      subject: 'Please confirm your weather subscription',
      text:    `Click here to confirm your subscription: ${confirmUrl}`,
      html:    `<p>Click <a href="${confirmUrl}">here</a> to confirm your subscription for ${city} (${frequency}).</p>`,
    });

    return res.json({ message: `Subscription created. A confirmation email has been sent to ${email}` });
  } catch (err) {
    console.error('Subscribe error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.confirm = async (req, res) => {
  try {
    const { token } = req.params;
    const sub = await Subscription.findOne({ where: { token } });
    if (!sub) {
      return res.status(404).json({ message: 'Invalid or expired token' });
    }
    sub.confirmed = true;
    await sub.save();

    return res.json({ message: 'Subscription confirmed successfully' });
  } catch (err) {
    console.error('Confirm error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.unsubscribe = async (req, res) => {
  try {
    const { token } = req.params;
    const sub = await Subscription.findOne({ where: { token } });
    if (!sub) {
      return res.status(404).json({ message: 'Invalid unsubscribe token' });
    }
    await sub.destroy();
    return res.json({ message: 'You have been unsubscribed successfully.' });
  } catch (err) {
    console.error('Unsubscribe error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
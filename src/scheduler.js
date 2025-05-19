const cron = require('node-cron');
const axios = require('axios');
const { Subscription } = require('./models');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host:     process.env.SMTP_HOST,
  port:     Number(process.env.SMTP_PORT),
  secure:   process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function fetchWeather(city) {
    const apiKey = process.env.WEATHER_API_KEY;
    const response = await axios.get('http://api.weatherapi.com/v1/current.json', {
        params: { key: apiKey, q: city, aqi: 'no' }
    });
    const curr = response.data.current;
    return {
        temperature: curr.temp_c,
        humidity:    curr.humidity,
        description: curr.condition.text
    };
}

async function sendUpdate(sub) {
    try {
        const wx = await fetchWeather(sub.city);
        await transporter.sendMail({
        from:    process.env.EMAIL_FROM,
        to:      sub.email,
        subject: `Weather update for ${sub.city}`,
        html:    `<p>Current weather in <strong>${sub.city}</strong>:</p>
                    <ul>
                    <li>🌡 Temp: ${wx.temperature}°C</li>
                    <li>💧 Humidity: ${wx.humidity}%</li>
                    <li>☁️ ${wx.description}</li>
                    </ul>
                    <p><a href="${process.env.BASE_URL||''}/api/unsubscribe/${sub.token}">Unsubscribe</a></p>`
        });
        console.log(`📤 Sent ${sub.frequency} update to ${sub.email}`);
    } catch (err) {
        console.error(`❌ Failed to send to ${sub.email}:`, err.message);
    }
}

// cron.schedule('0 * * * *', async () => {
//   console.log('⏰ Running hourly job');
//   const list = await Subscription.findAll({ where: { confirmed: true, frequency: 'hourly' }});
//   await Promise.all(list.map(sendUpdate));
// });

// cron.schedule('0 9 * * *', async () => {
//   console.log('⏰ Running daily job');
//   const list = await Subscription.findAll({ where: { confirmed: true, frequency: 'daily' }});
//   await Promise.all(list.map(sendUpdate));
// });

cron.schedule('*/5 * * * *', async () => {
    console.log('⏰ Running 5-min test job');
    const subs = await Subscription.findAll({
        where: { confirmed: true }
    });
    await Promise.all(subs.map(sendUpdate));
});  

console.log('✅ Scheduler started');

# Weather API

A Node.js service that lets users subscribe by email to regular weather updates for a chosen city

*Built with: Express, Sequelize (PostgreSQL), lightweight scheduler for dispatching emails*

Used third party services:
- SMTP: https://sendgrid.com/en-us
- WeatherAPI: https://www.weatherapi.com/

## Features

- **REST API** with Swagger/OpenAPI documentation
- **Separation of concerns**: controllers, models, routes, scheduler, services
- **Database persistence** via Sequelize and migrations
- **Email delivery** using Nodemailer
- **Scheduler** (node-cron) for periodic email dispatch
- **Validation and error handling**
- **Automated tests** (Jest + Supertest)
- **Docker** and **docker-compose** for containerized deployment

## Quickstart

1. **Clone the repo**  
```bash
git clone https://github.com/denhumen/weatherapi.git
```
Then move to the cloned repo

2. **Create `.env`** at project root:

```
PORT=3030
BASE_URL=http://localhost:3030
WEATHER_API_KEY=<your-weatherapi-key>
DB_HOST=db
DB_NAME=weatherdb
DB_USER=postgres
DB_PASSWORD=postgres
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=<your-api-from-smpt>
EMAIL_FROM=<your-email-from-smpt>
```


3. **Install dependencies**  
```bash
npm ci
```

4. **Build and run with Docker**  
```bash
docker-compose up --build
```

- API: `http://localhost:3030/api/...`  
- Docs (Swagger UI): `http://localhost:3030/docs`  
- Subscription form: `http://localhost:3030`

5. **Run locally**

#### ⚠️ Local run assumes you have PostgreSQL running. So without PostgreSQL it will fail. Use docker for convinient setup. Also for the local setup enviromental variables will be different. For now they set up for Docker running

```bash
npm run dev
```

5. **Run tests**  
```bash
npm test
```

## Architecture

- **src/app.js** – express main app setup
- **src/server.js** – database authentication and app starting + scheduler import
- **src/routes/** – "weather" and "subscription" routers
- **src/controllers/** – controllers for handling incoming requests
- **src/models/** – sequelize model definitions and index
- **src/migrations/** – sequelize migrations for schema setup
- **src/scheduler.js** – cron job that fetches weather and sends emails according to Frequency of subsciber
- **public/** – static assets (HTML form, CSS, JS)

## API Endpoints

- **GET** `/api/weather?city={city}`  
Returns `{ temperature, humidity, description }`

- **POST** `/api/subscribe`  
Body: `{ email, city, frequency }`  
Response: confirmation message or errors

- **GET** `/api/confirm/{token}`  
Confirms an email subscription

- **GET** `/api/unsubscribe/{token}`  
Unsubscribes a user

## Testing

- **Validation tests** in `tests/` use Jest + Supertest
- Run with `npm test` (uses in-memory SQLite for isolation)

## Environment Variables

- `PORT` – server port (default 3000)
- `BASE_URL` – public URL for links in emails
- `WEATHER_API_KEY` – API key for WeatherAPI.com
- **PostgreSQL**  
- `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
- **SMTP**  
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM`
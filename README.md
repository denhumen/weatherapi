# Weather API Service

This service provides:

- **Current weather** lookup via WeatherAPI.com
- **Email subscription** for weather updates (hourly or daily) with confirm/unsubscribe workflows
- **Interactive API documentation** powered by Swagger UI

---

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Configuration](#configuration)
- [Running with Docker](#running-with-docker)
- [Running Locally](#running-locally)
- [API Endpoints](#api-endpoints)
  - GET /api/weather?city={city}
  - POST /api/subscribe
  - GET /api/confirm/{token}
  - GET /api/unsubscribe/{token}
- [Swagger UI](#swagger-ui)
- [Database Migrations](#database-migrations)
- [Validation & Error Handling](#validation--error-handling)

---

## Features

1. **Weather Lookup**: Fetches real-time weather data (temperature, humidity, description) from WeatherAPI.com.
2. **Subscriptions**: Users can subscribe with an email, city, and frequency (hourly or daily).
3. **Confirmation Flow**: Subscriptions require confirmation via a unique token URL.
4. **Unsubscribe Flow**: Automatic unsubscribe link in updates.
5. **Swagger Documentation**: Auto-generated from JSDoc comments with swagger-jsdoc and served at /docs.
6. **Input Validation**: All endpoints validate parameters and return 400 on bad input.

---

## Prerequisites

- Docker & Docker Compose
- Node.js v18+ (if running locally)
- PostgreSQL (handled in Docker Compose)
- WeatherAPI.com API Key

---

## Configuration

Copy .env.example to .env and fill in values:

DB_HOST=db
DB_NAME=weatherdb
DB_USER=postgres
DB_PASSWORD=postgres
WEATHER_API_KEY=<your_weatherapi_key>

> Note: Docker Compose will load this file by default.

---

## Running with Docker

1. Build and start containers:

   docker-compose up --build -d

2. tail logs (optional):

   docker-compose logs -f app

3. Access:
   - API: http://localhost:3000/api/...
   - Docs: http://localhost:3000/docs

---

## Running Locally (without Docker)

1. Install dependencies:

   npm install

2. Run migrations:

   npm run migrate

3. Start the server:

   npm run dev

4. Visit docs: http://localhost:3000/docs

---

## API Endpoints

### Weather

#### GET /api/weather?city={city}

- Description: Get current weather for a given city.
- Query Params:
  - city (string, required)
- Response (200):

  {
    "temperature": 20.5,
    "humidity": 55,
    "description": "Partly cloudy"
  }

- Errors:
  - 400 if city is missing
  - 502 if upstream WeatherAPI.com call fails

### Subscriptions

#### POST /api/subscribe

- Description: Subscribe an email to weather updates.
- Body (application/json):

  {
    "email": "user@example.com",
    "city": "Kyiv",
    "frequency": "daily"
  }

- Responses:
  - 201 on success (returns confirmation message)
  - 400 on validation error
  - 409 if email already subscribed

#### GET /api/confirm/{token}

- Description: Confirm a subscription using the token.
- Path Params:
  - token (UUID, required)
- Responses:
  - 200 on successful confirmation
  - 400 on invalid token format
  - 404 if token not found

#### GET /api/unsubscribe/{token}

- Description: Unsubscribe using the token.
- Path Params:
  - token (UUID, required)
- Responses:
  - 200 on successful unsubscribe
  - 400 on invalid token format
  - 404 if token not found

---

## Swagger UI

Interactive docs are available at:

http://localhost:3000/docs

Generated from JSDoc in src/routes/*.js.

---

## Database Migrations

We use Sequelize CLI to manage schema.

- Migrations live in src/migrations
- Run:
```bash
  npm run migrate
```

---

## Validation & Error Handling

- All inputs are validated with express-validator.
- Invalid inputs return 400 Bad Request with an errors array.
- Controller errors are caught and return 500 Internal Server Error.
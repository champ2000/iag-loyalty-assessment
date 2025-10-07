# IAG Loyalty Assessment

## Overview

This project implements an Avios points calculator for British Airways flights. It consists of a TypeScript/Node.js backend API and a React frontend interface that allows customers to calculate Avios point discounts for their flights.

When a customer is booking a flight, they are presented with four price point options to use their Avios points:

- 20% of flight price
- 50% of flight price
- 70% of flight price
- 100% of flight price (full payment with Avios)

The Avios points required for each discount are calculated based on the flight route, with specific rates for key routes and a default rate of 0.02 for all other routes.

## Prerequisites

- Node.js (v18 or higher)
- npm (v8 or higher)

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start both frontend and backend in development mode:

   ```bash
   npm run dev
   ```

   - Frontend will run on http://localhost:3001
   - Backend API will run on http://localhost:3000

3. For production:
   ```bash
   npm run build:frontend
   npm run build:backend
   npm start
   ```

## Environment Variables

Create a `.env` file in the root directory:

```
PORT=3000
NODE_ENV=development
```

## API Documentation

### Calculate Price Points

Calculates Avios point requirements for different discount levels on a flight.

**Endpoint:** `POST /api/price-points`

**Request Body:**

```json
{
  "DepartureAirportCode": "LHR",
  "ArrivalAirportCode": "LAX",
  "DepartureTime": "2025-10-08T10:00:00Z",
  "ArrivalTime": "2025-10-08T19:00:00Z",
  "Price": 500,
  "Currency": "GBP"
}
```

**Response:**

```json
{
  "pricePoints": [
    {
      "discountPercent": 20,
      "cashDiscount": 100,
      "aviosRequired": 5000
    },
    {
      "discountPercent": 50,
      "cashDiscount": 250,
      "aviosRequired": 12500
    },
    {
      "discountPercent": 70,
      "cashDiscount": 350,
      "aviosRequired": 17500
    },
    {
      "discountPercent": 100,
      "cashDiscount": 500,
      "aviosRequired": 25000
    }
  ]
}
```

**Error Responses:**

- `400 Bad Request`: Invalid input data
- `500 Internal Server Error`: Server-side error

## Testing

Run all tests:

```bash
npm test
```

The test suite includes:

- Unit tests for services and controllers
- Integration tests for API endpoints
- Frontend component tests

## Technology Stack

### Backend

- Node.js with TypeScript
- Express.js for API server
- Joi for request validation
- Winston for logging
- Jest for testing

### Frontend

- React with TypeScript
- Material-UI for components
- Vite for build tooling
- Axios for API calls

## Development Features

- Hot reloading for both frontend and backend
- TypeScript type checking
- ESLint for code quality
- Centralized error handling
- Environment configuration
- API request validation
- Comprehensive logging
- Unit and integration tests

## License

This project is private and confidential.

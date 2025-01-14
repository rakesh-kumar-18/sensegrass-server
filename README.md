# Farm Management System - Backend

This repository contains the backend code for the Farm Management System, providing REST APIs for managing users, fields, and transactions. Built with Node.js, Express, and MongoDB.

---

## Features
- Secure role-based authentication and authorization.
- APIs for managing users, fields, and transactions.
- Integrated with Razorpay for payment processing.

---

## Prerequisites
Before running this project locally, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/)

---

## Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/rakesh-kumar-18/sensegrass-server.git
cd sensegrass-server
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Set Up Environment Variables
Create a `.env` file in the root directory with the following keys:
```env
PORT=3000
MONGODB_URI=<your-mongodb-uri>
CORS_ORIGIN=http://localhost:5173
ACCESS_TOKEN_SECRET=<your-secret-key>
ACCESS_TOKEN_EXPIRY=1d
RAZORPAY_KEY_ID=<your-razorpay-key-id>
RAZORPAY_KEY_SECRET=<your-razorpay-key-secret>
```

### 5. Start the Server
```bash
npm start
# or
yarn start
```

The backend server will run at [http://localhost:3000](http://localhost:3000).

---

## Folder Structure
- `controllers`: Business logic for handling requests.
- `models`: Mongoose schemas for MongoDB collections.
- `middlewares`: Custom middlewares for authentication and error handling.
- `routes`: API routes for users, fields, and transactions.
- `utils`: Utility functions like error handling and token generation.

---

## Scripts
- `npm start`: Start the production server.
- `npm run dev`: Start the development server with hot-reloading using Nodemon.

---

## Issues
If you encounter any issues, please open an issue in this repository.

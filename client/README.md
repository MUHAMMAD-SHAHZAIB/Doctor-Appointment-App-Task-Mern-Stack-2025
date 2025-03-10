# Project Setup Instructions

## Initial Project Structure

```
doctor-appointment-system/
│
├── client/                  # React frontend
│   ├── public/
│   │   ├── index.html
│   │   └── ...
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── contexts/        # Context API
│   │   ├── services/        # API services
│   │   ├── utils/           # Utility functions
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── ...
│
├── server/                  # Node.js backend
│   ├── config/              # Configuration files
│   ├── controllers/         # Request handlers
│   ├── models/              # Database models
│   ├── routes/              # API routes
│   ├── middleware/          # Custom middleware
│   ├── utils/               # Utility functions
│   ├── server.js            # Entry point
│   ├── package.json
│   └── ...
│
├── .gitignore
├── package.json             # Root package.json
└── README.md
```

## 1. Setting up the Backend

### Initialize the project

```bash
mkdir doctor-appointment-system
cd doctor-appointment-system
npm init -y
mkdir server
cd server
npm init -y
```

### Install backend dependencies

```bash
npm install express mongoose dotenv bcryptjs jsonwebtoken cors helmet morgan nodemailer express-validator
npm install --save-dev nodemon
```

### Create basic server files

1. Create `.env` file in the `server` directory:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/doctor-appointment-system
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

2. Create `server.js` file:

```javascript
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/departments', require('./routes/department.routes'));
app.use('/api/doctors', require('./routes/doctor.routes'));
app.use('/api/appointments', require('./routes/appointment.routes'));

// Default route
app.get('/', (req, res) => {
  res.send('Doctor Appointment System API');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    // Start server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });
```

3. Update `package.json` in the server directory:

```json
{
  "name": "doctor-appointment-system-server",
  "version": "1.0.0",
  "description": "Backend for Doctor Appointment System",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "keywords": [
    "doctor",
    "appointment",
    "mern"
  ],
  "author": "",
  "license": "ISC"
}
```

## 2. Setting up the Frontend

### Create React App

```bash
cd ..
npx create-react-app client
cd client
```

### Install frontend dependencies

```bash
npm install axios react-router-dom @mui/material @mui/icons-material @emotion/react @emotion/styled redux react-redux redux-thunk redux-devtools-extension formik yup date-fns
```

### Update `package.json` for proxy

Add this line to client's package.json:

```json
"proxy": "http://localhost:5000",
```

## 3. Create basic folder structure

### For Backend

```bash
cd ../server
mkdir config controllers models routes middleware utils
```

### For Frontend

```bash
cd ../client/src
mkdir components pages contexts services utils
```

## 4. Initialize Git repository

```bash
cd ../..
git init
```

Create `.gitignore` file:

```
# dependencies
node_modules/
.pnp/
.pnp.js

# testing
coverage/

# production
build/

# misc
.DS_Store
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

npm-debug.log*
yarn-debug.log*
yarn-error.log*

# IDE
.idea/
.vscode/
*.sublime-project
*.sublime-workspace
```

## 5. Create basic README.md

```markdown
# Doctor Appointment System

A complete MERN stack application for managing doctor appointments. The system allows patients to book appointments with doctors based on their availability and provides an admin panel to manage doctor schedules.

## Features

- User authentication (Patient, Doctor, Admin)
- Doctor listing by department
- Appointment booking system
- Real-time slot management
- Admin dashboard
- Doctor dashboard
- Patient dashboard

## Technologies Used

- MongoDB
- Express.js
- React.js
- Node.js
- Material-UI
- JWT Authentication

## Getting Started

### Prerequisites

- Node.js
- MongoDB
- npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   cd client
   npm install
   cd ../server
   npm install
   ```
3. Create `.env` file in the server directory with your environment variables
4. Run the application:
   ```
   # Run backend
   npm run dev

   # Run frontend
   cd ../client
   npm start
   ```

## License

[MIT](LICENSE)
```
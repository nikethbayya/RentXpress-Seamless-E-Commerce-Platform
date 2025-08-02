const express = require('express');
// const sequelize = require('sequelize');
const dotenv = require('dotenv').config();
const cookieParser = require('cookie-parser');
const db = require('./model');
const productRoutes = require('./routes/productRoutes');
const adminRoutes = require('./routes/adminRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
// const swaggerJsdoc = require('swagger-jsdoc');
// const swaggerUi = require('swagger-ui-express');
// const swaggerConfig = require('./swagger-config')
const cors = require('cors');
const bodyParser = require('body-parser');
//Application
const app = express();
//setting up your port
const PORT = process.env.PORT || 8081;

//Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.use(bodyParser.json({limit: '50mb'}));

//routes for the user API
app.use('/api/products',productRoutes);
//routes for admin API
app.use('/api/admin',adminRoutes)

//routes for Reservation API
app.use('/api/book',reservationRoutes);

//Listening
app.listen(PORT, () => console.log(`Server is connected on ${PORT}`));
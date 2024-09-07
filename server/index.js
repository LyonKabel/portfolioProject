require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');
const spotifyRoutes = require('./routes/spotifyRoutes'); 
const PORT = process.env.PORT || 3001;

const app = express();
app.use(cors());
app.use(express.json());


// Sequelize connect to the MySQL database
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
});

// Test DB connection
sequelize.authenticate()
  .then(() => console.log('Database connected'))
  .catch(err => console.log('Error connecting to database:', err));

// Use the routes from spotifyRoutes
app.use('/api', spotifyRoutes);




// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

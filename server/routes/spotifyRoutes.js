const express = require('express');
const spotifyController = require('../controllers/spotifyController');
const router = express.Router();

// Routes
router.get('/login', spotifyController.login);
router.get('/status', spotifyController.status);
router.get('/search', spotifyController.search);
router.delete('/logout', spotifyController.logout); 


module.exports = router;

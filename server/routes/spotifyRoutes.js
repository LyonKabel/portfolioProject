const express = require('express');
const router = express.Router();
const spotifyController = require('../controllers/spotifyController');


router.get('/login', spotifyController.login);
router.get('/auth', spotifyController.auth);
router.get('/status', spotifyController.status);
router.get('/search', spotifyController.search);

module.exports = router;
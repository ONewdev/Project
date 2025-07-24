const express = require('express');
const router = express.Router();
const interactionController = require('../controllers/interactionController');

// Like routes
router.post('/like', interactionController.likeProduct);
router.post('/unlike', interactionController.unlikeProduct);
router.get('/like/status', interactionController.checkLikeStatus);

// Favorite routes
router.post('/favorite', interactionController.favoriteProduct);
router.post('/unfavorite', interactionController.unfavoriteProduct);
router.get('/favorite/status', interactionController.checkFavoriteStatus);

module.exports = router;

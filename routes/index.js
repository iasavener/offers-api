const express = require('express');
const router = express.Router();
const packageJson = require("../package.json");
const AuthMiddleware = require('../middlewares/AuthMiddleware');

const APP_NAME = packageJson.name;
const VERSION = packageJson.version;

const OffersController = require('../entities/offers/OffersController');

router.post('/', AuthMiddleware, OffersController.createOffer);
router.get('/', AuthMiddleware, OffersController.getOffers);
router.get('/requests', AuthMiddleware, OffersController.getRequests);
router.patch('/:offerId', AuthMiddleware, OffersController.updateOffer);
router.post('/requests/:requestId/accept', AuthMiddleware, OffersController.acceptRequest);
router.post('/requests/:requestId/reject', AuthMiddleware, OffersController.rejectRequest);

router.get("/status", function status(req, res) {
  return res.json({
    app: APP_NAME,
    version: VERSION,
  });
});

module.exports = router;
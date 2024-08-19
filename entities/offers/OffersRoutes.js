const express = require("express");
const router = express.Router();

const OffersController = require('./OffersController');

router.post('/', OffersController.createOffer);
router.get('/', OffersController.getOffers);
router.patch('/:offerId', OffersController.updateOffer);

module.exports = router;
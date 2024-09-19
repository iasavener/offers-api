const {Router} = require('express');
const router = Router();

const packageJson = require("../package.json");

const APP_NAME = packageJson.name;
const VERSION = packageJson.version;
const AuthMiddleware = require('../middlewares/AuthMiddleware');
const OffersController = require('../entities/offers/OffersController');

router.get("/stages",
  AuthMiddleware,
  async (req, res)=> {
    await OffersController.getStages(req, res)
});

router.get("/loss-reasons",
  AuthMiddleware,
  async (req, res)=> {
    await OffersController.getLossReasons(req, res)
});

router.get("/opportunities",
  AuthMiddleware,
  async (req, res)=> {
    await OffersController.getOpportunities(req, res)
});

router.get("/offers",
  AuthMiddleware,
  async (req, res)=> {
    await OffersController.getOffers(req, res)
});

router.post("/opportunities",
  AuthMiddleware,
  async (req, res)=> {
    await OffersController.createOpportunity(req, res)
});

router.delete("/offers/:offerId",
  AuthMiddleware,
  async (req, res)=> {
    await OffersController.deleteOffer(req, res)
});

router.get("/status", function status(req, res) {
  return res.json({
    app: APP_NAME,
    version: VERSION,
  });
});

module.exports = router;
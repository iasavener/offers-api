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

router.post("/offers/:offerId/lost",
  AuthMiddleware,
  async (req, res)=> {
    await OffersController.markOfferAsLost(req, res)
});

router.post("/offers/:offerId/technician",
  AuthMiddleware,
  async (req, res)=> {
    await OffersController.assignTechnician(req, res)
});

router.post("/offers/:offerId/employees",
  AuthMiddleware,
  async (req, res)=> {
    await OffersController.assignEmployees(req, res)
});

router.delete("/offers/:offerId/employees/:employeeId",
  AuthMiddleware,
  async (req, res)=> {
    await OffersController.deleteEmployee(req, res)
});

router.post("/offers/:offerId/employees/:employeeId/enable",
  AuthMiddleware,
  async (req, res)=> {
    await OffersController.enableEmployee(req, res)
});

router.post("/offers/:offerId/employees/:employeeId/disable",
  AuthMiddleware,
  async (req, res)=> {
    await OffersController.disableEmployee(req, res)
});

router.delete("/offers/:offerId",
  AuthMiddleware,
  async (req, res)=> {
    await OffersController.deleteOffer(req, res)
});

router.patch("/offers/:offerId",
  AuthMiddleware,
  async (req, res)=> {
    await OffersController.updateOffer(req, res)
});

router.get("/status", function status(req, res) {
  return res.json({
    app: APP_NAME,
    version: VERSION,
  });
});

module.exports = router;
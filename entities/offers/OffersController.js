const ResponseHelper = require("../../helpers/ResponseHelper");
const OffersService = require("./OffersService");

const OffersController = {

    getStages: async (req, res) => {
        return ResponseHelper.getResponse(res, OffersService.getStages, []);
    },

    getLossReasons: async (req, res) => {
        return ResponseHelper.getResponse(res, OffersService.getLossReasons, []);
    },

    getOffers: async (req, res) => {
        return ResponseHelper.getResponse(res, OffersService.getOffers, [res.locals.employee]);
    },

    getOpportunities: async (req, res) => {
        return ResponseHelper.getResponse(res, OffersService.getOpportunities, [res.locals.employee, req.query]);
    },

    createOpportunity: async (req, res) => {
        return ResponseHelper.getResponse(res, OffersService.createOpportunity, [res.locals.employee, req.body]);
    },

    deleteOffer: async (req, res) => {
        return ResponseHelper.getResponse(res, OffersService.deleteOffer, [res.locals.employee, req.params.offerId]);
    },

    updateOffer: async (req, res) => {
        return ResponseHelper.getResponse(res, OffersService.updateOffer, [res.locals.employee, req.body]);
    },

    assignEmployee: async (req, res) => {
        return ResponseHelper.getResponse(res, OffersService.assignEmployee, [res.locals.employee, req.params.offerId, req.body, req.headers['authorization']]);
    },

};

module.exports = OffersController;
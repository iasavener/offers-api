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

    getMinifiedOffers: async (req, res) => {
        return ResponseHelper.getResponse(res, OffersService.getMinifiedOffers, []);
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

    assignTechnician: async (req, res) => {
        return ResponseHelper.getResponse(res, OffersService.assignTechnician, [res.locals.employee, req.params.offerId, req.body, req.headers['authorization']]);
    },

    assignEmployee: async (req, res) => {
        return ResponseHelper.getResponse(res, OffersService.assignEmployee, [res.locals.employee, req.params.offerId, req.body, req.headers['authorization']]);
    },

    markOfferAsLost: async (req, res) => {
        return ResponseHelper.getResponse(res, OffersService.markOfferAsLost, [res.locals.employee, req.params.offerId, req.body]);
    },

    updateOffer: async (req, res) => {
        return ResponseHelper.getResponse(res, OffersService.updateOffer, [res.locals.employee, req.params.offerId, req.body]);
    },

    assignEmployees: async (req, res) => {
        return ResponseHelper.getResponse(res, OffersService.assignEmployees, [res.locals.employee, req.params.offerId, req.body]);
    },

    deleteEmployee: async (req, res) => {
        return ResponseHelper.getResponse(res, OffersService.deleteEmployee, [res.locals.employee, req.params.offerId, req.params.employeeId]);
    },

    enableEmployee: async (req, res) => {
        return ResponseHelper.getResponse(res, OffersService.enableEmployee, [res.locals.employee, req.params.offerId, req.params.employeeId]);
    },

    disableEmployee: async (req, res) => {
        return ResponseHelper.getResponse(res, OffersService.disableEmployee, [res.locals.employee, req.params.offerId, req.params.employeeId]);
    }

};

module.exports = OffersController;
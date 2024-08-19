const ResponseHelper = require("../../helpers/ResponseHelper");
const OffersService = require("./OffersService");

const OffersController = {

    getOffers: async (req, res) => {
        return ResponseHelper.getResponse(res, OffersService.getOffers, [res.locals.employee, req.query]);
    },

    createOffer: async (req, res) => {
        return ResponseHelper.getResponse(res, OffersService.createOffer, [res.locals.employee, req.body]);
    },

    getRequests: async (req, res) => {
        return ResponseHelper.getResponse(res, OffersService.getRequests, [res.locals.employee, req.query]);
    },

    updateOffer: async (req, res) => {
        return ResponseHelper.getResponse(res, OffersService.updateOffer, [res.locals.employee, req.body]);
    },

    acceptRequest: async (req, res) => {
        return ResponseHelper.getResponse(res, OffersService.acceptRequest, [res.locals.employee, req.params.offerId]);
    },

    rejectRequest: async (req, res) => {
        return ResponseHelper.getResponse(res, OffersService.rejectRequest, [res.locals.employee, req.params.offerId]);
    }

};

module.exports = OffersController;
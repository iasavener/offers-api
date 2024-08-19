const ResponseHelper = require("../../helpers/ResponseHelper");
const OffersService = require("./OffersService");

const OffersController = {

    getOffers: async (req, res) => {
        return ResponseHelper.getResponse(res, OffersService.getOffers, [res.locals.employee, req.query]);
    },

    createOffer: async (req, res) => {
        return ResponseHelper.getResponse(res, OffersService.createOffer, [res.locals.employee, req.body]);
    },

    updateOffer: async (req, res) => {
        return ResponseHelper.getResponse(res, OffersService.updateOffer, [res.locals.employee, req.body]);
    }

};

module.exports = OffersController;
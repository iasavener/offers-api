const { OfferRequest } = require('../../helpers/sql/associations');

const RequestsService = {  
  getRequests: async (employee, query) => {
    const offers = await OfferRequest.findAll({});
    return offers.map((offer) => offer.dataValues);
  },

  acceptRequest: async (employee, query) => {
    const offers = await OfferRequest.findAll({});
    return offers.map((offer) => offer.dataValues);
  },

  rejectRequest: async (employee, query) => {
    const offers = await OfferRequest.findAll({});
    return offers.map((offer) => offer.dataValues);
  }
};

module.exports = RequestsService;

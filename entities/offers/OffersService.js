const { Offer } = require('../../helpers/sql/associations');

const OffersService = {  
  createOffer: async (employee, data) => {
    await Offer.create({...data, created_by: employee.id, updated_by: employee.id});
    return {}
  },

  getOffers: async (employee, query) => {
    const offers = await Offer.findAll({});
    return offers.map((offer) => offer.dataValues);
  },

  updateOffer: async (employee, query) => {
    const offers = await Offer.findAll({});
    return offers.map((offer) => offer.dataValues);
  }
};

module.exports = OffersService;

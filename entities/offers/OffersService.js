const { Offer, OfferStage, Client, OfferLossReason } = require('../../helpers/sql/associations');
const paginate = require("../../helpers/sql/paginate");

const OffersService = {

  getStages: async () => {
    return await OfferStage.findAll({});
  },

  getLossReasons: async () => {
    return await OfferLossReason.findAll({});
  },

  createOpportunity: async (employee, data) => {
    await Offer.create({...data, original_id: data.id, original_description: data.description, stage_id: 1, created_by: employee.id, updated_by: employee.id});
    // TODO: METER A LOS EMPLEADOS POR DEFECTO ¿CÚALES?
    return {}
  },

  deleteOffer: async (employee, offerId) => {
    await Offer.update(
      {deleted: true, deleted_by: employee.id, updated_by: employee.id},
      {where: {id: offerId}}
    );
    return {}
  },

  getOpportunities: async (employee, query) => {
    const { page, page_size: pageSize, client_id: clientId } = query;

    const currentPage = parseInt(page, 10) || 1;
    const limit = parseInt(pageSize, 10) || 10;
    const offset = (currentPage - 1) * limit;

    const whereConditions = {
      deleted: false,
      created_by: employee.id,
      ...(clientId && { client_id: clientId }),
    };

    const includeConditions = [
      {
        model: Client,
        as: "client",
        attributes: ["name", "logo"]
      },
    ];
  
    const paginatedResult = await paginate(Offer, {
      where: whereConditions,
      limit: limit,
      offset: offset,
      include: includeConditions,
      attributes: ['original_id', 'original_description', 'client_id', 'created_at', 'deleted']
    });

    const baseUrl = 'http://localhost:9091/uploads/'
    
    paginatedResult.items.forEach(opportunity => {
      if (opportunity.client?.logo){
        opportunity.client.logo = `${baseUrl}${opportunity.client.logo}`;
      } else {
        opportunity.client.logo = null;
      }
    })

    return paginatedResult;
  },

  getOffers: async (employee) => {
    const offerStages = await OfferStage.findAll({
      attributes: ['id', 'name'],
    });
  
    const stageNames = offerStages.reduce((acc, stage) => {
      acc[stage.id] = stage.name;
      return acc;
    }, {});
  
    const offers = await Offer.findAll({
      include: [
        {
          model: Client,
          as: 'client',
          attributes: ['id', 'name', 'logo']
        }
      ]
    });
  
    const groupedOffers = offers.reduce((acc, offer) => {
      const stageId = offer.stage_id;
      if (!acc[stageId]) {
        acc[stageId] = {
          id: stageId,
          name: stageNames[stageId] || 'Sin Nombre',
          items: []
        };
      }
  
      if (offer.client.logo) {
        const baseUrl = 'http://localhost:9091/uploads/'
        offer.client.logo = `${baseUrl}${offer.client.logo}`;
      }
      acc[stageId].items.push(offer);
  
      return acc;
    }, {});
  
    offerStages.forEach(stage => {
      if (!groupedOffers[stage.id]) {
        groupedOffers[stage.id] = {
          id: stage.id,
          name: stage.name,
          items: []
        };
      }
    });
  
    return groupedOffers;
  },
  

  updateOffer: async (employee, query) => {
    const offers = await Offer.findAll({});
    return offers.map((offer) => offer.dataValues);
  },

  assignEmployee: async (employee, offerId, data, authToken) => {
    await OfferEmployee.create({
      ...data,
      offer_id: offerId,
      created_by: employee.id,
      updated_by: employee.id,
    });

    return {};
  },
};

module.exports = OffersService;

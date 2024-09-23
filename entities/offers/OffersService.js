const { Offer, OfferStage, Client, OfferLossReason, Employee, OfferEmployee } = require('../../helpers/sql/associations');
const paginate = require("../../helpers/sql/paginate");
const { Op } = require("sequelize");
const AppError = require('../../helpers/AppError');

const OPPORTUNITY_STAGE = 1;
const OFFER_STAGE = 2;
const OFFER_SENT_STAGE = 3;
const OFFER_WON_STAGE = 4;
const ODER_RECEIVED_STAGE = 5;
const OFFER_IN_REVISION = 6;
const LOST_STAGE = 7;

const OffersService = {

  getStages: async () => {
    return await OfferStage.findAll({});
  },

  getLossReasons: async () => {
    return await OfferLossReason.findAll({});
  },

  createOpportunity: async (employee, data) => {
    const currentYear = new Date().getFullYear().toString().slice(-2);

    const lastOffer = await Offer.findOne({
      where: {
        original_id: {
          [Op.like]: `${currentYear}P%`,
        },
      },
      order: [
        ['createdAt', 'DESC']
      ]
    });
   
    let nextNumber = '001';
   
    if (lastOffer) {
    
      const lastId = lastOffer.original_id;
      const match = lastId.match(/\d{3}$/);
   
      if (match) {
        const lastNumber = parseInt(match[0], 10);
        nextNumber = (lastNumber + 1).toString().padStart(3, '0');
      }
    }
   
    const newOriginalId = `${currentYear}P${nextNumber}`; 

    await Offer.create({...data,id: newOriginalId,  original_id: newOriginalId, original_description: data.description, stage_id: OPPORTUNITY_STAGE, created_by: employee.id, updated_by: employee.id});
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

  acceptOpportunity: async (employee, offerId, data) => {
    // if (!employee.offers_director) throw new AppError(403, 'No tienes permisos suficientes para realizar esta acción')
  
    await Offer.update(
      {updated_by: employee.id, stage_id: OFFER_STAGE},
      {where: {id: offerId}}
    );
    return {}
  },

  markOfferAsLost: async (employee, offerId, data) => {
    // TODO: DESACTIVAR EMPLEADOS
    await Offer.update(
      {...data, updated_by: employee.id, stage_id: LOST_STAGE},
      {where: {id: offerId}}
    );
    return {}
  },

  updateOffer: async (employee, offerId, data) => {
    await Offer.update(
      {...data, updated_by: employee.id},
      {where: {id: offerId}}
    );
    return {}
  },

  assignTechnician: async (employee, offerId, data) => {
    await Offer.update(
      {...data, updated_by: employee.id},
      {where: {id: offerId}}
    );
    if (!await OfferEmployee.findOne({where: {offer_id: offerId, employee_id: data.technician_id}})){
      await OfferEmployee.create({offer_id: offerId, employee_id: data.technician_id, created_by: employee.id, updated_by: employee.id});
    }
    return {}
  },

  assignOwner: async (employee, offerId, data) => {
    await Offer.update(
      {...data, updated_by: employee.id},
      {where: {id: offerId}}
    );
    if (!await OfferEmployee.findOne({where: {offer_id: offerId, employee_id: data.owner_id}})){
      await OfferEmployee.create({offer_id: offerId, employee_id: data.owner_id, created_by: employee.id, updated_by: employee.id});
    }
    return {}
  },

  getOpportunities: async (employee, query) => {
    const { page, page_size: pageSize, client_id: clientId, stage } = query;

    const currentPage = parseInt(page, 10) || 1;
    const limit = parseInt(pageSize, 10) || 10;
    const offset = (currentPage - 1) * limit;

    const whereConditions = {
      deleted: false,
      created_by: employee.id,
      ...(clientId && { client_id: clientId }),
    };

    if (stage === 'true') {
      whereConditions.deleted = true;
    } else if (stage) {
      whereConditions.deleted = false;
      whereConditions.stage_id = stage;
    }

    const includeConditions = [
      {
        model: Client,
        as: "client",
        attributes: ["name", "logo"]
      },
      {
        model: OfferStage,
        as: "stage",
        attributes: ["id", "name"]
      },
    ];
  
    const paginatedResult = await paginate(Offer, {
      where: whereConditions,
      limit: limit,
      offset: offset,
      include: includeConditions,
      attributes: ['original_id', 'original_description', 'client_id', 'created_at', 'deleted', 'stage_id']
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
  
    // TODO: DEVOLVER LAS OFERTAS EN FUNCIÓN DEL PERFIL
    const offers = await Offer.findAll({
      where: {
        deleted: false
      },
      include: [
        {
          model: Client,
          as: 'client',
          attributes: ['id', 'name', 'logo']
        },
        {
          model: Employee,
          as: 'creator',
          attributes: ['id', 'name', 'last_name', 'acronym','profile_image']
        },
        {
          model: Employee,
          as: 'technician',
          attributes: ['id', 'name', 'last_name', 'acronym','profile_image']
        },
        {
          model: Employee,
          as: 'owner',
          attributes: ['id', 'name', 'last_name', 'acronym','profile_image']
        },
        {
          model: OfferLossReason,
          as: 'loss_reason',
          attributes: ['id', 'name']
        },
        {
          model: Employee,
          as: 'employees',
          through: {
            model: OfferEmployee,
            where: { deleted: false },
            attributes: ['active']
          },
          attributes: ['id', 'name', 'last_name', 'acronym','profile_image']
        },
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

      const baseUrl = 'http://localhost:9091/uploads/'
  
      if (offer.employees) {
        offer.employees.forEach((employee) => {
          if (employee.profile_image) {
            employee.profile_image = `${baseUrl}${employee.profile_image}`;
          }

          employee.active = employee.OfferEmployee.active || false

        })
      }
  
      if (offer.client.logo) {
        offer.client.logo = `${baseUrl}${offer.client.logo}`;
      }

      if (offer.creator.profile_image) {
        offer.creator.profile_image = `${baseUrl}${offer.creator.profile_image}`;
      }

      if (offer.technician?.profile_image) {
        offer.technician.profile_image = `${baseUrl}${offer.technician.profile_image}`;
      }

      if (offer.owner?.profile_image) {
        offer.owner.profile_image = `${baseUrl}${offer.owner.profile_image}`;
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

  getMinifiedOffers: async () => {
    const offers = await Offer.findAll({});
    return offers.map((offer) => {
      return {
        id: offer.dataValues.id,
      }});
  },
  
  assignEmployees: async (employee, offerId, data, authToken) => {
    const employeesToAssign = [];

    data.employees.forEach((employeeId) => {
      employeesToAssign.push({offer_id: offerId, employee_id: employeeId, created_by: employee.id, active: true, updated_by: employee.id})
    })
    await OfferEmployee.bulkCreate(employeesToAssign);

    return {};
  },

  deleteEmployee: async (employee, offerId, employeeIdToDelete, authToken) => {
    const offer = await Offer.findOne({id: offerId});
    if (offer.technician_id === parseInt(employeeIdToDelete)) {
      throw new AppError(403, 'No se puede eliminar al técnico de la oferta')
    }
    await OfferEmployee.update({
        deleted: true,
        deleted_by: employee.id,
        updated_by: employee.id
      }, { where: { employee_id: employeeIdToDelete, offer_id: offerId}}
    );

    return {};
  },


  disableEmployee: async (employee, offerId, employeeIdToDisable, authToken) => {
    await OfferEmployee.update({
        active: false,
        updated_by: employee.id
      }, { where: { employee_id: employeeIdToDisable, offer_id: offerId}}
    );

    return {};
  },

  enableEmployee: async (employee, offerId, employeeIdToEnable, authToken) => {
    await OfferEmployee.update({
        active: true,
        updated_by: employee.id
      }, { where: { employee_id: employeeIdToEnable, offer_id: offerId}}
    );

    return {};
  },
};

module.exports = OffersService;

const ResponseHelper = require("../../helpers/ResponseHelper");
const RequestsService = require("./RequestsService");

const RequestsController = {

    getRequests: async (req, res) => {
        return ResponseHelper.getResponse(res, RequestsService.getRequests, [res.locals.employee, req.query]);
    },

    acceptRequest: async (req, res) => {
        return ResponseHelper.getResponse(res, RequestsService.acceptRequest, [res.locals.employee, req.params.requestId]);
    },

    rejectRequest: async (req, res) => {
        return ResponseHelper.getResponse(res, RequestsService.rejectRequest, [res.locals.employee, req.params.requestId]);
    }

};

module.exports = RequestsController;
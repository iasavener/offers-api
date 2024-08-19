const express = require("express");
const router = express.Router();

const RequestsController = require('./RequestsController');

router.get('/', RequestsController.getRequests);
router.post('/:requestId/accept', RequestsController.acceptRequest);
router.post('/:requestId/reject', RequestsController.rejectRequest);

module.exports = router;
const express = require('express');
const {unapprovedProductListController, approveProductController, rejectProductController, getStoreLocationsController,
    getTickets, approveRefund, rejectRefund, sendEmail, closeTicket
} = require("../controller/productsController");

const router = express.Router();
//Admin Dashboard
router.get('/getUnApprovedProducts',unapprovedProductListController);
router.get(`/approve`,approveProductController);
router.get(`/reject`,rejectProductController);
router.get('/getStoreLocations', getStoreLocationsController);
router.get('/getTickets', getTickets);
router.post('/approveRefund', approveRefund);
router.post('/rejectRefund', rejectRefund);
router.post('/sendEmail', sendEmail);
router.post('/closeTicket', closeTicket);

module.exports = router;
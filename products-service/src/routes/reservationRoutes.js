const express = require('express');
const {reserveProduct, rentedProductByUserIdController, returnProductController, rateProductController} = require("../controller/reservationController");
const {productByUserIdController} = require("../controller/productsController");

const router = express.Router();
//Admin Dashboard
router.post('/reserve',reserveProduct)

router.get('/getRentedProductsByUserId',rentedProductByUserIdController);

router.get('/returnProduct',returnProductController)

router.post('/rateProduct',rateProductController)

module.exports = router;
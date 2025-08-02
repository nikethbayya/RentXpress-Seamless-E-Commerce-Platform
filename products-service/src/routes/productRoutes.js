const express = require('express');
const {addProductController, getCategoriesController, productListController, productByIdController,
     productActiveStatusController, productByUserIdController, unapprovedProductListController, approveProductController,
     rejectProductController, latestProductListController, submitTicket, getRenterDetails
} = require("../controller/productsController");
const validateAddProduct = require("../middleware/validateAddProduct");
const validateProductId = require("../middleware/validateProductId");
const verifyProductExists = require("../middleware/verifyProductExists");


const router = express.Router();

//Add Product

router.post('/add-product',validateAddProduct,addProductController);

//Get Products List
router.get('/product-list',productListController);

// Get Featured Products for Homepage
router.get('/latest-products-list', latestProductListController);

//get product Details By Id
router.get('/getProductById',validateProductId,productByIdController);
router.get('/getProductsByUserId',productByUserIdController);

//Get Categories List
router.get('/categories',getCategoriesController);


//Disable Product
router.get('/set-active-status',validateProductId,verifyProductExists,productActiveStatusController);


//ticket
router.post('/submitTicket', submitTicket);


router.get('/renter', getRenterDetails);
module.exports = router;
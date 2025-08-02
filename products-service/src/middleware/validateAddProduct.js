const {INVALID_REQUEST} = require("../constants/constants");
const validateAddProduct = async(req,res,next) => {
    try {
        const {title, description, pricePerDay, categoryId, ownerId, imgBase64} = req.body;
        let errors = [];
        
        if (!title || title==='') errors.push("Product title is required.");
        if (!description || description==='') errors.push("Description is required.");
        if (!pricePerDay) errors.push("Price per day is required.");
        if (!categoryId) errors.push("Category is required.");
        if (!ownerId) errors.push("Owner ID is required.");
        if (!imgBase64) errors.push("Product image is required.");

        if (errors.length > 0) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: INVALID_REQUEST,
                errors: errors
            });
        }
        next();
    }
    catch (e){
        console.log(e);
    }


};

module.exports = validateAddProduct
const {INVALID_REQUEST} = require("../constants/constants");
const validateProductId = async(req,res,next) => {
    const params = req.query;
    if(!params && !params.productId && (params.productId !== ''))
    {
        return res.status(400).send({code:400,message:INVALID_REQUEST})
    }
    next();
}

module.exports = validateProductId;
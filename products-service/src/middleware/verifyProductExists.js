const {getProductById} = require("../services/getProductById");
const verifyProductExists = async(req,res,next) => {
    const productId = req.query.productId;
    const resp = await getProductById(productId);
    if(resp.code!==200){
        return res.status(resp.code).send(resp);
    }
    next();
}
module.exports = verifyProductExists;
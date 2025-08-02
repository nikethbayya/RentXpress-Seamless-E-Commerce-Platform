const supabase = require("../model");
const {PRODUCTS, SUCCESSFUL, NO_PRODUCTS, DATABASE_ERROR, UNKNOWN_ERROR} = require("../constants/constants");

const approveProduct = async(productId,locationId) => {
    try {
        let response;
        const {data, error,status,statusText} = await supabase.from(PRODUCTS)
            .update({approved:true,location_id:locationId,status:'Active'})
            .eq('product_id',productId);
        if(status===204){
            response =  {code:204,message:SUCCESSFUL};
        }
        else response= {code:500,message:DATABASE_ERROR}
        console.log(error,data,status)
        return response;
    }
    catch (e){
        console.log(e);
        return {code:500,message:UNKNOWN_ERROR};
    }
}
module.exports = {approveProduct}
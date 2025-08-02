const supabase = require("../model");
const {PRODUCTS, SUCCESSFUL, NO_PRODUCTS, DATABASE_ERROR, UNKNOWN_ERROR} = require("../constants/constants");

const rejectProduct = async(productId) => {
    try {
        let response;
        const {data, error,status,statusText} = await supabase.from(PRODUCTS)
            .update({active:false,status:'Rejected'})
            .eq('product_id',productId);

        if(status===204 ){
            response =  {code:204,message:SUCCESSFUL};
        }
        else response= {code:500,message:DATABASE_ERROR}
        return response;
    }
    catch (e){
        console.log(e);
        return {code:500,data:{},message:UNKNOWN_ERROR};
    }
}
module.exports = {rejectProduct}
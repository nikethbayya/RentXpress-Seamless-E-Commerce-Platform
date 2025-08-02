const supabase = require("../model");
const {UNKNOWN_ERROR, SUCCESSFUL, PRODUCTS, DATABASE_ERROR} = require("../constants/constants");


const setProductStatus = async(productId,status) => {
    try{
        let response;
        let activeStatus = true;
        if(status==='Inactive'){
            activeStatus = false;
        }
        const {data,error,status:dbStatus} = await supabase.from(PRODUCTS)
            .update({active:activeStatus,status:status})
            .eq('product_id',productId);
        if(dbStatus===204){
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

module.exports = {setProductStatus};
const supabase = require("../model");
const {PRODUCTS, SUCCESSFUL, DATABASE_ERROR, UNKNOWN_ERROR, NO_PRODUCTS} = require("../constants/constants");
const getProductByUserId = async(user_id) => {
    try {
        let response;
        const {data, error,status,statusText} = await supabase.from(PRODUCTS)
            .select()
            .eq('owner_id',user_id);
        if(status===200 && data.length>0){
            response =  {code:200,data:data,message:SUCCESSFUL};
        }
        else if(status===200) {
            response={code:500,data:[],message:NO_PRODUCTS}
        }
        else response= {code:500,data:{},message:DATABASE_ERROR}
        return response;
    }
    catch (e){
        console.log(e);
        return {code:500,data:{},message:UNKNOWN_ERROR};
    }
}

module.exports = {getProductByUserId}
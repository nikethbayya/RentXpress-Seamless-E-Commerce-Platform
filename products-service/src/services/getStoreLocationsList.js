const supabase = require("../model");
const {STORE_LOCATIONS, SUCCESSFUL, DATABASE_ERROR, UNKNOWN_ERROR} = require("../constants/constants");

const getStoreLocationsList = async() => {
    try {
        let response;
        const {data, error,status,statusText} = await supabase.from(STORE_LOCATIONS).select()
        if(status===200){
            response =  {code:200,data:data,message:SUCCESSFUL};
        }
        else response= {code:500,data:{},message:DATABASE_ERROR}
        console.log(error,data,status,statusText)
        return response;
    }
    catch (e){
        console.log(e);
        return {code:500,data:{},message:UNKNOWN_ERROR};
    }
}

module.exports = {getStoreLocationsList}
const supabase = require('../model');
const {CATEGORIES, UNKNOWN_ERROR, SUCCESSFUL, DATABASE_ERROR} = require("../constants/constants");

const getCategories = async() => {
    try {
        let response;
        const {data, error,status,statusText} = await supabase.from(CATEGORIES)
            .select('id,name');
        console.log(data)
        if(status===200){
            response =  {code:200,data,message:SUCCESSFUL};
        }
        else response= {code:500,data:{},message:DATABASE_ERROR}
        return response;
    }
    catch (e){
        console.log(e);
        return {code:500,data:{},message:UNKNOWN_ERROR};
    }

}

module.exports = {getCategories}
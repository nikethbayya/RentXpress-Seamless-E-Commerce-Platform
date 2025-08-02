const supabase = require("../model");
const {SUCCESSFUL, DATABASE_ERROR, UNKNOWN_ERROR, PRODUCTS} = require("../constants/constants");
const getLatestProductsList = async() => {
    try {
        let response;
        const {data, error,status,statusText} = await supabase.from(PRODUCTS)
            .select(`
                *,
                owner:user-details (
                  user_id,
                  firstName,
                  lastName,
                  email,
                  mobile
                ),
                location:store-locations (
                    id,
                    city,
                    address,
                    lat,
                    long
                )
              `)
            .eq('active',true)
            .eq('approved',true)
            .eq('status','Active')
            .order('created_at', { ascending: false })
            .limit(4);
        console.log('getLatestProductsList', data, error)
        if(status===200){
            response =  {code:200,data:data,message:SUCCESSFUL};
        }
        else response= {code:500,data:{},message:DATABASE_ERROR}
        return response;
    }
    catch (e){
        console.log(e);
        return {code:500,data:{},message:UNKNOWN_ERROR};
    }
}

module.exports = {getLatestProductsList}
const supabase = require("../model");
const {CATEGORIES, SUCCESSFUL, DATABASE_ERROR, UNKNOWN_ERROR, PRODUCTS} = require("../constants/constants");
const getProductList = async(params) => {
    try {
        let response;
        let query = supabase.from(PRODUCTS)
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
            ) as location,
          `)
        .eq('active',true)
        .eq('approved',true)
        .eq('status','Active')
        .order('created_at', { ascending: params?.sortBy == 'newest' ? false : true })

        if(params?.filterCategories?.length > 0) {
            query = query.in('category_id', params.filterCategories)
        }

        if(params?.phrase?.length > 0) {
            // title.ilike.%${params.phrase}%,description.ilike.%${params.phrase}%,category.ilike.%${params.phrase}%,price_per_day::text.ilike.%${params.phrase}%
            query = query.or(`title.ilike.%${params.phrase}%,description.ilike.%${params.phrase}%`)
        }

        const {data, error,status,statusText} = await query
        // console.log(data)
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

module.exports = {getProductList}
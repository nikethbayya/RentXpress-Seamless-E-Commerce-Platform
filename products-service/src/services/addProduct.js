const supabase = require('../model');
const {PRODUCTS, DATABASE_ERROR, ADD_SUCCESS, UNKNOWN_ERROR} = require("../constants/constants");
const {v4:uuidv4} =require('uuid');
function formatProductData(req) {
    console.log(req);
    const {title, description, pricePerDay, categoryId, ownerId, imgBase64} = req;
    const productId = uuidv4();
    const data = {
        title:title,
        description: description,
        price_per_day: pricePerDay,
        category_id: categoryId,
        owner_id: ownerId,
        image: imgBase64
    }
    return data;
}

const addProduct = async (req) => {
    try{

        const productData = formatProductData(req);
        const {data: addData,error: addDataError,status,statusText} = await supabase.from(PRODUCTS)
            .insert(productData).select();
        let response;
        console.log('after adding', addData, addDataError);
        if(addDataError){
            response = {code:500,message:DATABASE_ERROR};
        }
        else{
            response = {code:200,message:ADD_SUCCESS, addData};
        }
        return response;

    }
    catch (e){
        console.log(e);
        return {code:500,message:UNKNOWN_ERROR};
    }
}
module.exports = {addProduct}
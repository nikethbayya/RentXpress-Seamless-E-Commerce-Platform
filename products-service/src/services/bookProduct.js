const supabase = require('../model');
const {TRANSACTION_TABLE, DATABASE_ERROR, ADD_SUCCESS, BOOKING_SUCCESSFUL} = require("../constants/constants");
const {setProductStatus} = require("./setProductStatus");
const {sendBookingMail} = require("./sendMail");

function formatInput(req) {
    return {product_id:req.product_id,
            renter_id: req.user_id,
            owner_id: req.owner_id
        }
}

const bookProduct = async(req) => {
    try{
        input_data = formatInput(req);
        const {data:booking_data,error:bookingError} = await supabase.from(TRANSACTION_TABLE)
            .insert(input_data);
        let response;
        if(bookingError){
            response = {code:500,message:DATABASE_ERROR};
        }
        else{
            await setProductStatus(req.product_id, 'Booked');
            await sendBookingMail(input_data.product_id,input_data.renter_id);
            response = {code:200,message:BOOKING_SUCCESSFUL};
        }
        return response;
    }
    catch (e) {
        console.log(e);
    }
}

module.exports = bookProduct
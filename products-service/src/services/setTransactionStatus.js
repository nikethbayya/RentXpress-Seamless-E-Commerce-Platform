const supabase = require("../model");
const {UNKNOWN_ERROR, SUCCESSFUL, PRODUCTS, DATABASE_ERROR, TRANSACTION_TABLE} = require("../constants/constants");


const setTransactionStatus = async(transactionId) => {
    try{
        let response;
        const activeStatus = false;
        const {data,error,status:dbStatus} = await supabase.from(TRANSACTION_TABLE)
            .update({active:activeStatus})
            .eq('transaction_id',transactionId);
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

module.exports = {setTransactionStatus};
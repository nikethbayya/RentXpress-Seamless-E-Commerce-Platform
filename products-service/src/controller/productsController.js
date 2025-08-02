
const supabase = require("../model");
const {addProduct} = require("../services/addProduct");
const {INVALID_REQUEST, UNKNOWN_ERROR} = require("../constants/constants");
const {getCategories} = require("../services/getCategories");
const {getProductList} = require("../services/getProductList");
const {getProductById} = require("../services/getProductById");
const {setProductStatus} = require("../services/setProductStatus")
const {getProductByUserId} = require("../services/getProductByUserId");
const {getUnApprovedProductList} = require("../services/getUnApprovedProductList");
const {approveProduct} = require("../services/approveProduct");
const {rejectProduct} = require("../services/rejectProduct");
const {getLatestProductsList} = require("../services/getLatestProductsList")
const {getStoreLocationsList} = require("../services/getStoreLocationsList")
const createTicket = require("../services/createTicket");
const {sendTicketNotificationToOwner} = require("../services/sendMail");
const getRenterDetailsByProductId = require("../services/getRenterDetailsByProductId");

const addProductController = async(req,res) => {

        const request = req.body;
        if(!request){res.status(400).send({code:400,message:INVALID_REQUEST})}
        try{
                const responseData = await addProduct(request);
                res.status(responseData.code).send(responseData);
        }
        catch (e) {
                console.log(e);
                res.status(500).send(
                    {code:500,message:UNKNOWN_ERROR}
                );
        }
}

const getCategoriesController = async(req,res) => {
        try{
                const responseData = await getCategories();
                res.status(responseData.code).send(responseData);
        }
        catch (e) {
                console.log(e);
                res.status(500).send(
                    {code:500,message:UNKNOWN_ERROR}
                );
        }
}

const productListController = async(req,res) => {
        try{
                const params = req.query
                // console.log('productListController filters', filters)
                const responseData = await getProductList(params);
                res.status(responseData.code).send(responseData);
        }
        catch (e) {
                console.log(e);
                res.status(500).send(
                    {code:500,message:UNKNOWN_ERROR}
                );
        }
}

const productByIdController = async(req,res) => {
        const params = req.query;
        // if(!params && !params.productId){res.status(400).send({code:400,message:INVALID_REQUEST})}
        try{
                const responseData = await getProductById(params.productId);
                res.status(responseData.code).send(responseData);
        }
        catch (e) {
                console.log(e);
                res.status(500).send(
                    {code:500,message:UNKNOWN_ERROR}
                );
        }
}

const productActiveStatusController = async(req,res) => {
        try{
                const responseData = await setProductStatus(req.query.productId,req.query.status);
                res.status(responseData.code).send(responseData);
        }
        catch (e) {
                console.log(e);
                res.status(500).send(
                    {code:500,message:UNKNOWN_ERROR}
                );
        }
}

const productByUserIdController = async(req,res) => {
        const params = req.query;
        if(!params && !params.userId && (params.userId !== ''))
        {
                return res.status(400).send({code:400,message:INVALID_REQUEST})
        }
        try{
                const responseData = await getProductByUserId(params.userId);
                res.status(responseData.code).send(responseData);
        }
        catch (e) {
                console.log(e);
                res.status(500).send(
                    {code:500,message:UNKNOWN_ERROR}
                );
        }

}

const unapprovedProductListController = async(req,res) => {
        try{
                const responseData = await getUnApprovedProductList();
                res.status(responseData.code).send(responseData);
        }
        catch (e) {
                console.log(e);
                res.status(500).send(
                    {code:500,message:UNKNOWN_ERROR}
                );
        }
}

const approveProductController = async(req,res) => {
        const params = req.query;
        if(!params && !params.productId && (params.productId !== '') && !params.locationId && (params.locationId !== ''))
        {
                return res.status(400).send({code:400,message:INVALID_REQUEST})
        }
        try{
                const responseData = await approveProduct(params.productId,params.locationId);
                res.status(responseData.code).send(responseData);
        }
        catch (e) {
                console.log(e);
                res.status(500).send(
                    {code:500,message:UNKNOWN_ERROR}
                );
        }
}
const rejectProductController = async(req,res) => {
        const params = req.query;
        if(!params && !params.userId && (params.userId !== ''))
        {
                return res.status(400).send({code:400,message:INVALID_REQUEST})
        }
        try{
                const responseData = await rejectProduct(params.userId);
                res.status(responseData.code).send(responseData);
        }
        catch (e) {
                console.log(e);
                res.status(500).send(
                    {code:500,message:UNKNOWN_ERROR}
                );
        }
}

const latestProductListController = async(req, res) => {
        try{
                const responseData = await getLatestProductsList();
                res.status(responseData.code).send(responseData);
        }
        catch (e) {
                console.log(e);
                res.status(500).send(
                    {code:500,message:UNKNOWN_ERROR}
                );
        }
}

const getStoreLocationsController = async(req, res) => {
        try {
                const responseData = await getStoreLocationsList();
                res.status(responseData.code).send(responseData);
        } catch (error) {
                console.log(e);
                res.status(500).send(
                    {code:500,message:UNKNOWN_ERROR}
                );
        }
}

const submitTicket = async (req, res) => {
        try {
                const { productId, ticketType, description, userId } = req.body;
                const result = await createTicket(productId, ticketType, description, userId);
                res.status(200).json({ message: "Ticket submitted successfully", data: result });
        } catch (error) {
                console.error('Error submitting ticket:', error.message);
                res.status(500).json({ message: "Failed to submit ticket", error: error.message });
        }
};

const getTickets = async (req, res) => {
        try {
                const { data, error } = await supabase
                    .from('tickets')
                    .select(`
                                *,
                                products:product_id (
                                    product_id,
                                    title,
                                    description,
                                    owner_id
                                )
                            `)
                    .eq('status', 'Open');


                if (error) throw error;
                res.status(200).json({ tickets: data });
        } catch (error) {
                res.status(500).json({ message: 'Error fetching tickets', error: error.message });
        }
};

const approveRefund = async (req, res) => {
        const { ticketId } = req.body;
        try {
                const { data, error } = await supabase
                    .from('tickets')
                    .update({ status: 'Approved' })
                    .match({ id: ticketId });

                if (error) throw error;
                res.status(200).json({ message: 'Refund approved successfully', data });
        } catch (error) {
                res.status(500).json({ message: 'Error approving refund', error: error.message });
        }
};

const rejectRefund = async (req, res) => {
        const { ticketId } = req.body;
        try {
                const { data, error } = await supabase
                    .from('tickets')
                    .update({ status: 'Rejected' })
                    .match({ id: ticketId });

                if (error) throw error;
                res.status(200).json({ message: 'Refund rejected successfully', data });
        } catch (error) {
                res.status(500).json({ message: 'Error rejecting refund', error: error.message });
        }
};

const sendEmail = async (req, res) => {
        const { ticketId, ownerId } = req.body;
        try {
                console.log(`Sending email to owner ${ownerId} for ticket ${ticketId}`);
                await sendTicketNotificationToOwner(ticketId, ownerId);
                res.status(200).json({ message: 'Email sent successfully' });
        } catch (error) {
                res.status(500).json({ message: 'Error sending email', error: error.message });
        }
};
const closeTicket = async (req, res) => {
        const { ticketId } = req.body;
        try {
                const { data, error } = await supabase
                    .from('tickets')
                    .update({ status: 'Closed' })
                    .match({ id: ticketId });

                if (error) throw error;
                res.status(200).json({ message: 'Ticket closed successfully', data });
        } catch (error) {
                res.status(500).json({ message: 'Error closing ticket', error: error.message });
        }
};

const getRenterDetails = async (req, res) => {
        const params = req.query;
        console.log(params);

        try {
                const productId = params.product_id;
                const userDetails = await getRenterDetailsByProductId(productId);
                console.log(userDetails);

                // Check if userDetails is either non-existent or an empty array
                if (!userDetails || userDetails.length === 0) {
                        // End the function here after sending the response to avoid further execution
                        return res.status(200).json({ message: "No Renters" });
                }

                // If userDetails is not empty, send the details
                res.status(200).json(userDetails);
        } catch (error) {
                console.error("Error fetching renter details:", error);
                res.status(500).json({ error: error.message });
        }

};
module.exports = {addProductController,getCategoriesController,productListController,productByIdController,productActiveStatusController,productByUserIdController,unapprovedProductListController,approveProductController,rejectProductController, latestProductListController, getStoreLocationsController,submitTicket
,sendEmail,getTickets,rejectRefund,approveRefund,closeTicket,getRenterDetails}
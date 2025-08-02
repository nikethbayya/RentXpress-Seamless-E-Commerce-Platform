const supabase = require("../model");

const { getUserDetailsById } = require("./getUserDetailsById");

// This function should be async since it awaits another async function
const getRenterDetailsByProductId = async (productId) => {
    try {
        // Properly await the asynchronous call to getRenterId
        const renterId = await getRenterId(productId);
        if (!renterId) {
            throw new Error("Renter ID not found for the given product.");
        }
        return await getUserDetailsById(renterId);
    }
    catch (e) {
        console.error('Failed to get renter details by product ID:', e);
        throw e; // Rethrow the error after logging it
    }
};

const getRenterId = async (productId) => {
    try {
        const { data, error } = await supabase
            .from('transaction-table')
            .select('renter_id')
            .eq('product_id', productId)
            .eq('active', true)
            .single();

        if (error) {
            console.error('Failed to fetch renter ID:', error);
            throw error; // Log and throw to handle it in the calling function
        }

        if (!data) {
            console.log('No active transaction found for product:', productId);
            return null; // Return null to indicate no active transaction found
        }

        return data.renter_id;
    } catch (error) {
        console.error('Error retrieving renter ID:', error);
        throw error; // Ensure errors are handled consistently
    }
}

module.exports = getRenterDetailsByProductId;

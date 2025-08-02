const supabase = require('../model');

const createTicket = async (productId, ticketType, description, userId) => {
    try {
        const { data, error } = await supabase
            .from('tickets')  // Make sure this matches your actual table name
            .insert([
                {
                    product_id: productId,
                    user_id: userId,
                    type: ticketType,
                    description: description,
                    status: 'Open',
                }
            ]);

        if (error) throw error;

        return data;
    } catch (error) {
        console.error('Error creating ticket in service:', error.message);
        throw error;
    }
};
module.exports = createTicket;
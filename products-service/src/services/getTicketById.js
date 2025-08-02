const supabase = require('../model');


const getTicketById = async (ticket_id) => {
    const {data, error} = await supabase
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
        .eq('id', ticket_id)
        .single();

    if (error) throw error;
    return data;
}

module.exports = getTicketById;
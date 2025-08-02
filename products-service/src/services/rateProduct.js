const supabase = require("../model");
const { PRODUCTS, SUCCESSFUL, DATABASE_ERROR, UNKNOWN_ERROR } = require("../constants/constants");

const rateProduct = async (productId, newRating) => {
    try {
         let { data: productData, error: fetchError } = await supabase
            .from(PRODUCTS)
            .select('rating, rating_count')
            .eq('product_id', productId)
            .single();
        console.log(fetchError);
        if (fetchError) throw new Error(fetchError.message);

        const { rating, rating_count } = productData;
        const totalRating = rating * rating_count;
        const newRatingCount = rating_count + 1;
        const newAverageRating = (totalRating + newRating) / newRatingCount;

        const { error: updateError, status, statusText } = await supabase
            .from(PRODUCTS)
            .update({ rating: newAverageRating, rating_count: newRatingCount })
            .eq('product_id', productId);

        if (updateError) throw new Error(updateError.message);

        if (status === 204) {
            return { code: 204, message: SUCCESSFUL };
        } else {
            return { code: 500, message: DATABASE_ERROR };
        }
    } catch (e) {
        console.log(e);
        return { code: 500, message: UNKNOWN_ERROR };
    }
}

module.exports = { rateProduct };

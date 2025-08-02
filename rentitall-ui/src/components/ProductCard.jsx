import './../styles/ProductCard.css';
import img_placeholder from "./../assets/Img-Placeholder.png";
import { FaLocationDot } from "react-icons/fa6";

export const ProductCard = ({product, categories, onClick}) => {
    return (
        <div className="product-card" onClick={onClick}>
            <div className='product-img-wrapper'>
                <img src={product.image} alt={product.title} onError={(e) => { e.target.onerror = null; e.target.src = img_placeholder; }} />
            </div>
            <div className='product-info'>
                <span className='product-category'>{categories.find(category => category.id === product.category_id)?.name || ''}</span>
                <p className='product-name'>{product.title}</p>
            </div>
            <div className='flex justify-center gap-1 mb-2 items-center'>
                <FaLocationDot />
                {product.location ? <p>{product.location.city}</p> : <p>-</p>}
            </div>
            <div className='product-price'>${product.price_per_day}/day</div>
        </div>
    )
}
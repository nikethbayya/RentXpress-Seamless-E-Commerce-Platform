import { useEffect, useState, useCallback } from 'react'
import './../../styles/HomePage.css'
import axios from 'axios'
import { IoMdCar } from "react-icons/io";
import { LuLaptop2 } from "react-icons/lu";
import { GiClothes, GiSofa } from "react-icons/gi";
import { BsThreeDots } from "react-icons/bs";
import useMediaQuery from '../../hooks/useMediaQuery';
import listing_img from './../../assets/Effortless Listing Process.png'
import inspection_img from './../../assets/Quality Inspected Rentals.png'
import support_img from './../../assets/Round-the-Clock Assistance.png'
import calender_img from './../../assets/Flexible Renting Choices.png'
import { useSession } from "../../hooks/SessionContext";
import ProductPopup from "../../components/ProductPopup";
import { useNavigate } from "react-router-dom";
import { ProductCard } from '../../components/ProductCard';
import bg_img from './../../assets/rental-products2.png';

export const HomePage = (props) => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([])
    const [latestProducts, setLatestProducts] = useState([])
    const [openProductPopup, setOpenProductPopup] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const isNotSmallScreen = useMediaQuery("(min-width: 768px")
    const { userInfo } = useSession();
    const handleProductPopup = (selectedProduct) => {
        // console.log(selectedProduct);
        setSelectedProduct(selectedProduct);
        setOpenProductPopup(true);
    }

    useEffect(() => {
        const getAvailableCategories = async () => {
            try {
                const response = await axios.get(process.env.REACT_APP_PRODUCT_SERVICE + "/categories");
                // console.log("getAvailableCategories response", response?.data?.data)
                const availableCategories = response.data.data
                setCategories(availableCategories)

            } catch (error) {
                console.log(error)
            }
        }
        const getLatestProductsList = async () => {
            try {
                const response = await axios.get(process.env.REACT_APP_PRODUCT_SERVICE + "/latest-products-list");
                // console.log("getLatestProductsList response", response?.data?.data)
                const latest_products_list = response.data.data
                const new_latest_products_list = latest_products_list.map(product => {
                    // if(product.image[0] == '/') {
                    //     const image = 'data:image/jpeg;base64,' + product.image
                    //     console.log(image)
                    //     product.image = image
                    // }
                    return product
                })
                setLatestProducts(new_latest_products_list)

            } catch (error) {
                console.log(error)
            }
        }
        getAvailableCategories();
        getLatestProductsList();
    }, [])

    const goToRentalsPage = useCallback(() => {
        navigate('/rental-items')
    })

    return (
        <div id="Homepage">
            <section>
                {/* <div className='video-hero'>
                    <video src='https://goldnpawnshop.com/wp-content/uploads/2020/01/WebsiteVid2-YoutubeSetting.mp4' autoPlay loop muted />
                </div>
                <div className="video-overlay"></div> */}
                <div className="wave-curve">
                    <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
                    </svg>
                </div>
                <div className="welcome-content">
                    <h1>Welcome to RentItAll</h1>
                    <h2>Your One-Stop Destination for Rental Marketplace</h2>
                    {isNotSmallScreen && <p>At RentItAll, we're not just about renting items – we're about empowering you to rent out your own items too. Whether you're looking to rent something or want to earn some extra income by renting out your belongings, RentItAll is the platform for you.</p>}
                    <br />
                    <p>Get Started Today!</p>
                    <br />
                    {/* <h2>Get Started Today!</h2>
                    <p>Whether you're looking to rent something or have items to rent out, RentItAll is your one-stop destination. Join our vibrant community and unlock the potential of collaborative consumption today.</p> */}
                    <div className='actions-wrapper'>
                        <button className='floating-animation' onClick={goToRentalsPage}>
                            Explore Rentals
                        </button>
                        <button className='secondary-button floating-animation' onClick={props.handleProductListModal}>
                            List Your Items
                        </button>
                    </div>
                </div>
            </section>
            <section>
                <div className="page-container">
                    <div className="see-available-categories">
                        <h1 className='title'>See Available Categories</h1>
                        <ul className='categories-list'>
                            {categories.map(category =>
                                <li key={category.id}>
                                    <div onClick={() => {navigate(`/rental-items?category=${category.id}`)}} className='category-tile'>
                                        <a className='category-icon'>
                                            {category.name === 'Electronics' && <LuLaptop2 size='32' />}
                                            {category.name === 'Furniture' && <GiSofa size='32' />}
                                            {category.name === 'Vehicles' && <IoMdCar size='32' />}
                                            {category.name === 'Fashion' && <GiClothes size='32' />}
                                            {category.name === 'Others' && <BsThreeDots size='32' />}
                                        </a>
                                        {category.name}
                                    </div>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </section>
            <section>
                <div className="page-container">
                    <div className='products-section'>
                        <h1 className='title'>Latest Rental Items</h1>
                        <div className='products-list'>
                            {
                                latestProducts.map(latestProduct =>
                                    <ProductCard key={latestProduct.product_id} product={latestProduct} categories={categories} onClick={() => { handleProductPopup(latestProduct) }} />
                                )
                            }
                        </div>
                        <div className='explore-more-rentals'>
                            <button onClick={goToRentalsPage}>Explore more rental items</button>
                        </div>
                    </div>
                </div>
            </section>
            {isNotSmallScreen && <div className='spacer layered-wave'></div>}
            <section>
                <div className="page-container">
                    <div className='why-us'>
                        <h1 className='title'>Why Choose RentItAll?</h1>
                        <div className='why-us-panel'>
                            <div className="why-us-each-section">
                                <img src={inspection_img} alt="Quality Inspected Rentals" />
                                <h5>Quality Inspected Rentals</h5>
                                <p>Every listed item goes through a meticulous inspection to guarantee your satisfaction. Rent with confidence knowing that RentItAll ensures a premium rental experience with every item.</p>
                            </div>
                            <div className="why-us-each-section">
                                <img src={listing_img} alt="Effortless Listing Process" />
                                <h5>Effortless Listing Process</h5>
                                <p>List your items with ease and start earning. Our simple listing tool allows you to upload your products in minutes. We handle the logistics, you enjoy the benefits.</p>
                            </div>
                            <div className="why-us-each-section">
                                <img src={calender_img} alt="Flexible Renting Choices" />
                                <h5>Flexible Renting Choices</h5>
                                <p>Choose from a wide range of items to rent at competitive prices. Whether you need it for a day, a week, or longer, we've got you covered with flexible rental terms.</p>
                            </div>
                            <div className="why-us-each-section">
                                <img src={support_img} alt="Round-the-Clock Assistance" />
                                <h5>Round-the-Clock Assistance</h5>
                                <p>Our customer care doesn’t clock out. Whether you're renting out or renting in, our support team is here for you 24/7 to help with any questions or concerns.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {selectedProduct && (
                <ProductPopup
                    product={selectedProduct}
                    isOpen={openProductPopup}
                    onClose={() => setOpenProductPopup(false)}
                />
            )}
        </div>
    )
}
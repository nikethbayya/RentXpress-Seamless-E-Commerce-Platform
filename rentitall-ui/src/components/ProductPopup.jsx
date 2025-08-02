import React, { useState, useEffect } from 'react';
import { Modal } from './Modal'; // Your Modal component
import img_placeholder from '../assets/Img-Placeholder.png'; // Fallback image
import { Rating } from '@mui/material'; // Import Rating component
import '../styles/ProductPopup.css'
import { SuccessPopup } from "./SuccessPopup";
import { useSession } from "../hooks/SessionContext";
import { useUser } from "../hooks/UserContext";
import { useNavigate } from "react-router-dom";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import { supabase } from './../supabaseClient.js';
import { GoogleMap, MarkerF } from '@react-google-maps/api';
import SendIcon from '@mui/icons-material/Send';

const ProductPopup = ({ product, isOpen, onClose }) => {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [totalPrice, setTotalPrice] = useState(0);
    const [successPopup, setSuccessPopup] = useState(false);
    const { user, loginData } = useUser();
    const navigate = useNavigate();

    // Calculate today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            const difference = Math.max((end - start) / (1000 * 60 * 60 * 24), 0); // Ensure difference is non-negative
            setTotalPrice((difference === 0 ? 1 : difference) * product.price_per_day);
        }
        else {
            setTotalPrice(product.price_per_day);
        }
        if (isOpen) {
            document.getElementById('mod-close').style.color = 'black';
        }
    }, [startDate, endDate, product.price_per_day, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // console.log(`Reserving product from ${startDate} to ${endDate} for $${totalPrice}`);
        if (loginData.isLoggedIn) {
            // setSuccessPopup(true);
            // handleClosePopup();
            navigate('/payment', { state: { product, startDate, endDate, totalPrice } });
        } else {
            navigate('/login');
        }
    };

    const handleClosePopup = () => {
        setStartDate("")
        setEndDate("")
        setImages([])
        onClose()
    }

    // Product gallery
    const [images, setImages] = useState([]);

    // useEffect(() => {
    //     console.log(images)
    // }, [images])

    useEffect(() => {
        const getImagesFromBucket = async () => {
            try {
                const { data, error } = await supabase.storage.from('product_media').list(`${product.product_id}`);
                // console.log(data, error)
                const additionalImages = await Promise.all([...data].map(async (file) => {
                    const { data, error } = await supabase.storage
                        .from('product_media')
                        .createSignedUrl(`${product.product_id}/${file.name}`, 300);

                    if (error) {
                        console.error('Error generating signed URL:', error);
                        return {
                            original: null,
                            thumbnail: null
                        };
                    }

                    return {
                        original: data.signedUrl,
                        thumbnail: data.signedUrl
                    }
                }))
                setImages([{
                    original: product.image,
                    thumbnail: product.image,
                }, ...additionalImages],)
            } catch (error) {
                console.log(error)
            }
        }

        getImagesFromBucket()
    }, [product])

    const handleMessage = (user_id) => {
        if(loginData.isLoggedIn) {
            // Go to messages page
            navigate(`/messaging?user_id=${user_id}`)
        }
        else {
            navigate('/login');
        }
    }

    if (!product) return null;

    return (
        <>
            <Modal show={isOpen} closeModal={handleClosePopup}>
                <div className="bg-gray-100 p-6 rounded-lg shadow-lg relative">
                    {
                        images.length > 1 ? (
                            <ImageGallery items={images} />
                        ) : (
                            <img src={product.image || img_placeholder} alt={product.title}
                                className="rounded-lg mb-4 w-full max-w-sm h-auto object-cover mx-auto" onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = img_placeholder;
                                }} />
                        )
                    }

                    <h2 className="text-2xl font-bold text-gray-800 mb-2 capitalize">{product.title}</h2>

                    <p className="text-gray-600 mb-4 capitalize">{product.description}</p>

                    {product.rating && (
                        <div className="mb-4">
                            <span className="text-gray-600">Rating:</span>
                            <Rating name="read-only" value={product.rating} readOnly />
                        </div>
                    )}

                    <div className="mb-4">
                        <span className="text-gray-600">Owner Name:</span>
                        <span className="text-xl text-gray-800 font-semibold capitalize"> {product.owner.firstName} {product.owner.lastName} <button className='chat-with-owner-button' title='Message Owner' onClick={() => handleMessage(product.owner.user_id)}>Message <SendIcon /></button></span>
                    </div>
                    <div className="mb-4">
                        <span className="text-gray-600">Location:</span>
                        <span className="text-xl text-gray-800 font-semibold"> {product.location.address}</span>
                    </div>
                    {
                        <GoogleMap mapContainerStyle={{
                            height: "400px",
                            width: "90%",
                            margin: 'auto'
                        }} center={{
                            lat: Number(product.location.lat),
                            lng: Number(product.location.long)
                        }} zoom={10}>
                            <MarkerF position={{
                                lat: Number(product.location.lat),
                                lng: Number(product.location.long)
                            }} />
                        </GoogleMap>
                    }
                    <div className="mb-4">
                        <span className="text-gray-600">Price per day:</span>
                        <span className="text-xl text-gray-800 font-semibold"> ${product.price_per_day}</span>
                    </div>

                    <div className="mb-4">
                        <span className="text-gray-600">Total Price:</span>
                        <span className="text-xl text-gray-800 font-semibold"> ${totalPrice.toFixed(2)}</span>
                    </div>

                    <div className="border-t pt-4">
                        <h4 className="text-lg text-gray-800 font-semibold mb-2">Want to rent this item?</h4>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <label htmlFor="start-date" className="block text-sm font-semibold text-gray-700">Start Date:</label>
                            <input type="date" id="start-date" name="start-date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full border rounded-md p-2 text-gray-500"
                                min={today} // Disable past dates
                                required />

                            <label htmlFor="end-date" className="block text-sm font-semibold text-gray-700">End Date:</label>
                            <input type="date" id="end-date" name="end-date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full border rounded-md p-2 text-gray-500"
                                min={startDate || today} // Ensure end date is not before start date or today
                                required />

                            <button type="submit"
                                className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition duration-300">
                                Reserve
                            </button>
                        </form>
                    </div>
                </div>
            </Modal>
            {successPopup && <SuccessPopup message="Reservation Completed" page={"Home"} redirect={'/home'} />}

        </>
    );
};

export default ProductPopup;

import React, {useEffect, useState} from 'react';
import {Typography, Button, Rating} from '@mui/material';
import ImageGallery from "react-image-gallery";
import img_placeholder from "../assets/Img-Placeholder.png";
import {GoogleMap, MarkerF} from "@react-google-maps/api";
import {SuccessPopup} from "./SuccessPopup";
import {useUser} from "../hooks/UserContext";
import {useNavigate} from "react-router-dom";
import {supabase} from "../supabaseClient";
import { Modal } from './Modal';
import axios from "axios";

const ProductModal = ({ isOpen, onClose, product }) => {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [renterDetails, setRenterDetails] = useState(null);

    const { user, loginData } = useUser();
    const navigate = useNavigate();

    // Calculate today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];


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
        const fetchRenterDetails = async () => {
            if (product && product.product_id) {  // Ensure product and product.product_id are defined
                try {
                    const response = await axios.get(`${process.env.REACT_APP_PRODUCT_SERVICE}/renter?product_id=${product.product_id}`);
                    setRenterDetails(response.data[0]);
                } catch (error) {
                    console.error('Failed to fetch renter details:', error);
                }
            }
        };

        fetchRenterDetails();
    }, [product]);


    // useEffect(() => {
    //     const getImagesFromBucket = async () => {
    //         try {
    //             const { data, error } = await supabase.storage.from('product_media').list(`${product.product_id}`);
    //             console.log(data, error)
    //             const additionalImages = await Promise.all([...data].map(async (file) => {
    //                 const { data, error } = await supabase.storage
    //                     .from('product_media')
    //                     .createSignedUrl(`${product.product_id}/${file.name}`, 300);
    //
    //                 if (error) {
    //                     console.error('Error generating signed URL:', error);
    //                     return {
    //                         original: null,
    //                         thumbnail: null
    //                     };
    //                 }
    //
    //                 return {
    //                     original: data.signedUrl,
    //                     thumbnail: data.signedUrl
    //                 }
    //             }))
    //             setImages([{
    //                 original: product.image,
    //                 thumbnail: product.image,
    //             }, ...additionalImages],)
    //         } catch (error) {
    //             console.log(error)
    //         }
    //     }
    //
    //     getImagesFromBucket()
    // }, [product])

    if (!product) return null;

    return (
        <>
            <Modal show={isOpen} closeModal={handleClosePopup}>
                <div className="bg-gray-100 p-6 rounded-lg shadow-lg relative">
                    {
                        images.length > 1 ? (
                            <ImageGallery items={images}/>
                        ) : (
                            <img src={product.image || img_placeholder} alt={product.title}
                                 className="rounded-lg mb-4 w-full max-w-sm h-auto object-cover mx-auto"
                                 onError={(e) => {
                                     e.target.onerror = null;
                                     e.target.src = img_placeholder;
                                 }}/>
                        )
                    }

                    <h2 className="text-2xl font-bold text-gray-800 mb-2 capitalize">{product.title}</h2>


                    {product.rating && (
                        <div className="mb-4">
                            <span className="text-gray-600">Rating:</span>
                            <Rating name="read-only" value={product.rating} readOnly/>
                        </div>
                    )}

                    <div>
                        <h3 className="text-gray-600 mb-2">Renter Information:</h3>
                        {renterDetails ? (
                            <div className="mb-4">
                                <div className="mb-4">
                                    <span className="text-gray-600">Renter Name:</span>
                                    <span className="text-lg text-gray-800 font-semibold pl-4">
                {renterDetails.firstName} {renterDetails.lastName}
            </span>
                                </div>
                                <div className="mb-4">
                                    <span className="text-gray-600">Renter Email:</span>
                                    <span className="text-lg text-gray-800 font-semibold pl-4">
                {renterDetails.email}
            </span>
                                </div>
                                <div className="mb-4">
                                    <span className="text-gray-600">Location:</span>
                                    <span className="text-xl text-gray-800 font-semibold">
                {renterDetails.address}
            </span>
                                </div>
                                {renterDetails.lat && renterDetails.long && (
                                    <GoogleMap mapContainerStyle={{
                                        height: "400px",
                                        width: "90%",
                                        margin: 'auto'
                                    }} center={{
                                        lat: Number(renterDetails.lat),
                                        lng: Number(renterDetails.long)
                                    }} zoom={10}>
                                        <MarkerF position={{
                                            lat: Number(renterDetails.lat),
                                            lng: Number(renterDetails.long)
                                        }} />
                                    </GoogleMap>
                                )}
                            </div>
                        ) : (
                            <p className="text-gray-800 text-lg">No active rental information found.</p>
                        )}
                </div>




                    {/*<div className="border-t pt-4">*/}
                    {/*    <h4 className="text-lg text-gray-800 font-semibold mb-2">Want to rent this item?</h4>*/}
                    {/*    <form onSubmit={handleSubmit} className="space-y-4">*/}
                    {/*        <label htmlFor="start-date" className="block text-sm font-semibold text-gray-700">Start*/}
                    {/*            Date:</label>*/}
                    {/*        <input type="date" id="start-date" name="start-date"*/}
                    {/*               value={startDate}*/}
                    {/*               onChange={(e) => setStartDate(e.target.value)}*/}
                    {/*               className="w-full border rounded-md p-2 text-gray-500"*/}
                    {/*               min={today} // Disable past dates*/}
                    {/*               required/>*/}

                    {/*        <label htmlFor="end-date" className="block text-sm font-semibold text-gray-700">End*/}
                    {/*            Date:</label>*/}
                    {/*        <input type="date" id="end-date" name="end-date"*/}
                    {/*               value={endDate}*/}
                    {/*               onChange={(e) => setEndDate(e.target.value)}*/}
                    {/*               className="w-full border rounded-md p-2 text-gray-500"*/}
                    {/*               min={startDate || today} // Ensure end date is not before start date or today*/}
                    {/*               required/>*/}
                    {/*    </form>*/}
                    {/*</div>*/}
                </div>
            </Modal>

        </>
    );
};

export default ProductModal;

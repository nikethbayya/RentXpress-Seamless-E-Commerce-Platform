import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import BlockIcon from '@mui/icons-material/Block';
import LensIcon from '@mui/icons-material/Lens';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useUser } from "../hooks/UserContext";
import axios from "axios";
import '../styles/OwnedProducts.css'
import ProductModal from "./ProductModal";
import ProductPopup from "./ProductPopup";

export const OwnedProducts = () => {
    const [ownedProducts, setOwnedProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [openProductPopup, setOpenProductPopup] = useState(false);
    const { user } = useUser();

    const fetchOwnedProducts = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_PRODUCT_SERVICE}/getProductsByUserId`, {
                params: { userId: user.user_id }
            });
            setOwnedProducts(response.data.data);
        } catch (error) {
            console.error('Error fetching owned products:', error);
        }
    };


    useEffect(() => {
        if (user?.user_id) {
            fetchOwnedProducts();
        }
    }, [user]);

    // useEffect(() => {console.log(ownedProducts)}, [ownedProducts])

    const handleUpdateProductStatus = async (productId, status) => {
        try {
            await axios.get(`${process.env.REACT_APP_PRODUCT_SERVICE}/set-active-status?productId=${productId}&status=${status}`, {
                productId,
                status
            });
            fetchOwnedProducts();
            // Update UI to reflect new status
            setOwnedProducts(ownedProducts.map(product =>
                product.product_id === productId ? { ...product, status } : product
            ));
        } catch (error) {
            console.error('Error updating product status:', error);
        }
    };
    const handleView = (product)=> {
        setSelectedProduct(product);
        setOpenProductPopup(true);
    }
    return (
        <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            className="space-y-4"
        >
            <div className="flex md:flex-row gap-3">
                {ownedProducts.map((product) => (
                    <Card key={product.product_id}
                          className={`max-w-md manage-product-card ${product.status === 'Inactive' ? 'opacity-50' : ''}`}>
                        <CardMedia
                            component="img"
                            image={product.image}
                            alt={product.title}
                            className='product-image-card'
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h7" component="div">
                                {product.title}
                            </Typography>
                            {/*<Typography variant="body2" className='pd-description' color="text.secondary">*/}
                            {/*    {product.description}*/}
                            {/*</Typography>*/}
                            {product.status === 'Rejected' && (
                                <div className="text-red-500">
                                    <LensIcon color="error" fontSize="small" /> Rejected
                                </div>
                            )}
                            {product.status === 'Booked' && (
                                <div className="text-green-500">
                                    <LensIcon color="success" fontSize="small" /> Booked
                                </div>
                            )}
                            {product.status === 'Active' && (
                                <div className="text-grey">
                                    <LensIcon color='grey' fontSize="small" /> Active
                                </div>
                            )}
                            {product.status === 'Inactive' && (
                                <div className="text-grey">
                                    <LensIcon color='grey' fontSize="small" /> Inactive
                                </div>
                            )}
                        </CardContent>
                        <CardActions>
                            <Button size="small" color="primary" style={{ backgroundColor: 'black', color: 'white',borderRadius:'50px' }} onClick= {() => handleView(product)}>
                                View
                            </Button>
                            {/*<Button size="small" color="primary">*/}
                            {/*    Manage*/}
                            {/*</Button>*/}
                            {['Active', 'Inactive'].includes(product.status) && (
                                product.status === 'Inactive' ? (
                                    <IconButton size="small" color="primary" onClick={() => handleUpdateProductStatus(product.product_id, 'Active')}>
                                        <CheckCircleIcon /> {/* Enable icon */}
                                    </IconButton>
                                ) : (
                                    <IconButton size="small" color="secondary" onClick={() => handleUpdateProductStatus(product.product_id, 'Inactive')}>
                                        <BlockIcon /> {/* Disable icon */}
                                    </IconButton>
                                )
                            )}
                        </CardActions>
                    </Card>
                ))}
                {selectedProduct && (
                    <ProductModal
                        product={selectedProduct}
                        isOpen={openProductPopup}
                        onClose={() => {setOpenProductPopup(false);setSelectedProduct(null);}}
                    />
                )}
            </div>

        </motion.div>
    );
};

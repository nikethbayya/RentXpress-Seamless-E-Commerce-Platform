import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {
    Rating,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel, Select, MenuItem
} from '@mui/material';
import { useUser } from "../hooks/UserContext";
import axios from "axios";
import '../styles/OwnedProducts.css'
import LensIcon from "@mui/icons-material/Lens";
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

export const RentedProducts = () => {
    const { user } = useUser();
    const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
    const [ticketDialogOpen, setTicketDialogOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [rating, setRating] = useState(0);
    const [ticketDescription, setTicketDescription] = useState("");
    const [ticketType, setTicketType] = useState('');
    const [products, setProducts] = useState({ current: [], past: [] });
    // useEffect(() => {console.log(products)}, [products])
    const fetchRentedProducts = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BOOKING_SERVICE}/getRentedProductsByUserId`, {
                params: { userId: user.user_id }
            });
            categorizeProducts(response.data.data);
        } catch (error) {
            console.error('Error fetching rented products:', error);
        }
    };

    const categorizeProducts = (rentedProducts) => {
        const categorizedProducts = { current: [], past: [] };
        rentedProducts.forEach(productInfo => {
            // Directly categorize each productInfo based on its active status
            if (productInfo.active) {
                categorizedProducts.current.push(productInfo);
            } else {
                categorizedProducts.past.push(productInfo);
            }
        });

        setProducts(categorizedProducts);
    };

    useEffect(() => {
        if (user?.user_id) {
            fetchRentedProducts();
        }
    }, [user]);

    const handleUpdateProductStatus = async (productId, transactionId, status) => {
        try {
            await axios.get(`${process.env.REACT_APP_BOOKING_SERVICE}/returnProduct?productId=${productId}&transactionId=${transactionId}`, {
                productId,
                transactionId
            });
            fetchRentedProducts();
            // Update UI to reflect new status
            // setRentedProducts(rentedProducts.map(product =>
            //     product.id === productId ? { ...product, status } : product
            // ));
        } catch (error) {
            console.error('Error updating product status:', error);
        }
    };

    const handleRate = async (product) => {
        setCurrentProduct(product);
        setRatingDialogOpen(true);
    };

    const handleRatingSubmission = async () => {
        try {
            // console.log(currentProduct);
            // API call to submit the rating
            await axios.post(`${process.env.REACT_APP_BOOKING_SERVICE}/rateProduct`, {
                productId: currentProduct.product_id,
                rating: rating
            });
            setRatingDialogOpen(false);
            // fetchRentedProducts(); // Refresh the products list to show updated ratings
        } catch (error) {
            console.error('Error submitting rating:', error);
        }
    };

    const handleRaiseTicket = (product) => {
        setCurrentProduct(product);
        setTicketDialogOpen(true);
    };

    const handleSubmitTicket = async () => {
        try {
            // Assuming you have an endpoint to submit the ticket
            const payload = {
                productId: currentProduct.product_id,
                ticketType: ticketType,  // Include the ticket type in the payload
                description: ticketDescription,
                userId: user.user_id  // Assuming you have user's ID available
            };

            await axios.post(`${process.env.REACT_APP_PRODUCT_SERVICE}/submitTicket`, payload);

            // Reset dialog state and clear form data
            setTicketDialogOpen(false);
            setTicketType('');     // Reset the ticket type
            setTicketDescription('');  // Reset the ticket description

            // Optionally, refresh or update the UI as needed
            // For example, you might want to fetch updated ticket information or display a success message
            // console.log('Ticket submitted successfully');
        } catch (error) {
            console.error('Error submitting ticket:', error);
        }
    };


    return (
        <>
            <motion.div
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                className="space-y-4"
            >

                <Typography gutterBottom variant="h5" component="div" className="text-black">
                    Current
                </Typography>
                <div className="flex flex-wrap md:flex-row gap-3">
                    {products.current.map((productInfo) => (
                        <Card key={productInfo.product.product_id}
                              className={`max-w-md manage-product-card ${productInfo.active === false ? 'opacity-50' : ''}`}>
                            <CardMedia
                                component="img"
                                image={productInfo.product.image}
                                alt={productInfo.product.title}
                                className='product-image-card'
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    {productInfo.product.title}
                                </Typography>
                                {/*<Typography variant="body2" className='pd-description' color="text.secondary"*/}
                                {/*            component="div">*/}
                                {/*    {productInfo.product.description}*/}
                                {/*</Typography>*/}
                                {productInfo.active === false && (
                                    <div className="text-red-500">
                                        <LensIcon color="error" fontSize="small"/> Returned
                                    </div>
                                )}
                                {productInfo.active === true && (
                                    <div className="text-green-500">
                                        <LensIcon color="success" fontSize="small"/> Booked
                                    </div>
                                )}
                            </CardContent>
                            <CardActions className="justify-center" sx={{padding:'20px'}}>

                                {productInfo.active === true && (
                                    <Button size="small"
                                            style={{ backgroundColor: 'black', color: 'white',borderRadius:'50px' }}
                                            onClick={() => {
                                        handleUpdateProductStatus(productInfo.product.product_id, productInfo.transaction_id, 'Returned')
                                    }}>
                                        Return
                                    </Button>
                                )}
                                <Button
                                    // startIcon={<WarningAmberIcon />}
                                    size="small"
                                    style={{ backgroundColor: 'orange', color: 'black', borderRadius:'50px'}} // Styling for the button
                                    onClick={() => handleRaiseTicket(productInfo.product)}
                                >
                                    Raise Ticket
                                </Button>
                            </CardActions>
                        </Card>
                    ))}
                </div>
                <Typography gutterBottom variant="h5" component="div" className="text-black">
                    Past
                </Typography>
                <div className="flex flex-wrap md:flex-row gap-3">
                    {products.past.map((productInfo) => (
                        <Card key={productInfo.product.product_id}
                              className={`max-w-md manage-product-card ${productInfo.active === false ? 'opacity-50' : ''}`}>
                            <CardMedia
                                component="img"
                                image={productInfo.product.image}
                                alt={productInfo.product.title}
                                className='product-image-card'
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    {productInfo.product.title}
                                </Typography>
                                {/*<Typography variant="body2" className='pd-description' color="text.secondary"*/}
                                {/*            component="div">*/}
                                {/*    {productInfo.product.description}*/}
                                {/*</Typography>*/}
                                {productInfo.active === false && (
                                    <div className="text-red-500">
                                        <LensIcon color="error" fontSize="small"/> Returned
                                    </div>
                                )}
                                {productInfo.active === true && (
                                    <div className="text-green-500">
                                        <LensIcon color="success" fontSize="small"/> Booked
                                    </div>
                                )}
                            </CardContent>
                            <CardActions className="justify-center" sx={{padding:'20px'}}>
                                {productInfo.active === false && (
                                    <Button size="small" color="secondary"
                                            style={{ backgroundColor: 'black', color: 'white',borderRadius:'50px' }}
                                            onClick={() => {
                                        handleRate(productInfo.product)
                                    }}>
                                        Rate
                                    </Button>
                                )}
                                <Button
                                    // startIcon={<WarningAmberIcon />}
                                    size="small"
                                    style={{ backgroundColor: 'orange', color: 'black' ,borderRadius:'50px'}}  // Styling for the button
                                    onClick={() => handleRaiseTicket(productInfo.product)}
                                >
                                    Raise Ticket
                                </Button>
                            </CardActions>
                        </Card>
                    ))}
                </div>
            </motion.div>
            <Dialog open={ratingDialogOpen} onClose={() => setRatingDialogOpen(false)}>
                <DialogTitle>Rate Product</DialogTitle>
                <DialogContent>
                    <Rating
                        name="simple-controlled"
                        value={rating}
                        onChange={(event, newValue) => {
                            setRating(newValue);
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleRatingSubmission}>Submit</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={ticketDialogOpen} onClose={() => setTicketDialogOpen(false)}>
                <DialogTitle>Raise a Ticket</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth margin="dense">
                        <InputLabel id="ticket-type-label">Ticket Type</InputLabel>
                        <Select
                            labelId="ticket-type-label"
                            id="ticketType"
                            value={ticketType}
                            label="Ticket Type"
                            onChange={(e) => setTicketType(e.target.value)}
                            fullWidth
                        >
                            <MenuItem value="Refund Request">Refund Request</MenuItem>
                            <MenuItem value="Complaint">Complaint</MenuItem>
                        </Select>
                    </FormControl>
                    {ticketType && (
                        <TextField
                            autoFocus
                            margin="dense"
                            id="ticketDescription"
                            label="Ticket Description"
                            type="text"
                            fullWidth
                            variant="standard"
                            value={ticketDescription}
                            onChange={(e) => setTicketDescription(e.target.value)}
                            placeholder={`Enter details for your ${ticketType.toLowerCase()}`}
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setTicketDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleSubmitTicket}>Submit</Button>
                </DialogActions>
            </Dialog>

        </>
    );
};

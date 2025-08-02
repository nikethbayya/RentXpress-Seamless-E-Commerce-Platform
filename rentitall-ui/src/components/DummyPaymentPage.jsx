import React, { useState } from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import { TextField, Button, Container, Typography, Grid } from '@mui/material';
import {SuccessPopup} from "./SuccessPopup";
import {useUser} from "../hooks/UserContext";
import axios from "axios";

const DummyPaymentPage = () => {
    const [paymentInfo, setPaymentInfo] = useState({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        nameOnCard: '',
        billingAddress: '',
        couponCode:''
    });
    const navigate = useNavigate();
    ;
    const [successPopup, setSuccessPopup] = useState(false);

    const {user,loginData} = useUser();
    const {state} = useLocation();
    const {product, startDate, endDate, totalPrice} = state;
    const owner_id = product.ownerId; // Assuming product prop includes owner information


    const handleChange = (e) => {
        const { name, value } = e.target;
        setPaymentInfo(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        const reservePayload = {
            product_id: product.product_id,
            user_id: user.user_id,
            owner_id: product.owner_id,
        };

        try {
            const response = await axios.post(process.env.REACT_APP_BOOKING_SERVICE+"/reserve", reservePayload);

            if (response.status === 200) {
                // const data = await response.json();
                // console.log('Reservation successful:', data);
                setSuccessPopup(true);
            } else {
                console.error('Reservation failed:', response);
            }
        } catch (error) {
            console.error('Network error:', error);
        }
    };

    return (
        <>
        <Container className="mt-10 p-5 rounded-lg shadow-lg">
            <Typography variant="h4" className="text-center mb-10" sx={{ color: 'white' }}>
                Payment Information
            </Typography>
            <form onSubmit={handlePayment} className="w-full max-w-lg mx-auto space-y-6">
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            label="Card Number"
                            variant="outlined"
                            fullWidth
                            name="cardNumber"
                            value={paymentInfo.cardNumber}
                            onChange={handleChange}
                            required
                            InputLabelProps={{style: { color: 'white' }}}
                            inputProps={{style: { color: 'white' }}}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: 'white',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'white',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: 'white',
                                    },
                                },
                            }}
                        />
                    </Grid>
                    {/* Repeat for other fields */}
                    <Grid item xs={6}>
                        <TextField
                            label="Expiry Date (MM/YY)"
                            variant="outlined"
                            fullWidth
                            name="expiryDate"
                            value={paymentInfo.expiryDate}
                            onChange={handleChange}
                            required
                            InputLabelProps={{style: { color: 'white' }}}
                            inputProps={{style: { color: 'white' }}}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: 'white',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'white',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: 'white',
                                    },
                                },
                            }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="CVV"
                            variant="outlined"
                            fullWidth
                            name="cvv"
                            type="password"
                            value={paymentInfo.cvv}
                            onChange={handleChange}
                            required
                            InputLabelProps={{style: { color: 'white' }}}
                            inputProps={{style: { color: 'white' }}}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: 'white',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'white',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: 'white',
                                    },
                                },
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Name on Card"
                            variant="outlined"
                            fullWidth
                            name="nameOnCard"
                            value={paymentInfo.nameOnCard}
                            onChange={handleChange}
                            required
                            InputLabelProps={{style: { color: 'white' }}}
                            inputProps={{style: { color: 'white' }}}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: 'white',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'white',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: 'white',
                                    },
                                },
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Billing Address"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={4}
                            name="billingAddress"
                            value={paymentInfo.billingAddress}
                            onChange={handleChange}
                            required
                            InputLabelProps={{style: { color: 'white' }}}
                            inputProps={{style: { color: 'white' }}}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: 'white',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'white',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: 'white',
                                    },
                                },
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Coupon Code (Optional)"
                            variant="outlined"
                            fullWidth
                            name="couponCode"
                            value={paymentInfo.couponCode}
                            onChange={handleChange}
                            InputLabelProps={{style: { color: 'white' }}}
                            inputProps={{style: { color: 'white' }}}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: 'white',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'white',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: 'white',
                                    },
                                },
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            sx={{
                                backgroundColor: 'white',
                                color: 'gray-800',
                                '&:hover': {
                                    backgroundColor: 'gray-300',
                                    color: 'gray-800',
                                },
                            }}
                        >
                            Book
                        </Button>
                    </Grid>
                </Grid>
            </form>

        </Container>
        {successPopup && <SuccessPopup message="Reservation Completed" page={"Home"} redirect={'/home'}/>}
        </>
);
};

export default DummyPaymentPage;

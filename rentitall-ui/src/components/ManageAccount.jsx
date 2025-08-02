import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    TextField,
    Button,
    Container,
    Paper,
    Typography,
    Box,
    IconButton,
    FormControl,
    Input,
    useTheme,
    InputLabel
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { StandaloneSearchBox } from '@react-google-maps/api';
import { UserProvider, useUser } from "../hooks/UserContext";
import axios from "axios";
import { SuccessPopup } from "./SuccessPopup";

export const ManageAccount = () => {
    const theme = useTheme();
    const { user, refreshData } = useUser();
    const [editableFields, setEditableFields] = useState({});
    const [formData, setFormData] = useState({
        firstName: user.firstName,
        lastName: user.lastName,
        address: user.address,
        mobile: user.mobile,
        lat: user.lat || null,
        long: user.long ||null,
        zipcode: user.zipcode || null
    });
    const [successPopup, setSuccessPopup] = useState(false);
    const [tempData, setTempData] = useState({});

    const autocompleteInputRef = useRef(null);

    useEffect(() => {

        setTempData(formData);
      
    }, [formData]);
    // useEffect(() => {
    //     console.log(formData,tempData);
    // },[formData,tempData])



    const handlePlacesChanged = () => {
        if (autocompleteInputRef.current) {
            const place = autocompleteInputRef.current.getPlaces();
            // console.log('address:',place)
            if (place && place.length > 0) {
                const postalCode = place[0]?.address_components?.find(component => component.types.includes("postal_code"));
                setTempData(prevDetails => ({
                    ...prevDetails,
                    address: place[0].formatted_address,
                    lat: place[0].geometry.location.lat(),
                    long: place[0].geometry.location.lng(),
                    ...(postalCode && { zipcode: postalCode.long_name })
                }));
            }
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setTempData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleEdit = (field) => {
        setEditableFields(prev => ({ ...prev, [field]: true }));
    };

    const handleSave = (field) => {
        setEditableFields(prev => ({ ...prev, [field]: false }));
        if (field === "address") {
            setFormData(prevFormData => ({
                ...prevFormData,
                [field]: tempData[field],
                lat: tempData.lat,
                long: tempData.long,
                zipcode: tempData.zipcode
            }));
            // console.log(formData,tempData)
        } else {
            // For other fields, update normally
            setFormData(prevFormData => ({
                ...prevFormData,
                [field]: tempData[field]
            }));
        }
        // console.log(tempData);
        // console.log(formData);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        await update(formData);
    };

    const update = useCallback(async (data) => {
        try {
            const userId = user.user_id;
            const url = `${process.env.REACT_APP_LOGIN_SERVICE}/update-profile?user_id=${userId}`;
            const response = await axios.post(url, data, {
                headers: { "Content-Type": "application/json" }
            });
            if (response.status === 200) {
                refreshData();
                // setSuccessPopup(true);
            }
        } catch (error) {
            console.error("Failed to update profile:", error);
        }
    }, []);

    return (
        <>
            <Container component="main" maxWidth="sm">
                <Paper elevation={6} sx={{ p: 3, mt: 2, backgroundColor: '#003239' }}>
                    <Typography variant="h5" sx={{ color: '#C0C0C0' }}>Update Profile</Typography>
                    <form onSubmit={handleSubmit}>
                        {Object.entries(tempData).map(([key, value]) => (
                            key !== 'lat' && key !== 'long' && key !== 'zipcode' && (
                                <Box key={key} sx={{ mt: 2, mb: 2, display: 'flex', alignItems: 'center', color: '#C0C0C0', backgroundColor: '#003239', p: 1, borderRadius: '5px' }}>
                                    {key !== 'address' ? (
                                        <TextField
                                            fullWidth
                                            label={key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim()}
                                            name={key}
                                            value={value}
                                            onChange={handleChange}
                                            disabled={!editableFields[key]}
                                            type={key === 'password' ? 'password' : 'text'}
                                            InputLabelProps={{
                                                style: { color: '#C0C0C0' }, // Label styles
                                            }}
                                            InputProps={{
                                                style: { color: '#C0C0C0' }, // Input text styles
                                            }}
                                        />
                                    ) : (
                                        <FormControl fullWidth variant="standard">
                                            {/*<InputLabel htmlFor="address" sx={{ color: '#C0C0C0' }}>Address</InputLabel>*/}
                                            <StandaloneSearchBox
                                                onLoad={ref => autocompleteInputRef.current = ref}
                                                onPlacesChanged={handlePlacesChanged}
                                            >
                                                <Input
                                                    id="address"
                                                    name="address"
                                                    value={value}
                                                    onChange={handleChange}
                                                    disabled={!editableFields[key]}
                                                    placeholder="Enter Your Address"
                                                    fullWidth
                                                    sx={{ color: '#C0C0C0', '&::placeholder': { color: '#A9A9A9' } }} // Placeholder styles
                                                />
                                            </StandaloneSearchBox>
                                        </FormControl>
                                    )}
                                    {!editableFields[key] ? (
                                        <IconButton onClick={() => handleEdit(key)} edge="end" sx={{ color: '#3f51b5' }}>
                                            <EditIcon />
                                        </IconButton>
                                    ) : (
                                        <IconButton onClick={() => handleSave(key)} edge="end" sx={{ color: 'green' }}>
                                            <SaveIcon />
                                        </IconButton>
                                    )}
                                </Box>
                            )
                        ))}
                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 2, backgroundColor: '#3f51b5', '&:hover': { backgroundColor: '#303f9f' } }}>
                            Update
                        </Button>
                    </form>
                </Paper>
            </Container>
            {successPopup && <SuccessPopup message="Profile Updated" page={"Home"} redirect={'/home'} />}
        </>
    );
};

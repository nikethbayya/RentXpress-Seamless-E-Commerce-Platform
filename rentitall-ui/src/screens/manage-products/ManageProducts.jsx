import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '@mui/material/Button';
import { TabPanel, TabContext, TabList } from '@mui/lab';
import {RentedProducts} from "../../components/RentedProducts";
import {createTheme, ThemeProvider} from "@mui/material";
import {OwnedProducts} from "../../components/OwnedProducts";
// import { RentedProducts } from './RentedProducts';
// import { OwnedProducts } from './OwnedProducts';

const theme = createTheme({
    palette: {
        primary: {
            main: '#003239',
        },
    },
});
export const ManageProducts = () => {
    const [value, setValue] = useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <ThemeProvider theme={theme}>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-gray-100 min-h-screen py-10"
            >
                <div className="container mx-auto px-4 sm:px-8 max-w-5xl">
                    <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Manage Products</h1>
                    <TabContext value={value}>
                        <TabList onChange={handleChange} centered className="flex justify-center mb-4">
                            <Button
                                variant={value === '1' ? 'contained' : 'outlined'}
                                onClick={() => setValue('1')}
                                className="mx-2 bg-dark-teal"
                            >
                                Rented
                            </Button>
                            <Button
                                variant={value === '2' ? 'contained' : 'outlined'}
                                color="primary"
                                onClick={() => setValue('2')}
                                className="mx-2"
                            >
                                Owned
                            </Button>
                        </TabList>
                        <TabPanel value="1" className="focus:outline-none">
                            <motion.div
                                key="rented"
                                initial={{ x: -100, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: 100, opacity: 0 }}
                            >
                                <RentedProducts />
                            </motion.div>
                        </TabPanel>
                        <TabPanel value="2" className="focus:outline-none">
                            <motion.div
                                key="owned"
                                initial={{ x: 100, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -100, opacity: 0 }}
                            >
                                <OwnedProducts />
                            </motion.div>
                        </TabPanel>
                    </TabContext>
                </div>
            </motion.div>
        </ThemeProvider>
    );
};

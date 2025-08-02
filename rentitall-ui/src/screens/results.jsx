import React, { useEffect, useState } from "react"
import ProductPopup from "../components/ProductPopup";
import { PageHeading } from "../components/PageHeading";
import axios from "axios";
import "./../styles/RentalItems.css"
import { ProductCard } from "../components/ProductCard";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const ResultsPage = (props) => {
    const [categories, setCategories] = useState([])
    const [products, setProducts] = useState([])
    const [openProductPopup, setOpenProductPopup] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const handleProductPopup = (selectedProduct) => {
        // console.log(selectedProduct);
        setSelectedProduct(selectedProduct);
        setOpenProductPopup(true);
    }

    const getAvailableCategories = async () => {
        // console.log('calling categories')
        try {
            const response = await axios.get(process.env.REACT_APP_PRODUCT_SERVICE + "/categories");
            // console.log("getAvailableCategories response", response?.data?.data)
            const availableCategories = response.data.data
            setCategories(availableCategories)

        } catch (error) {
            console.log(error)
        }
    }

    const getSearchProductsList = async () => {
        // console.log('calling products')
        try {
            const response = await axios.get(process.env.REACT_APP_PRODUCT_SERVICE + "/product-list", {
                params: {
                    ...filters,
                    phrase
                }
            });
            // console.log("getSearchProductsList response", response?.data?.data)
            const products_list = response.data.data
            // const new_products_list = products_list.map(product => {
            //     if(product.image[0] == '/') {
            //         const image = 'data:image/jpeg;base64,' + product.image
            //         console.log(image)
            //         product.image = image
            //     }
            //     return product
            // })
            setProducts(products_list)
        } catch (error) {
            console.log(error)
            setProducts([])
        }
    }

    // Get Categories and Products when page loads
    useEffect(() => {
        getAvailableCategories();
        // const sortByFilter = searchParams.get('sortBy')
        // const categoryFilters = searchParams.getAll('category')
        // console.log(sortByFilter, categoryFilters)
        // setUserSelectedFilters({
        //     sortBy: sortByFilter,
        //     categories: categoryFilters
        // })
        // handleApplyFilters(false)
        // getSearchProductsList()
    }, [])

    // Accordion 
    const [expanded, setExpanded] = React.useState('sort-by');
    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };

    // Filters
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const phrase = searchParams.get('phrase')
    useEffect(() => {
        handleApplyFilters(false)
        getSearchProductsList()
    }, [phrase])
    const [userSelectedFilters, setUserSelectedFilters] = useState({
        sortBy: searchParams.get('sortBy') && searchParams.get('sortBy').length > 0 ? searchParams.get('sortBy') : 'newest',
        filterCategories: searchParams.getAll('category')
    })

    const [filters, setFilters] = useState({...userSelectedFilters})

    const handleSortFilterInput = (e) => {
        setUserSelectedFilters({
            ...userSelectedFilters,
            sortBy: e.target.value
        })
    }

    const handleCategoryFilterInput = (value) => {
        // console.log('checkbox', value)
        const currentIndex = userSelectedFilters.filterCategories.findIndex(c => Number(c) === Number(value));
        const newCategories = [...userSelectedFilters.filterCategories]

        if (currentIndex === -1) {
            newCategories.push(value)
        } else {
            newCategories.splice(currentIndex, 1)
        }
        setUserSelectedFilters({
            ...userSelectedFilters,
            filterCategories: newCategories
        })
    }

    // useEffect(() => {
    //     console.log('userSelectedFilters', userSelectedFilters)
    // }, [userSelectedFilters])

    useEffect(() => {
        searchParams.set('sortBy', filters.sortBy);
        searchParams.delete('category')
        filters.filterCategories.map(categoryId => searchParams.append('category', categoryId))
        navigate(`?${searchParams.toString()}`, { replace: true });
        getSearchProductsList()
    }, [filters])

    const handleApplyFilters = (reset = false) => {
        // console.log('categories', categories)
        if (reset) {
            setUserSelectedFilters({
                sortBy: 'newest',
                filterCategories: []
            })
            setFilters({
                sortBy: 'newest',
                filterCategories: []
            })
        } else {
            setFilters({ ...userSelectedFilters })
        }
    }
    return (
        <div id="RentalItemsPage">
            <div className="page-container">
                <section className="mb-8">
                    <PageHeading title={`Search Results - ${phrase}`} />
                </section>
                <section className="products-section">
                    <div className="filters-sidebar">
                        <h2 className="filters-heading">Filters</h2>
                        <div>
                            <FormGroup>
                                <Accordion expanded={expanded === 'sort-by'} onChange={handleChange('sort-by')}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="sortBy-content"
                                        id="sortBy-header"
                                    >
                                        Sort By
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <RadioGroup
                                            aria-labelledby="sort-by"
                                            value={userSelectedFilters.sortBy}
                                            name="sort-by"
                                            onChange={handleSortFilterInput}
                                        >
                                            <FormControlLabel value="newest" control={<Radio />} label="Newest" />
                                            <FormControlLabel value="oldest" control={<Radio />} label="Oldest" />
                                        </RadioGroup>
                                    </AccordionDetails>
                                </Accordion>
                                <Accordion expanded={expanded === 'categories'} onChange={handleChange('categories')}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="categories-content"
                                        id="categories-header"
                                    >
                                        Categories
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        {
                                            categories.map(category =>
                                                <FormControlLabel key={category.id} control={<Checkbox checked={userSelectedFilters.filterCategories.some(c => Number(c) === Number(category.id))} onChange={() => { handleCategoryFilterInput(category.id) }} value={category.id} />} label={category.name} />
                                            )
                                        }
                                    </AccordionDetails>
                                </Accordion>
                            </FormGroup>
                        </div>
                        <div className="filters-actions">
                            <button onClick={() => { handleApplyFilters(false) }}>
                                Apply
                            </button>
                            <button className="secondary-button" onClick={() => { handleApplyFilters(true) }}>
                                Reset
                            </button>
                        </div>
                    </div>
                    {products.length > 0 ?
                        <div className="products-list">
                            {
                                products.map(product =>
                                    <ProductCard key={product.product_id} product={product} categories={categories} onClick={() => { handleProductPopup(product) }} />
                                )
                            }
                        </div>
                        :
                        <p className="no-products-msg">No Products Available</p>
                    }
                </section>

                {selectedProduct && (
                    <ProductPopup
                        product={selectedProduct}
                        isOpen={openProductPopup}
                        onClose={() => setOpenProductPopup(false)}
                    />
                )}
            </div>
        </div>
    )
}
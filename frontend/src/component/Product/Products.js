import React, { Fragment, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { clearErrors, getProduct } from '../../actions/productAction';
import Loader from '../layout/Loader/Loader';
import ProductCard from '../layout/Home/ProductCard';
import "./Products.css";
import Pagination from "react-js-pagination";
import Slider from "@material-ui/core/Slider";
import Typography from '@material-ui/core/Typography';
import {useAlert} from "react-alert";

const categories = [
    "Laptop",
    "Footwear",
    "Bottom",
    "Tops",
    "Attire",
    "Shirt",
    "Camera",
    "Smartphones",
];

const Products = () => {
    const dispatch = useDispatch();
    const alert = useAlert;
    const { keyword } = useParams();

    const [currentPage, setCurrentPage] = useState(1);
    const [price, setPrice] = useState([0, 100000]);
    const [category, setCategory] = useState("");
    const [ratings, setRatings] = useState(0);

    const { products, loading, error, resultPerPage, filteredProductsCount } = useSelector(
        (state) => state.products
    );

    const setCurrentPageNo = (pageNumber) => {
        setCurrentPage(pageNumber);
    }

    const priceHandler = (event, newPrice) => {
        setPrice(newPrice);
    }

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }
        dispatch(getProduct(keyword, currentPage, price, category,ratings));
    }, [dispatch, keyword, error, currentPage, price, category,ratings,alert]);

    return (
        <Fragment>
            {loading ? (
                <Loader />
            ) : (
                <Fragment>
                    <h2 className='productsHeading'>Products</h2>
                    <div className='products'>
                        {products && products.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>

                    <div className='filterBox'>
                        <Typography>Price</Typography>
                        <Slider
                            value={price}
                            onChange={priceHandler}
                            valueLabelDisplay='auto'
                            aria-labelledby='range-slider'
                            min={0}
                            max={100000}
                        />
                        <Typography>Categories</Typography>
                        <ul className='categoryBox'>
                            {categories.map((category) => (
                                <li
                                    className='category-link'
                                    key={category}
                                    onClick={() => setCategory(category)}
                                >
                                    {category}
                                </li>
                            ))}
                        </ul>

                        <fieldset>
                            <Typography component="legend"> Rating Above</Typography>
                            <Slider
                            value={ratings}
                            onChange={(e,newRating)=>{
                                setRatings(newRating);
                            }}
                            valueLabelDisplay='auto'
                            aria-labelledby='continous-slider'
                            min={0}
                            max={5}
                            />
                        </fieldset>
                    </div>
                    {resultPerPage < filteredProductsCount && (
                        <div className='paginationBox'>
                            <Pagination
                                activePage={currentPage}
                                itemsCountPerPage={resultPerPage}
                                totalItemsCount={filteredProductsCount}
                                onChange={setCurrentPageNo}
                                nextPageText="Next"
                                prevPageText="Prev"
                                firstPageText="1st"
                                lastPageText="Last"
                                itemClass='page-item'
                                linkClass='page-link'
                                activeClass='pageItemActive'
                                activeLinkClass='pageLinkActive'
                            />
                        </div>
                    )}
                </Fragment>
            )}
        </Fragment>
    );
};

export default Products;

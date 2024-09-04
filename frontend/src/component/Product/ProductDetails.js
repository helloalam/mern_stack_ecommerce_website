import React, { Fragment, useEffect, useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './ProductDetails.css';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { clearErrors, getProductDetails, newReview } from '../../actions/productAction';
import ReviewCard from "./ReviewCard.js";
import Loader from "../layout/Loader/Loader"; 
import { useAlert } from 'react-alert';
import MetaData from "../layout/MetaData.js";
import { addItemsToCart } from "../../actions/cartAction";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@material-ui/core";
import { Rating } from "@material-ui/lab";
import { NEW_REVIEW_RESET } from '../../constants/productConstants.js';

const ProductDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const alert = useAlert();

    const { product, loading, error } = useSelector(
        (state) => state.productDetails
    );
    const { success, error: reviewError } = useSelector(
        (state) => state.newReview
    );

    const [open, setOpen] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");

  

    const options = {
        size: "large",
        value: product.ratings,
        readOnly:true,
        precision:0.5,
    };

    const increaseQuantity = () => {
        if (product.Stock <= quantity) return;
        setQuantity(quantity + 1);
    };

    const decreaseQuantity = () => {
        if (quantity <= 1) return;
        setQuantity(quantity - 1);
    };

    const addToCartHandler = () => {
        dispatch(addItemsToCart(id, quantity));
        alert.success("Item Added To Cart");
    };

    const submitReviewToggle = () => {
        setOpen(!open);
    };

    const reviewSubmitHandler = () => {
        const myForm = new FormData();
        myForm.set("rating", rating);
        myForm.set("comment", comment);
        myForm.set("productId", id);

        dispatch(newReview(myForm));
        setOpen(false);
        setRating(0);
        setComment("");
    };

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }
        
        if (reviewError) {
            alert.error(reviewError);
            dispatch(clearErrors());
        }

        if (success) {
            alert.success("Review Submitted Successfully");
            dispatch(getProductDetails(id)); // Refresh product details
            dispatch({ type: NEW_REVIEW_RESET });
        }

        dispatch(getProductDetails(id));
    }, [dispatch, id, error, alert, reviewError, success]);

    return (
        <Fragment>
            {loading ? (
                <Loader />
            ) : (
                <Fragment>
                    <MetaData title={`${product.name} -- Ecommerce`} />
                    <div className="ProductDetails">
                        <div className="ProductContent">
                            <Carousel
                                showArrows={true}
                                interval={3500}
                                dynamicHeight={false}
                                stopOnHover={false}
                                infiniteLoop={true}
                                showStatus={false}
                                transitionTime={500}
                                showThumbs={false}
                                showIndicators={true}
                                swipeable={true}
                                emulateTouch={true}
                                autoPlay={true}
                                className="carousel-container"
                            >
                                {product.images && product.images.map((item, i) => (
                                    <div key={item._id}>
                                        <img
                                            className="CarouselImage"
                                            src={item.url}
                                            alt={`${i} Slide`}
                                        />
                                    </div>
                                ))}
                            </Carousel>
                        </div>
                        <div className="ProductInfo">
                            <div className='detailsBlock-1'>
                                <h2>{product.name}</h2>
                                <p>Product #{product._id}</p>
                            </div>
                            <div className='detailsBlock-2'>
                                <Rating {...options} />
                                <span className='detailsBlock-2-span'> 
                                   
                                    ({product.numOfReviews} Reviews)</span>
                            </div>
                            <div className='detailsBlock-3'>
                                <h1>{`₹${product.price}`}</h1>
                                <div className='detailsBlock-3-1'>
                                    <div className='detailsBlock-3-1-1'>
                                        <button onClick={decreaseQuantity}>-</button>
                                        <input readOnly type="number" value={quantity} />
                                        <button onClick={increaseQuantity}>+</button>
                                    </div>
                                    <button disabled={product.Stock < 1} onClick={addToCartHandler}>
                                        Add to Cart
                                    </button>
                                </div>
                                <p>
                                    Status:{" "}
                                    <b className={product.Stock < 1 ? "redColor" : "greenColor"}>
                                        {product.Stock < 1 ? "Out of Stock" : "In Stock"}
                                    </b>
                                </p>
                            </div>

                            <div className='detailsBlock-4'>
                                Description: <p>{product.description}</p>
                            </div>

                            <button className='submitReview' onClick={submitReviewToggle}>
                                Submit Review
                            </button>
                        </div>
                    </div>

                    <h3 className='reviewHeading'>REVIEWS</h3>

                    <Dialog
                        aria-labelledby="simple-dialog-title"
                        open={open}
                        onClose={submitReviewToggle}
                    >
                        <DialogTitle>Submit Review</DialogTitle>
                        <DialogContent className="submitDialog">
                            <Rating
                                onChange={(e) => setRating(e.target.value)}
                                value={rating}
                                size="large"
                            />

                            <textarea
                                className="submitDialogTextArea"
                                cols="30"
                                rows="5"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            ></textarea>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={submitReviewToggle} color="secondary">
                                Cancel
                            </Button>
                            <Button onClick={reviewSubmitHandler} color="primary">
                                Submit
                            </Button>
                        </DialogActions>
                    </Dialog>
                    
                    {product.reviews && product.reviews.length > 0 ? (
                        <div className="reviews">
                            {product.reviews.map((review) => (
                                <ReviewCard key={review._id} review={review} />
                            ))}
                        </div>
                    ) : (
                        <p className="noReviews">No Reviews Yet</p>
                    )}
                </Fragment>
            )}
        </Fragment>
    );
};

export default ProductDetails;

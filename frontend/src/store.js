import { createStore, combineReducers, applyMiddleware } from "redux";
import {thunk} from "redux-thunk"; // Use default import
import { composeWithDevTools } from "redux-devtools-extension";
import { newProductReducer, newReviewReducer, productDetailsReducer, productReducer, productReviewsReducer, productsReducer, reviewReducer } from "./reducers/productReducer";
import {  allUsersReducer, forgotPasswordReducer, profileReducer, userDetailsReducer, userReducer } from "./reducers/userReducer";
import { cartReducer } from "./reducers/cartReducer";
import { allOrdersReducer, myOrdersReducer, newOrderReducer, orderDetailsReducer, orderReducer } from "./reducers/orderReducer";
const reducer = combineReducers({
    products: productsReducer,
    productDetails: productDetailsReducer,
    user:userReducer,
    profile:profileReducer,
    forgotPassword:forgotPasswordReducer,
    cart:cartReducer,
    newOrder:newOrderReducer,
    myOrders:myOrdersReducer,
    orderDetails:orderDetailsReducer,
    newReview:newReviewReducer,
    allUsers:allUsersReducer,
    allOrders:allOrdersReducer,
    product: productReducer,
    newProduct:newProductReducer,
    order:orderReducer,
    userDetails:userDetailsReducer,
    productReviews:productReviewsReducer,
    review: reviewReducer,


});

let initialState = {
    cart: {
      cartItems: localStorage.getItem("cartItems")
        ? JSON.parse(localStorage.getItem("cartItems"))
        : [],
      shippingInfo: localStorage.getItem("shippingInfo")
        ? JSON.parse(localStorage.getItem("shippingInfo"))
        : {},
    },
  };



const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  process.env.NODE_ENV === "development"
    ? composeWithDevTools(applyMiddleware(...middleware))
    : applyMiddleware(...middleware)
);

export default store;

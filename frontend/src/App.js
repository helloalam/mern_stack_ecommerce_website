import './App.css';
import { useEffect, useState } from 'react';
import Header from "./component/layout/Header/Header.js";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WebFont from "webfontloader";
import React from "react";
import Footer from './component/layout/Footer/Footer.js';
import Home from './component/layout/Home/Home.js';
import ProductDetails from "./component/Product/ProductDetails.js";
import Products from "./component/Product/Products.js";
import Search from "./component/Product/Search.js";
import LoginSignUp from './component/User/LoginSignUp.js';
// import store from "./store.js";
import { loadUser } from './actions/userAction.js';
import UserOptions from "./component/layout/Header/UserOptions.js";
import { useDispatch, useSelector } from 'react-redux';
import Profile from "./component/User/Profile.js";
import UpdateProfile from "./component/User/UpdateProfile.js";
import UpdatePassword from "./component/User/UpdatePassword.js";
import ForgotPassword from "./component/User/ForgotPassword.js";
import ResetPassword from "./component/User/ResetPassword.js";
import Cart from './component/Cart/Cart.js';
import Shipping from "./component/Cart/Shipping.js";
import ConfirmOrder from "./component/Cart/ConfirmOrder.js";
import axios from 'axios';
import Payment from "./component/Cart/Payment.js";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import OrderSuccess from './component/Cart/OrderSuccess.js';
import MyOrders from './component/Order/MyOrders.js';
import ProtectedRoute from './component/Route/ProtectedRoute.js';
import OrderDetails from "./component/Order/OrderDetails.js";
import Dashboard from "./component/admin/Dashboard.js";
import ProductList from "./component/admin/ProductList.js";
import NewProduct from "./component/admin/NewProduct.js";
import UpdateProduct from "./component/admin/UpdateProduct.js";
import OrderList from "./component/admin/OrderList.js";
import ProcessOrder from "./component/admin/ProcessOrder.js";
import UsersList from "./component/admin/UsersList.js";
import UpdateUser from "./component/admin/UpdateUser.js";
import ProductReviews from "./component/admin/ProductReviews.js";
import About from "./component/layout/About/About.js";
import Contact from './component/layout/Contact/Contact.js';
import NotFound from "./component/layout/Not Found/NotFound.js";



function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(state => state.user);
  const [stripeApiKey, setStripeApiKey] = useState("");


  // useEffect(() => {
  //   store.dispatch(loadUser());
  //   WebFont.load({
  //     google: {
  //       families: ["Roboto", "Droid Sans", "Chilanka"],
  //     },
  //   });

  useEffect(() => {
    dispatch(loadUser());

    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"],
      },
    });

    const fetchStripeApiKey = async () => {
      try {
        const { data } = await axios.get("/api/v1/stripeapikey");
        setStripeApiKey(data.stripeApiKey);
      } catch (error) {
        console.error("Error fetching Stripe API key:", error);
      }
    };

    fetchStripeApiKey();

    const handleContextMenu = (e) => e.preventDefault();
    window.addEventListener("contextmenu", handleContextMenu);

    return () => {
      window.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [dispatch]);

  return (
    <Router>
      <Header />
      {isAuthenticated && <UserOptions user={user} />}
      

      <Routes>
      {stripeApiKey && (
  <Route
    path="/process/payment"
    element={
      <ProtectedRoute
        element={() => (
          <Elements stripe={loadStripe(stripeApiKey)}>
            <Payment />
          </Elements>
        )}
      />
    }
  />
)}
      <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:keyword" element={<Products />} />
        <Route path="/search" element={<Search />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/account" element={<ProtectedRoute element={Profile} />} />
        <Route path="/me/update" element={<ProtectedRoute element={UpdateProfile} />} />
        <Route path="/login" element={<LoginSignUp />} />
        <Route path="/password/update" element={<ProtectedRoute element={UpdatePassword} />} />
        <Route path="/password/forgot"  element={<ForgotPassword />} />
        <Route path="/password/reset/:token" element={<ResetPassword />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/shipping" element={<ProtectedRoute element={Shipping} />} />
        <Route path="/order/confirm" element={<ProtectedRoute element={ConfirmOrder} />} />
        <Route path="/success" element={<ProtectedRoute element={OrderSuccess} />} />
        <Route path="/orders" element={<ProtectedRoute element={MyOrders} />} />
        <Route path="/order/:id" element={<ProtectedRoute element={OrderDetails} />} />
        <Route path="/admin/dashboard" element={<ProtectedRoute isAdmin={true}  element={Dashboard} />} />
        <Route path="/admin/products" element={<ProtectedRoute isAdmin={true}  element={ProductList} />} />
        <Route path="/admin/product" element={<ProtectedRoute isAdmin={true}  element={NewProduct} />} />
        <Route path="/admin/product/:id" element={<ProtectedRoute isAdmin={true}  element={UpdateProduct} />} />
        <Route path="/admin/orders" element={<ProtectedRoute isAdmin={true}  element={OrderList} />} />
        <Route path="/admin/order/:id" element={<ProtectedRoute isAdmin={true}  element={ProcessOrder} />} />
        <Route path="/admin/users" element={<ProtectedRoute isAdmin={true}  element={UsersList} />} />
        <Route path="/admin/user/:id" element={<ProtectedRoute isAdmin={true}  element={UpdateUser} />} />
        <Route path="/admin/user/:id" element={<ProtectedRoute isAdmin={true}  element={UpdateUser} />} />
        <Route path="/admin/reviews" element={<ProtectedRoute isAdmin={true}  element={ProductReviews} />} />

        <Route path="*" element={<NotFound />} />



      </Routes>
      <Footer />
    </Router>
  );
}

export default App;

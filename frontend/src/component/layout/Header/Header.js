import React from "react";
import { ReactNavbar } from "overlay-navbar";
import logo from "../../../images/logo.png"; // Ensure this path is correct
import { FaSearch, FaShoppingCart, FaUser } from "react-icons/fa"; // Example icons

const options = {
  burgerColorHover: "#eb4034",
  logo,
  logoWidth: "20vmax",
  navColor1: "white",
  logoHoverSize: "10px",
  logoHoverColor: "#eb4034",
  link1Text: "Home",
  link2Text: "Products",
  link3Text: "Contact",
  link4Text: "About",
  link1Url: "/",
  link2Url: "/products",
  link3Url: "/contact",
  link4Url: "/about",
  link1Size: "1.3vmax",
  link1Color: "rgba(35, 35, 35,0.8)",
  nav1justifyContent: "flex-end",
  nav2justifyContent: "flex-end",
  nav3justifyContent: "flex-start",
  nav4justifyContent: "flex-start",
  link1ColorHover: "#eb4034",
  link1Margin: "1vmax",
  profileIconUrl: "/login",
  profileIconColor: "rgba(35, 35, 35,0.8)",
  searchIcon: true,
  SearchIconElement: FaSearch, // Assuming you're using FontAwesome icons
  searchIconColor: "rgba(35, 35, 35,0.8)",
  cartIcon: true,
  CartIconElement: FaShoppingCart, // Assuming you're using FontAwesome icons
  cartIconColor: "rgba(35, 35, 35,0.8)",
  profileIcon: true,
  ProfileIconElement: FaUser, // Assuming you're using FontAwesome icons
  profileIconColorHover: "#eb4034",
  searchIconColorHover: "#eb4034",
  cartIconColorHover: "#eb4034",
  cartIconMargin: "1vmax",
};

const Header = () => {
  return <ReactNavbar {...options} />;
};

export default Header;

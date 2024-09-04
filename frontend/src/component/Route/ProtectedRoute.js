import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Loader from "../layout/Loader/Loader";

const ProtectedRoute = ({ isAdmin, element: Element, ...rest }) => {
  const { loading, isAuthenticated, user } = useSelector((state) => state.user);

  if (loading) {
    return <Loader />; // Show loading while user data is being fetched
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (isAdmin && user.role !== "admin") {
    return <Navigate to="/login" />;
  }

  return <Element {...rest} />;
};

export default ProtectedRoute;

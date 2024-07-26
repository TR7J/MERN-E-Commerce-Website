import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Store } from "../context/Store";

const AdminRoute: React.FC = () => {
  const { state } = useContext(Store);
  const { userInfo } = state;

  return userInfo && userInfo.isAdmin ? <Outlet /> : <Navigate to="/signin" />;
};

export default AdminRoute;

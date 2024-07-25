import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { Store } from "../context/Store";

interface AdminRouteProps {
  children: React.ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const { state } = useContext(Store);
  const { userInfo } = state;
  return userInfo && userInfo.isAdmin ? (
    <>{children}</>
  ) : (
    <Navigate to="/signin" />
  );
}

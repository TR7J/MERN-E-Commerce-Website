import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import App from "./App";
import "./index.css";
import HomePage from "./pages/Homepage";
import ProductPage from "./pages/ProductPage/ProductPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { StoreProvider } from "./context/Store";
import CartPage from "./pages/CartPage/CartPage";
import SigninPage from "./pages/SignInPage/SigninPage";
import SignupPage from "./pages/SignupPage/SignupPage";
import ShippingAddressPage from "./pages/ShippingAddressPage/ShippingAddressPage";
import PaymentMethodPage from "./pages/PaymentMethodPage";
import ProtectedRoute from "./components/ProtectedRoute";
import PlaceOrderPage from "./pages/PlaceOrderPage/PlaceOrderPage";
import OrderPage from "./pages/OrderPage";
import OrderHistoryPage from "./pages/OrderHistoryPage";
import ProfilePage from "./pages/ProfilePage";
import SearchPage from "./pages/SearchPage/SearchPage";
import AdminDashBoard from "./pages/AdminDashboard";
import AdminRoute from "./components/AdminRoute";
import OrderListPage from "./pages/OrderListPage/OrderListPage";
import UserListPage from "./pages/UserListPage";
import ProductListPage from "./pages/ProductListPage/ProductListPage";
import ProductEditPage from "./pages/ProductEditPage/ProductEditPage";
import UserEditPage from "./pages/UserEditPage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} element={<HomePage />} />
      <Route path="product/:slug" element={<ProductPage />} />
      <Route path="cart" element={<CartPage />} />
      <Route path="signin" element={<SigninPage />} />
      <Route path="signup" element={<SignupPage />} />
      <Route path="search" element={<SearchPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="shipping" element={<ShippingAddressPage />} />
        <Route path="payment" element={<PaymentMethodPage />} />
        <Route path="placeorder" element={<PlaceOrderPage />} />
        <Route path="order/:id" element={<OrderPage />} />
        <Route path="orderhistory" element={<OrderHistoryPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
      <Route element={<AdminRoute />}>
        <Route path="admin/dashboard" element={<AdminDashBoard />} />
        <Route path="admin/orders" element={<OrderListPage />} />
        <Route path="admin/users" element={<UserListPage />} />
        <Route path="admin/products" element={<ProductListPage />} />
        <Route path="admin/product/:id" element={<ProductEditPage />} />
        <Route path="admin/user/:id" element={<UserEditPage />} />
      </Route>
    </Route>
  )
);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <StoreProvider>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </HelmetProvider>
    </StoreProvider>
  </React.StrictMode>
);

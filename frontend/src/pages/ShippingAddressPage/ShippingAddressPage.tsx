/* checkout steps */
import { useContext, useEffect, useState } from "react";

import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import CheckoutSteps from "../../components/CheckoutSteps";
import { Store } from "../../context/Store";
import "./ShippingAddressPage.css";

export default function ShippingAddressPage() {
  const navigate = useNavigate();
  const { state, dispatch } = useContext(Store);
  const {
    userInfo,
    cart: { shippingAddress },
  } = state;

  useEffect(() => {
    if (!userInfo) {
      navigate("/signin?redirect=/shipping");
    }
  }, [userInfo, navigate]);

  const [fullName, setFullName] = useState(shippingAddress.fullName || "");
  const [address, setAddress] = useState(shippingAddress.address || "");
  const [city, setCity] = useState(shippingAddress.city || "");
  const [postalCode, setPostalCode] = useState(
    shippingAddress.postalCode || ""
  );
  const [country, setCountry] = useState(shippingAddress.country || "");

  const submitHandler = (e: React.SyntheticEvent) => {
    e.preventDefault();
    dispatch({
      type: "SAVE_SHIPPING_ADDRESS",
      payload: {
        fullName,
        address,
        city,
        postalCode,
        country,
      },
    });
    localStorage.setItem(
      "shippingAddress",
      JSON.stringify({
        fullName,
        address,
        city,
        postalCode,
        country,
      })
    );

    navigate("/payment");
  };

  return (
    <div>
      <Helmet>
        <title>Shipping Address</title>
      </Helmet>
      <CheckoutSteps step1 step2></CheckoutSteps>
      <div className="container small-container">
        <h1 className="my-3">Shipping Address</h1>
        <form onSubmit={submitHandler} className="shipping-form">
          <div className="mb-3">
            <label className="shipping-label">Full Name</label>
            <input
              className="shipping-input"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="shipping-label">Address</label>
            <input
              className="shipping-input"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            {" "}
            <label className="shipping-label">City</label>
            <input
              className="shipping-input"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="shipping-label">Postal Code</label>
            <input
              className="shipping-input"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="shipping-label">Country</label>
            <input
              className="shipping-input"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <button type="submit" className="shipping-btn">
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

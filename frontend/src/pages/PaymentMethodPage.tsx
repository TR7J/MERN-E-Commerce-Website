import { useContext, useEffect, useState } from "react";

import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import CheckoutSteps from "../components/CheckoutSteps";
import { Store } from "../context/Store";

export default function PaymentMethodPage() {
  const navigate = useNavigate();
  const { state, dispatch } = useContext(Store);
  const {
    cart: { shippingAddress, paymentMethod },
  } = state;

  const [paymentMethodName, setPaymentMethodName] = useState(
    paymentMethod || "PayPal"
  );
  useEffect(() => {
    if (!shippingAddress.address) {
      navigate("/shipping");
    }
  }, [shippingAddress, navigate]);

  const submitHandler = (e: React.SyntheticEvent) => {
    e.preventDefault();
    dispatch({ type: "SAVE_PAYMENT_METHOD", payload: paymentMethodName });
    localStorage.setItem("paymentMethod", paymentMethodName);
    navigate("/placeorder");
  };
  return (
    <div>
      <CheckoutSteps step1 step2 step3></CheckoutSteps>
      <div className="container small-container">
        <Helmet>
          <title>Payment Method</title>
        </Helmet>
        <h1 className="my-3">Payment Method</h1>
        <form onSubmit={submitHandler}>
          <div className="mb-3">
            <label>Paypal</label>
            <input
              type="radio"
              id="PayPal"
              value="PayPal"
              checked={paymentMethodName === "PayPal"}
              onChange={(e) => setPaymentMethodName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label>Stripe</label>
            <input
              type="radio"
              id="Stripe"
              value="Stripe"
              checked={paymentMethodName === "Stripe"}
              onChange={(e) => setPaymentMethodName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <button type="submit" className="payment-method-btn">
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

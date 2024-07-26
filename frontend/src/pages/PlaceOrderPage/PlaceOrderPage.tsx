import { useContext, useEffect } from "react";

import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CheckoutSteps from "../../components/CheckoutSteps";
import Loading from "../../components/Loading/Loading";
import { useCreateOrderMutation } from "../../hooks/orderHooks";
import { Store } from "../../context/Store";
import { ApiError } from "../../types/ApiError";
import { getError } from "../../utils";
import "./PlaceOrderPage.css";

export default function PlaceOrderPage() {
  const navigate = useNavigate();

  const { state, dispatch } = useContext(Store);
  const { cart /*  userInfo  */ } = state;

  const round2 = (num: number) => Math.round(num * 100 + Number.EPSILON) / 100; // 123.2345 => 123.23

  cart.itemsPrice = round2(
    cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
  );
  cart.shippingPrice = cart.itemsPrice > 100 ? round2(0) : round2(10);
  cart.taxPrice = round2(0.15 * cart.itemsPrice);
  cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;

  const { mutateAsync: createOrder, status } = useCreateOrderMutation();

  const placeOrderHandler = async () => {
    try {
      const data = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      });
      dispatch({ type: "CART_CLEAR" });
      localStorage.removeItem("cartItems");
      navigate(`/order/${data.order._id}`);
    } catch (err) {
      toast.error(getError(err as ApiError));
    }
  };

  useEffect(() => {
    if (!cart.paymentMethod) {
      navigate("/payment");
    }
  }, [cart, navigate]);

  return (
    <div>
      <CheckoutSteps step1 step2 step3 step4></CheckoutSteps>
      <Helmet>
        <title>Preview Order</title>
      </Helmet>
      <h1 className="my-3">Preview Order</h1>
      <div>
        <div>
          <div className="cart-item">
            <div>
              <h3>Shipping</h3>
              <div>
                <strong>Name:</strong> {cart.shippingAddress.fullName} <br />
                <strong>Address: </strong> {cart.shippingAddress.address},
                {cart.shippingAddress.city}, {cart.shippingAddress.postalCode},
                {cart.shippingAddress.country}
              </div>
              <Link to="/shipping" className="link">
                Edit
              </Link>
            </div>
          </div>

          <div className="cart-item">
            <div>
              <h3>Payment</h3>
              <div>
                <strong>Method:</strong> {cart.paymentMethod}
              </div>
              <Link to="/payment" className="link">
                Edit
              </Link>
            </div>
          </div>

          <div>
            <div>
              <h3>Items</h3>
              <div className="order-container">
                {cart.cartItems.map((item) => (
                  <div key={item._id} className="order-item">
                    <div className="order-item-image">
                      <img
                        src=/* {item.image} */ {`http://localhost:8000${item.image}`}
                        alt={item.name}
                        className="img-fluid rounded thumbnail"
                      ></img>{" "}
                    </div>
                    <div className="order-item-details">
                      <Link
                        to={`/product/${item.slug}`}
                        className="link link-order"
                      >
                        {item.name}
                      </Link>
                      <div>
                        <span>{item.quantity}</span>
                      </div>
                      <p>{item.price} KSH</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/cart" className="link">
                Edit
              </Link>
            </div>
          </div>
        </div>
        <h3 className="order-summary-h3">Order Summary</h3>
        <div className="purchase-div">
          <div className="order-summary">
            <div className="order-summary-item">
              <h4 className="order-summary-label">Items</h4>
              <p className="order-summary-value">
                {cart.itemsPrice.toFixed(2)} KSH
              </p>
            </div>

            <div className="order-summary-item">
              <h4 className="order-summary-label">Shipping</h4>
              <p className="order-summary-value">
                {cart.shippingPrice.toFixed(2)} KSH
              </p>
            </div>

            <div className="order-summary-item">
              <h4 className="order-summary-label">Tax</h4>
              <p className="order-summary-value">
                {cart.taxPrice.toFixed(2)} KSH
              </p>
            </div>
            <div className="order-summary-item">
              <h4 className="order-summary-label">
                <strong> Order Total</strong>
              </h4>
              <p className="order-summary-value">
                <strong>{cart.totalPrice.toFixed(2)} KSH</strong>
              </p>
            </div>

            <div>
              <div className="d-grid">
                <button
                  type="button"
                  className="order-summary-button"
                  onClick={placeOrderHandler}
                  disabled={cart.cartItems.length === 0 || status === "pending"}
                >
                  Place Order
                </button>
                {status === "pending" && <Loading />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

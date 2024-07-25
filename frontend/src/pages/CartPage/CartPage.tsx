import { useContext } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Store } from "../../context/Store";
import { CartItem } from "../../types/Cart";
import "./CartPage.css";

export default function CartPage() {
  const navigate = useNavigate();

  const {
    state: {
      cart: { cartItems },
    },
    dispatch,
  } = useContext(Store);

  const updateCartHandler = (item: CartItem, quantity: number) => {
    if (item.countInStock < quantity) {
      toast.warn("Sorry. Product is out of stock");
      return;
    }
    dispatch({
      type: "CART_ADD_ITEM",
      payload: { ...item, quantity },
    });
  };
  const checkoutHandler = () => {
    navigate("/signin?redirect=/shipping");
  };
  const removeItemHandler = (item: CartItem) => {
    dispatch({ type: "CART_REMOVE_ITEM", payload: item });
  };

  const itemCount = cartItems.reduce((a, c) => a + c.quantity, 0);
  const subtotal = cartItems
    .reduce((a, c) => a + c.price * c.quantity, 0)
    .toFixed(2);

  return (
    <div>
      <Helmet>
        <title>Shopping Cart</title>
      </Helmet>
      <h1>Shopping Cart</h1>
      <div className="cart-container">
        {cartItems.length === 0 ? (
          <div>
            Cart is empty. <Link to="/">Go Shopping</Link>
          </div>
        ) : (
          <div>
            {cartItems.map((item: CartItem) => (
              <div key={item._id} className="cart-item">
                <div className="cart-item-image">
                  <img
                    src={`http://localhost:8000${item.image}`}
                    alt={item.name}
                    className="img-fluid rounded thumbnail"
                  />
                </div>
                <div className="cart-item-details">
                  <Link to={`/product/${item.slug}`}>{item.name}</Link>
                  <div className="cart-item-quantity">
                    <button
                      onClick={() => updateCartHandler(item, item.quantity - 1)}
                      disabled={item.quantity === 1}
                    >
                      <i className="fas fa-minus-circle"></i>
                    </button>{" "}
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => updateCartHandler(item, item.quantity + 1)}
                      disabled={item.quantity === item.countInStock}
                    >
                      <i className="fas fa-plus-circle"></i>
                    </button>
                  </div>
                  <div className="cart-item-price">{item.price} KSH</div>
                </div>

                <div className="cart-item-remove">
                  <button onClick={() => removeItemHandler(item)}>
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="purchase-div">
          <div className="purchase-summary">
            <div className="purchase-summary-item">
              <span className="purchase-summary-label">
                Items ({itemCount})
              </span>
              <span className="purchase-summary-value">{subtotal} KSH</span>
            </div>
            <div className="purchase-summary-item">
              <span className="purchase-summary-label">Delivery</span>
              {/* <FaInfoCircle className="icon" /> */}
              <span className="purchase-summary-value free">Free</span>
            </div>
            <div className="purchase-summary-total">
              <span className="purchase-summary-total-label">
                Purchase total
              </span>
              <span className="purchase-summary-total-value">
                {subtotal} KSH
              </span>
            </div>
            <button
              type="button"
              onClick={checkoutHandler}
              disabled={cartItems.length === 0}
              className="purchase-summary-button"
            >
              Go to checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

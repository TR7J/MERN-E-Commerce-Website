import { useContext } from "react";
import { Link } from "react-router-dom";
import { Product } from "../../types/Product";
import Rating from "../Rating";
import { Store } from "../../context/Store";
import { convertProductToCartItem } from "../../utils";
import { CartItem } from "../../types/Cart";
import { toast } from "react-toastify";
import "./ProductItem.css";

const ProductItem = ({ product }: { product: Product }) => {
  const { state, dispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const addToCartHandler = (item: CartItem) => {
    const existItem = cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    if (product.countInStock < quantity) {
      alert("Sorry. Product is out of stock");
      return;
    }
    dispatch({
      type: "CART_ADD_ITEM",
      payload: { ...item, quantity },
    });
    toast.success("Product added to the cart");
  };

  return (
    <div className="card">
      <Link to={"/product/" + product.slug}>
        <img
          src=/* {product.image} */ {`http://localhost:8000${product.image}`}
          alt={product.name}
          /* className="product-image" */
        />
      </Link>
      <div className="card-content">
        <h2 className="category">{product.name}</h2>

        <Rating
          rating={product.rating}
          numberOfReviews={product.numberOfReviews}
        />
      </div>
      <div className="card-purchase">
        <p>{product.price} KSH</p>
        {product.countInStock === 0 ? (
          <div className="card-purchase-stock">Out of stock</div>
        ) : (
          <button
            onClick={() => addToCartHandler(convertProductToCartItem(product))}
            /* className="card-purchase-button" */
          >
            Add to cart
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductItem;

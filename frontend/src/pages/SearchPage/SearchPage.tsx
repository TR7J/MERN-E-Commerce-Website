import "./SearchPage.css";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSearchProducts } from "../../hooks/productHooks";
import Loading from "../../components/Loading/Loading";
import Rating from "../../components/Rating";
import { toast } from "react-toastify";
import { CartItem } from "../../types/Cart";
import { convertProductToCartItem } from "../../utils";
import { useContext } from "react";
import { Store } from "../../context/Store";
import { Product } from "../../types/Product";

const SearchPage = () => {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);

  const [category, setCategory] = useState<string>(
    queryParams.get("category") || ""
  );
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);

  const query = queryParams.get("query") || "";

  const { state, dispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const {
    data: products,
    isLoading,
    error,
  } = useSearchProducts({ query, category, minPrice, maxPrice });

  useEffect(() => {
    setCategory(queryParams.get("category") || "");
    setMinPrice(Number(queryParams.get("minPrice")) || undefined);
    setMaxPrice(Number(queryParams.get("maxPrice")) || undefined);
  }, [search]);

  const addToCartHandler = (item: CartItem) => {
    const existItem = cartItems.find((x) => x._id === item._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    if (item.countInStock < quantity) {
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
    <>
      <h1>Search Results</h1>
      <div className="search-page">
        <h3>Filter By Price</h3>
        <div className="filters">
          <div className="filters-group">
            <label>Min Price:</label>
            <input
              type="number"
              placeholder="min-price"
              className="min-price-input"
              value={minPrice || ""}
              onChange={(e) => setMinPrice(Number(e.target.value))}
            />
          </div>
          <div className="filters-group">
            <label>Max Price:</label>
            <input
              placeholder="max-price"
              type="number"
              className="max-price-input"
              value={maxPrice || ""}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
            />
          </div>
        </div>
        {isLoading ? (
          <Loading />
        ) : error ? (
          <div>There was an error</div>
        ) : (
          <div>
            {products.length === 0 ? (
              <div>No products found</div>
            ) : (
              <div className="cards-container">
                {products.map((product: Product) => (
                  <div key={product._id} className="card">
                    <Link to={"/product/" + product.slug}>
                      <img
                        src={`http://localhost:8000${product.image}`}
                        alt={product.name}
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
                          onClick={() =>
                            addToCartHandler(convertProductToCartItem(product))
                          }
                        >
                          Add to cart
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default SearchPage;

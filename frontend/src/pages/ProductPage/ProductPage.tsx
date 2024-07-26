import { Helmet } from "react-helmet-async";
import { useGetProductDetailsBySlugQuery } from "../../hooks/productHooks";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "../../components/Loading/Loading";
import Rating from "../../components/Rating";
import { useContext, useRef, useState } from "react";
import { Store } from "../../context/Store";
import { convertProductToCartItem, getError } from "../../utils";

import { ApiError } from "../../types/ApiError";
import apiClient from "../../apiClient";
import "./ProductPage.css";

const ProductPage = () => {
  const params = useParams();
  const { slug } = params;
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const {
    data: product,
    isLoading,
    error,
  } = useGetProductDetailsBySlugQuery(slug!);

  const navigate = useNavigate();

  const addToCartHandler = () => {
    const existItem = cart.cartItems.find((x) => x._id === product!._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    if (product!.countInStock < quantity) {
      toast.warn("Sorry. Product is out of stock");
      return;
    }
    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...convertProductToCartItem(product!), quantity },
    });
    toast.success("Product added to the cart");
    navigate("/cart");
  };

  const reviewsRef = useRef<HTMLDivElement>(null);
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!comment || !rating) {
      toast.error("Please enter comment and rating");
      return;
    }
    try {
      const { data } = await apiClient.post(
        `/api/products/${product!._id}/reviews`,
        { rating, comment, name: userInfo?.name },
        {
          headers: { Authorization: `Bearer ${userInfo?.token}` },
        }
      );

      toast.success("Review submitted successfully");
      product!.reviews.unshift(data.review);
      product!.numberOfReviews = data.numReviews;
      product!.rating = data.rating;

      window.scrollTo({
        behavior: "smooth",
        top: reviewsRef.current?.offsetTop || 0,
      });
    } catch (error) {
      toast.error(getError(error as ApiError));
    }
  };

  return isLoading ? (
    <Loading />
  ) : error ? (
    <div>There was an error</div>
  ) : !product ? (
    <div>There is no product</div>
  ) : (
    <div>
      <Helmet>
        <title>{product.name}</title>
      </Helmet>
      <div className="product-page">
        <div className="product-details">
          <div className="product-image">
            <img
              className="img-large"
              src={`http://localhost:8000${product.image}`}
              alt={product.name}
            />
          </div>
          <div className="product-info">
            <h1>{product.name}</h1>
            <Rating
              rating={product.rating}
              numberOfReviews={product.numberOfReviews}
            />
            <p>Price: {product.price} KSH</p>
            <p>Description: {product.description}</p>
          </div>
          <div className="cart-section">
            <div className="price-status">
              <strong>Price: {product.price} KSH</strong>
              <div className="price-status-2nd">
                <strong>Status:</strong>{" "}
                {product.countInStock > 0 ? (
                  <span style={{ color: "green" }}>In Stock</span>
                ) : (
                  <span style={{ color: "red" }}>Unavailable</span>
                )}
              </div>
            </div>
            {product.countInStock > 0 && (
              <button
                className="price-status-button"
                onClick={addToCartHandler}
              >
                Add to Cart
              </button>
            )}
          </div>
        </div>
        <div className="review-form">
          {userInfo ? (
            <form onSubmit={submitHandler}>
              <h2>Write a customer review</h2>
              <div>
                <label htmlFor="rating">Rating</label>
                <select
                  id="rating"
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                >
                  <option value="">Select...</option>
                  <option value="1">1- Poor</option>
                  <option value="2">2- Fair</option>
                  <option value="3">3- Good</option>
                  <option value="4">4- Very good</option>
                  <option value="5">5- Excellent</option>
                </select>
              </div>
              <div>
                <label htmlFor="comment">Comments</label>
                <textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>
              <button className="button" type="submit">
                Submit
              </button>
            </form>
          ) : (
            <div>
              Please{" "}
              <a href={`/signin?redirect=/product/${product.slug}`}>Sign In</a>{" "}
              to write a review
            </div>
          )}
        </div>
        <div className="reviews" ref={reviewsRef}>
          <h2>Reviews</h2>
          {product.reviews.length === 0 ? (
            <div className="empty-state">
              There is no review. Be the first to review?
            </div>
          ) : (
            product.reviews.map((review) => (
              <div key={review._id} className="review">
                <div className="name-date">
                  <strong>@{review.name}</strong>
                  <p>{review.createdAt.substring(0, 10)}</p>
                </div>
                <Rating rating={review.rating} caption=" " />
                <p>{review.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;

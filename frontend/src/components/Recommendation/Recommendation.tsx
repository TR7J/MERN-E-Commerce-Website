import { useState, useEffect, useContext } from "react";
import Loading from "../Loading";

import { Product } from "../../types/Product";
import apiClient from "../../apiClient";

import { Store } from "../../context/Store";
import RecommendedProductItem from "../SingleProduct/RecommendedProductItem";

const Recommendation = () => {
  /*     const { state } = useContext(Store);
  const { userInfo } = state; */
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await apiClient.get<[]>(
          `api/recommendations/${userInfo?._id}`
        );
        setRecommendedProducts(response.data);
      } catch (err) {
        setError("There was an error fetching recommendations");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [userInfo?._id]);

  return isLoading ? (
    <Loading />
  ) : error ? (
    <div>{error}</div>
  ) : (
    <div>
      {/* <Helmet>
        <title>Recommended Products</title>
      </Helmet> */}
      <h2>Recommended for You</h2>
      <div className="product-list">
        {recommendedProducts.map((product) => (
          <RecommendedProductItem key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Recommendation;

import { useContext, useEffect, useState } from "react";
import apiClient from "../../apiClient";
import { Store } from "../../context/Store";
import { Product } from "../../types/Product";

const Recommendations = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        if (userInfo?._id) {
          const response = await apiClient.get<Product[]>(
            `api/recommendations/${userInfo._id}`
          );
          console.log("API Response Data:", response.data);
          setProducts(response.data);
        }
      } catch (error) {
        console.error("Error fetching recommendations", error);
      }
    };

    fetchRecommendations();
  }, [userInfo?._id]);

  return (
    <div>
      <h2>Recommended Products</h2>
      <div>
        {products.length > 0 ? (
          products.map((product: Product) => (
            <div key={product._id}>{product.name}</div>
          ))
        ) : (
          <p>Browse more to get Recommended Products.</p>
        )}
      </div>
    </div>
  );
};

export default Recommendations;

import { useGetProductsQuery } from "../hooks/productHooks";
import Loading from "../components/Loading/Loading";
import ProductItem from "../components/SingleProduct/ProductItem";
import { Helmet } from "react-helmet-async";
import "../components/SingleProduct/ProductItem.css";
import Recommendation from "../components/Recommendation/Recommendation";
import Featured from "../components/Featured/Featured";

const Homepage = () => {
  const { data: products, isLoading, error } = useGetProductsQuery();

  return isLoading ? (
    <Loading />
  ) : error ? (
    <div>There was an error</div>
  ) : (
    <div>
      <Helmet>
        <title>Mot Du Jour</title>
      </Helmet>
      <Featured />
      <h2 className="recent-products">View Our Recent Products</h2>
      <div className="spares-list">
        {products!.map((product) => (
          <div key={product.slug}>
            <ProductItem product={product} />
          </div>
        ))}
      </div>
      <div>
        <Recommendation />
      </div>
    </div>
  );
};

export default Homepage;

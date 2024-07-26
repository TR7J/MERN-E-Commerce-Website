import React, { useContext, useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Store } from "../../context/Store";
import { getError } from "../../utils";
import { Product } from "../../types/Product"; // Import your Product type if you have one
import { ApiError } from "../../types/ApiError";
import Loading from "../../components/Loading/Loading";
import apiClient from "../../apiClient";
import "./ProductListPage.css";

interface State {
  loading: boolean;
  error: string;
  products: Product[];
  loadingCreate: boolean;
  loadingDelete: boolean;
  successDelete: boolean;
}

interface Action {
  type:
    | "FETCH_REQUEST"
    | "FETCH_SUCCESS"
    | "FETCH_FAIL"
    | "CREATE_REQUEST"
    | "CREATE_SUCCESS"
    | "CREATE_FAIL"
    | "DELETE_REQUEST"
    | "DELETE_SUCCESS"
    | "DELETE_FAIL"
    | "DELETE_RESET";
  payload?: any;
}

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        products: action.payload.products,
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "CREATE_REQUEST":
      return { ...state, loadingCreate: true };
    case "CREATE_SUCCESS":
      return { ...state, loadingCreate: false };
    case "CREATE_FAIL":
      return { ...state, loadingCreate: false };
    case "DELETE_REQUEST":
      return { ...state, loadingDelete: true, successDelete: false };
    case "DELETE_SUCCESS":
      return { ...state, loadingDelete: false, successDelete: true };
    case "DELETE_FAIL":
      return { ...state, loadingDelete: false, successDelete: false };
    case "DELETE_RESET":
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      return state;
  }
};

const ProductListPage: React.FC = () => {
  const [
    { loading, error, products, loadingCreate, loadingDelete, successDelete },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: "",
    products: [],
    loadingCreate: false,
    loadingDelete: false,
    successDelete: false,
  });

  const navigate = useNavigate();
  /* const { search } = useLocation(); */

  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await apiClient.get(`/api/products/admin`, {
          headers: { Authorization: `Bearer ${userInfo?.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err as ApiError) });
      }
    };

    if (successDelete) {
      dispatch({ type: "DELETE_RESET" });
    } else {
      fetchData();
    }
  }, [userInfo?.token, successDelete]);

  const createHandler = async () => {
    if (window.confirm("Are you sure you want to create a product?")) {
      try {
        dispatch({ type: "CREATE_REQUEST" });
        const { data } = await apiClient.post(
          "/api/products",
          {},
          {
            headers: { Authorization: `Bearer ${userInfo?.token}` },
          }
        );
        toast.success("Product created successfully");
        dispatch({ type: "CREATE_SUCCESS" });
        navigate(`/admin/product/${data.product._id}`);
      } catch (err) {
        toast.error(getError(err as ApiError));
        dispatch({ type: "CREATE_FAIL" });
      }
    }
  };

  const deleteHandler = async (product: Product) => {
    if (window.confirm("Are you sure to delete?")) {
      try {
        await apiClient.delete(`/api/products/${product._id}`, {
          headers: { Authorization: `Bearer ${userInfo?.token}` },
        });
        toast.success("Product deleted successfully");
        dispatch({ type: "DELETE_SUCCESS" });
      } catch (err) {
        toast.error(getError(err as ApiError));
        dispatch({ type: "DELETE_FAIL" });
      }
    }
  };

  return (
    <div>
      <div className="product-heading-create">
        <div>
          <h1>Products</h1>
        </div>
        <div className="create-product">
          <div>
            <h4 className="create-product-h4">Create a New Product</h4>
          </div>
          <button
            type="button"
            onClick={createHandler}
            className="create-product-button"
          >
            Create Product
          </button>
        </div>
      </div>

      {loadingCreate && <Loading />}
      {loadingDelete && <Loading />}

      {loading ? (
        <Loading />
      ) : error ? (
        <div>There was an error</div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td className="td-any">{product.name}</td>
                  <td>{product.price}</td>
                  <td className="td-any">{product.category}</td>
                  <td className="td-any">{product.brand}</td>
                  <td className="td-actions">
                    <button
                      type="button"
                      onClick={() => navigate(`/admin/product/${product._id}`)}
                    >
                      Edit
                    </button>
                    &nbsp;
                    <button
                      type="button"
                      onClick={() => deleteHandler(product)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProductListPage;

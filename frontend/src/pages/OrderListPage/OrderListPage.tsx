import React, { useContext, useEffect, useReducer } from "react";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/Loading/Loading";
import { Store } from "../../context/Store";
import { getError } from "../../utils";
import { ApiError } from "../../types/ApiError";
import apiClient from "../../apiClient";
import "./OrderListPage.css";

// Define the shape of the order data
interface Order {
  _id: string;
  user: {
    name: string;
  } | null;
  createdAt: string;
  totalPrice: number;
  isPaid: boolean;
  paidAt: string | null;
  isDelivered: boolean;
  deliveredAt: string | null;
}

// Define the state and action types for the reducer
interface State {
  loading: boolean;
  error: string;
  orders: Order[];
  loadingDelete: boolean;
  successDelete: boolean;
}

type Action =
  | { type: "FETCH_REQUEST" }
  | { type: "FETCH_SUCCESS"; payload: Order[] }
  | { type: "FETCH_FAIL"; payload: string }
  | { type: "DELETE_REQUEST" }
  | { type: "DELETE_SUCCESS" }
  | { type: "DELETE_FAIL" }
  | { type: "DELETE_RESET" };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        orders: action.payload,
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "DELETE_REQUEST":
      return { ...state, loadingDelete: true, successDelete: false };
    case "DELETE_SUCCESS":
      return {
        ...state,
        loadingDelete: false,
        successDelete: true,
      };
    case "DELETE_FAIL":
      return { ...state, loadingDelete: false };
    case "DELETE_RESET":
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      return state;
  }
};

const OrderListScreen: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [{ loading, error, orders, loadingDelete, successDelete }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
      orders: [],
      loadingDelete: false,
      successDelete: false,
    });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await apiClient.get<Order[]>(`/api/orders`, {
          headers: { Authorization: `Bearer ${userInfo?.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(err as ApiError),
        });
      }
    };

    if (successDelete) {
      dispatch({ type: "DELETE_RESET" });
    } else {
      fetchData();
    }
  }, [userInfo, successDelete]);

  const deleteHandler = async (order: Order) => {
    if (window.confirm("Are you sure to delete?")) {
      try {
        dispatch({ type: "DELETE_REQUEST" });
        await apiClient.delete(`api/orders/${order._id}`, {
          headers: { Authorization: `Bearer ${userInfo?.token}` },
        });
        toast.success("Order deleted successfully");
        dispatch({ type: "DELETE_SUCCESS" });
      } catch (err) {
        toast.error(getError(err as ApiError));
        dispatch({
          type: "DELETE_FAIL",
        });
      }
    }
  };

  return (
    <div>
      <Helmet>
        <title>Orders</title>
      </Helmet>
      <h1>Orders</h1>
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
                <th>USER</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th>DELIVERED</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td data-label="ID">{order._id}</td>
                  <td data-label="USER">
                    {order.user ? order.user.name : "DELETED USER"}
                  </td>
                  <td data-label="DATE" className="td-date">
                    {order.createdAt.substring(0, 10)}
                  </td>
                  <td data-label="TOTAL">{order.totalPrice.toFixed(2)}</td>
                  <td data-label="PAID" className="td-date">
                    {order.isPaid ? order.paidAt?.substring(0, 10) : "No"}
                  </td>
                  <td data-label="DELIVERED" className="td-date">
                    {order.isDelivered
                      ? order.deliveredAt?.substring(0, 10)
                      : "No"}
                  </td>
                  <td data-label="ACTIONS" className="td-actions">
                    <button
                      type="button"
                      onClick={() => {
                        navigate(`/order/${order._id}`);
                      }}
                      className="table-button"
                    >
                      Details
                    </button>
                    &nbsp;
                    <button
                      type="button"
                      onClick={() => deleteHandler(order)}
                      className="table-button delete-button"
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

export default OrderListScreen;

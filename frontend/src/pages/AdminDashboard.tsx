import React, { useContext, useEffect, useReducer } from "react";
/* import axios from 'axios'; */
import { Store } from "../context/Store";
import { getError } from "../utils";
import Loading from "../components/Loading";
import { ApiError } from "../types/ApiError";
import apiClient from "../apiClient";

interface SummaryData {
  users: { numUsers: number }[];
  orders: { numOrders: number; totalSales: number }[];
  dailyOrders: { _id: string; sales: number }[];
  productCategories: { _id: string; count: number }[];
}

interface State {
  loading: boolean;
  summary: SummaryData | null;
  error: string;
}

type Action =
  | { type: "FETCH_REQUEST" }
  | { type: "FETCH_SUCCESS"; payload: SummaryData }
  | { type: "FETCH_FAIL"; payload: string };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        summary: action.payload,
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const AdminDashBoard: React.FC = () => {
  const [{ loading, summary, error }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
    summary: null,
  });
  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await apiClient.get<SummaryData>(
          "/api/orders/summary" /* ,
          {
            headers: { Authorization: `Bearer ${userInfo?.token}` },
          } */
        );
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(err as ApiError),
        });
      }
    };
    fetchData();
  }, [userInfo]);

  return (
    <div>
      <h1>Dashboard</h1>
      {loading ? (
        <Loading />
      ) : error ? (
        <div>There was an error</div>
      ) : (
        <div>
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <div
              style={{
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
            >
              <h3>Users</h3>
              <p>{summary?.users[0]?.numUsers ?? 0}</p>
            </div>
            <div
              style={{
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
            >
              <h3>Orders</h3>
              <p>{summary?.orders[0]?.numOrders ?? 0}</p>
            </div>
            <div
              style={{
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
            >
              <h3>Total Sales</h3>
              <p>${(summary?.orders[0]?.totalSales ?? 0).toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashBoard;

import React, { useContext, useEffect, useReducer, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "../components/Loading/Loading"; // Updated import
import { Store } from "../context/Store";
import { getError } from "../utils";
import { ApiError } from "../types/ApiError";
import apiClient from "../apiClient";

interface State {
  loading: boolean;
  error: string;
  loadingUpdate: boolean;
}

interface Action {
  type:
    | "FETCH_REQUEST"
    | "FETCH_SUCCESS"
    | "FETCH_FAIL"
    | "UPDATE_REQUEST"
    | "UPDATE_SUCCESS"
    | "UPDATE_FAIL";
  payload?: any;
}

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "UPDATE_REQUEST":
      return { ...state, loadingUpdate: true };
    case "UPDATE_SUCCESS":
      return { ...state, loadingUpdate: false };
    case "UPDATE_FAIL":
      return { ...state, loadingUpdate: false };
    default:
      return state;
  }
};

const UserEditPage: React.FC = () => {
  const [{ loading, error, loadingUpdate }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
    loadingUpdate: false,
  });

  const { state } = useContext(Store);
  const { userInfo } = state;

  const params = useParams<{ id: string }>();
  const { id: userId } = params;
  const navigate = useNavigate();

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await apiClient.get(`api/users/${userId}`, {
          headers: { Authorization: `Bearer ${userInfo?.token}` },
        });
        setName(data.name);
        setEmail(data.email);
        setIsAdmin(data.isAdmin);
        dispatch({ type: "FETCH_SUCCESS" });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(err as ApiError),
        });
      }
    };
    fetchData();
  }, [userId, userInfo]);

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      dispatch({ type: "UPDATE_REQUEST" });
      await apiClient.put(
        `api/users/${userId}`,
        { _id: userId, name, email, isAdmin },
        {
          headers: { Authorization: `Bearer ${userInfo?.token}` },
        }
      );
      dispatch({ type: "UPDATE_SUCCESS" });
      toast.success("User updated successfully");
      navigate("/admin/users");
    } catch (error) {
      toast.error(getError(error as ApiError));
      dispatch({ type: "UPDATE_FAIL" });
    }
  };

  return (
    <div className="sign-up-page">
      <Helmet>
        <title>Edit User {userId}</title>
      </Helmet>
      <h1>Edit User: {name}</h1>
      <h3>ID: {userId}</h3>
      <div className="sign-up-container">
        {loading ? (
          <Loading />
        ) : error ? (
          <div className="error-message">Error: {error}</div>
        ) : (
          <form onSubmit={submitHandler}>
            <div className="sign-up-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                className="sign-up-input"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="sign-up-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                className="sign-up-input"
                value={email}
                placeholder="Email Address"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="sign-up-group">
              <label htmlFor="isAdmin">
                <input
                  type="checkbox"
                  id="isAdmin"
                  checked={isAdmin}
                  onChange={(e) => setIsAdmin(e.target.checked)}
                />
                Admin
              </label>
            </div>
            <div className="sign-up-button-div">
              <button
                type="submit"
                disabled={loadingUpdate}
                className="sign-up-button"
              >
                Update
              </button>
            </div>
            {loadingUpdate && <Loading />}
          </form>
        )}
      </div>
    </div>
  );
};

export default UserEditPage;

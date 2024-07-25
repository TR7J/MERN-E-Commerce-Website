import { useContext, useEffect, useState } from "react";

import { Helmet } from "react-helmet-async";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useSigninMutation } from "../../hooks/userHooks";
import { Store } from "../../context/Store";
import { getError } from "../../utils";
import { ApiError } from "../../types/ApiError";
import Loading from "../../components/Loading";
import "../SignupPage/SignupPage.css";

export default function SigninPage() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectInUrl ? redirectInUrl : "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;

  const { mutateAsync: signin, isLoading } = useSigninMutation();

  const submitHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const data = await signin({
        email,
        password,
      });
      dispatch({ type: "USER_SIGNIN", payload: data });
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate(redirect);
    } catch (err) {
      toast.error(getError(err as ApiError));
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="sign-up-page">
      <h1 className="sign-up-title">Sign In</h1>
      <div className="sign-up-container">
        <Helmet>
          <title>Sign In</title>
        </Helmet>

        <form onSubmit={submitHandler} className="sign-in-form">
          <div className="sign-up-group">
            {/* <label>Email</label> */}
            <input
              type="email"
              required
              placeholder="Email address"
              className="sign-up-input"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="sign-up-group password-group">
            {/* <label>Password</label> */}
            <input
              type={!showPassword ? "text" : "password"}
              required
              placeholder="Password"
              className="sign-up-input"
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              onClick={togglePasswordVisibility}
              className="password-toggle"
            >
              <i
                className={showPassword ? "fas fa-eye-slash" : "fas fa-eye"}
              ></i>
            </span>
          </div>
          <div className="sign-up-button-div">
            <button
              disabled={isLoading}
              type="submit"
              className="sign-up-button"
            >
              Sign In
            </button>
            {isLoading && <Loading />}
          </div>
          <div className="sign-up-group-sign-in">
            Don't have an account?{" "}
            <Link
              to={`/signup?redirect=${redirect}`}
              className="sign-up-form-link"
            >
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

import { useContext, useEffect, useState } from "react";

import { Helmet } from "react-helmet-async";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSignupMutation } from "../../hooks/userHooks";
import { Store } from "../../context/Store";
import { ApiError } from "../../types/ApiError";
import { getError } from "../../utils";
import "./SignupPage.css";

export default function SignupPage() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectInUrl ? redirectInUrl : "/";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const { mutateAsync: signup /* isLoading */ } = useSignupMutation();

  const submitHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      const data = await signup({
        name,
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
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="sign-up-page">
      <h1 className="sign-up-title">Create An Account</h1>

      <div className="sign-up-container">
        <Helmet>
          <title>Sign Up</title>
        </Helmet>

        <form onSubmit={submitHandler}>
          <div className="sign-up-group">
            {/* <label>Name</label> */}
            <input
              type="text"
              onChange={(e) => setName(e.target.value)}
              className="sign-up-input"
              required
              placeholder="Name"
            />
          </div>

          <div className="sign-up-group">
            {/* <label>Email</label> */}
            <input
              type="email"
              required
              className="sign-up-input"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
            />
          </div>

          <div className="sign-up-group password-group">
            {/* <label>Password</label> */}
            <input
              type={!showPassword ? "text" : "password"}
              required
              className="sign-up-input"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
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

          <div className="sign-up-group password-group">
            {/* <label>Confirm Password</label> */}
            <input
              type={!showConfirmPassword ? "text" : "password"}
              className="sign-up-input"
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm password"
            />

            <span
              onClick={toggleConfirmPasswordVisibility}
              className="password-toggle"
            >
              <i
                className={
                  showConfirmPassword ? "fas fa-eye-slash" : "fas fa-eye"
                }
              ></i>
            </span>
          </div>

          <div className="sign-up-button-div">
            <button type="submit" className="sign-up-button">
              Sign Up
            </button>
          </div>
          <div className="sign-up-group-sign-in">
            Already have an account?
            <Link
              to={`/signin?redirect=${redirect}`}
              className="sign-up-form-link"
            >
              Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

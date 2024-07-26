import { useContext, useState } from "react";
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";
import Loading from "../components/Loading/Loading";
import { useUpdateProfileMutation } from "../hooks/userHooks";
import { Store } from "../context/Store";
import { ApiError } from "../types/ApiError";
import { getError } from "../utils";

export default function ProfilePage() {
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;
  const [name, setName] = useState(userInfo!.name);
  const [email, setEmail] = useState(userInfo!.email);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { mutateAsync: updateProfile, status } = useUpdateProfileMutation();

  const submitHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      if (password !== confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
      const data = await updateProfile({
        name,
        email,
        password,
      });
      dispatch({ type: "USER_SIGNIN", payload: data });
      localStorage.setItem("userInfo", JSON.stringify(data));
      toast.success("User updated successfully");
    } catch (err) {
      toast.error(getError(err as ApiError));
    }
  };

  return (
    <div className="sign-up-page">
      <Helmet>
        <title>User Profile</title>
      </Helmet>
      <h1 className="sign-up-title">User Profile</h1>
      <form onSubmit={submitHandler}>
        <div className="sign-up-group">
          <label>Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="sign-up-input"
            placeholder="Name"
          />
        </div>
        <div className="sign-up-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="sign-up-input"
            placeholder="Email address"
          />
        </div>
        <div className="sign-up-group">
          <label>Password</label>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            className="sign-up-input"
            placeholder="Password"
          />
        </div>
        <div className="sign-up-group">
          <label>Confirm Password</label>
          <input
            type="password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="sign-up-input"
            placeholder="Confirm password"
          />
        </div>
        <div className="sign-up-button-div">
          <button
            disabled={status === "pending"}
            type="submit"
            className="sign-up-button"
          >
            Update
          </button>
          {status === "pending" && <Loading />}
        </div>
      </form>
    </div>
  );
}

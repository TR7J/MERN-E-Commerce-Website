import "./Navbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { useContext, useEffect, useState } from "react";
import { Store } from "../../context/Store";
import { Link, useNavigate } from "react-router-dom";
import SearchBox from "../SearchBox";
import { useGetCategoriesQuery } from "../../hooks/productHooks";
import Loading from "../Loading/Loading";

const Navbar = () => {
  const { state, dispatch } = useContext(Store);
  const navigate = useNavigate();
  const { cart, userInfo } = state;
  const totalItems = cart.cartItems.reduce((a, c) => a + c.quantity, 0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const signoutHandler = () => {
    dispatch({ type: "USER_SIGNOUT" });
    localStorage.removeItem("userInfo");
    localStorage.removeItem("cartItems");
    localStorage.removeItem("shippingAddress");
    localStorage.removeItem("paymentMethod");
    window.location.href = "/signin";
  };

  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const { data: categories, isLoading, error } = useGetCategoriesQuery();
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleCategoryClick = (category: string) => {
    navigate(`/search?category=${category}`);
    setSidebarIsOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to={"/"} className="brand">
          Mot Du Jour
        </Link>
      </div>
      {/* <SearchBox /> */}
      {!isMobile && <SearchBox />}
      <div className="navbar-right">
        <div>
          <Link
            to="#"
            className="link"
            onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
          >
            <i className="fas fa-bars icon-bars"></i>
          </Link>
        </div>
        <Link to={"/cart"}>
          <div className="icon-container">
            <FontAwesomeIcon icon={faShoppingCart} className="cart-icon" />
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </div>
        </Link>
        <div>
          <button className="modal-button" onClick={() => setModalIsOpen(true)}>
            ᒬ
          </button>
          {modalIsOpen && (
            <div
              className="modal-overlay"
              onClick={() => setModalIsOpen(false)}
            >
              <div onClick={(e) => e.stopPropagation()}>
                <button
                  className="close-button"
                  onClick={() => setModalIsOpen(false)}
                >
                  &times;
                </button>
                <Link
                  to="/orderHistory"
                  onClick={() => setModalIsOpen(false)}
                  className="modal-content-links"
                >
                  Orders
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setModalIsOpen(false)}
                  className="modal-content-links"
                >
                  Profile
                </Link>
                {userInfo?.isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setModalIsOpen(false)}
                    className="modal-content-links"
                  >
                    Dashboard
                  </Link>
                )}
                {userInfo?.isAdmin && (
                  <Link
                    to="/admin/users"
                    onClick={() => setModalIsOpen(false)}
                    className="modal-content-links"
                  >
                    View Users
                  </Link>
                )}
                {userInfo?.isAdmin && (
                  <Link
                    to="/admin/orders"
                    onClick={() => setModalIsOpen(false)}
                    className="modal-content-links"
                  >
                    Customer Orders
                  </Link>
                )}
                {userInfo?.isAdmin && (
                  <Link
                    to="/admin/products"
                    onClick={() => setModalIsOpen(false)}
                    className="modal-content-links"
                  >
                    Products
                  </Link>
                )}
                {userInfo ? (
                  <Link
                    to="/signout"
                    onClick={() => {
                      setModalIsOpen(false);
                      signoutHandler();
                    }}
                    className="modal-content-links"
                  >
                    Sign out
                  </Link>
                ) : (
                  <Link
                    to="/signin"
                    onClick={() => setModalIsOpen(false)}
                    className="modal-content-links"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      {sidebarIsOpen && (
        <div
          onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
          className="side-navbar-backdrop"
        ></div>
      )}
      <div
        className={sidebarIsOpen ? "active-nav side-navbar " : "side-navbar "}
      >
        <div className="side-navbar-user">
          <Link
            to={userInfo ? `/profile` : `/signin`}
            onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
          >
            <span>
              {userInfo ? `Hello, ${userInfo.name}` : `Hello, sign in`}
            </span>
          </Link>
        </div>
        <div className="categories-closebtn">
          <strong>Categories</strong>
          <button onClick={() => setSidebarIsOpen(!sidebarIsOpen)}>
            <i className="fa fa-times close-sidebar" />
          </button>
        </div>
        {isLoading ? (
          <Loading />
        ) : error ? (
          <div>There was an error</div>
        ) : (
          categories!.map((category) => (
            <div
              key={category}
              onClick={() => handleCategoryClick(category)}
              className="category-click"
            >
              {category}
            </div>
          ))
        )}
      </div>
    </nav>
  );
};

export default Navbar;

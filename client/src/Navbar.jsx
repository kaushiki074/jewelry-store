import { Link } from "react-router-dom";

import {
  Menu,
  MapPin,
  Store,
  Search,
  Heart,
  ShoppingBag
} from "lucide-react";

import "./Navbar.css";

function Navbar({
  isLoggedIn,
  handleLogout,
  cart,
  setSearch
}) {

  const cartCount = cart
    ? cart.reduce(
      (total, item) =>
        total + Number(item.quantity),
      0
    )
    : 0;
    
  const isAdmin = (() => {

    const token = localStorage.getItem("token");

    if (!token) {
      return false;
    }

    try {

      const payload = JSON.parse(
        atob(token.split(".")[1])
      );

      return payload.role === "admin";

    } catch (error) {

      return false;

    }

  })();


  return (
    <nav className="navbar">

      <div className="navbar-top">

        <div className="logo">

          <Link to="/">

            <span className="logo-main">
              JEWELRY
            </span>

            <span className="logo-sub">
              STORE
            </span>

          </Link>

        </div>

        <div className="nav-actions">
          <Link
            to="/"
            className="nav-icon-link"
            aria-label="Store"
          >
            <Store />
          </Link>

          <button
            type="button"
            className="nav-icon-link"
            aria-label="Search"
          >
            <Search />
          </button>

          <button
            type="button"
            className="nav-icon-link wishlist-link"
            aria-label="Wishlist"
          >

            <Heart />

            <span className="icon-count">
              0
            </span>

          </button>

          <Link
            to="/cart"
            className="nav-icon-link cart-link"
            aria-label="Cart"
          >

            <ShoppingBag />

            <span className="icon-count">
              {cartCount}
            </span>

          </Link>
          
          {isAdmin && (

            <Link to="/admin">
              Admin
              <button>Logout</button>
            </Link>
          )}

          {isLoggedIn ? (

            <button
              type="button"
              className="logout-button"
              onClick={handleLogout}
            >
              Logout
            </button>

          ) : (

            <div className="account-links">

              <Link to="/login">
                Login
              </Link>

              <Link to="/signup">
                Sign Up
              </Link>

            </div>

          )}

        </div>

      </div>

      <div className="navbar-search">

        <input
          type="text"
          placeholder="Search jewelry..."
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <Search className="search-icon" />

      </div>

    </nav>
  );
}

export default Navbar;
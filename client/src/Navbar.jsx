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

  return (
    <nav className="navbar">

      {/* =====================
          TOP ROW
      ===================== */}

      <div className="navbar-top">

      


        {/* LOGO */}
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


        {/* RIGHT ICONS */}
        <div className="nav-actions">

          {/* STORE */}
          <Link
            to="/"
            className="nav-icon-link"
          >
            <Store />
          </Link>


          {/* SEARCH */}
          <button
            type="button"
            className="nav-icon-link"
            aria-label="Search"
          >
            <Search />
          </button>


          {/* WISHLIST */}
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


          {/* CART */}
          <Link
            to="/cart"
            className="nav-icon-link cart-link"
          >
            <ShoppingBag />

            <span className="icon-count">
              {cartCount}
            </span>
          </Link>


          {/* LOGIN / LOGOUT */}
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

      {/* =====================
          SEARCH BAR
      ===================== */}

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
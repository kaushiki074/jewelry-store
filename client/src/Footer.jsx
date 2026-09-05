import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-top">

        <div className="footer-brand">
          <h2>JEWELRY</h2>
          <span>STORE</span>
          <p>
            Timeless pieces, crafted to make
            every moment sparkle.
          </p>
        </div>


        <div className="footer-column">
          <h3>Shop</h3>

          <Link to="/">Home</Link>
          <a href="#categories">Categories</a>
          <a href="#products">Collections</a>
          <a href="#cart">Cart</a>
        </div>


        <div className="footer-column">
          <h3>Account</h3>

          <Link to="/login">Login</Link>
          <Link to="/signup">Sign Up</Link>
        </div>


        <div className="footer-column">
          <h3>Contact</h3>

          <p>Email: hello@jewelrystore.com</p>
          <p>Phone: +91 98765 43210</p>
          <p>India</p>
        </div>

      </div>


      <div className="footer-bottom">

        <p>
          © 2026 Jewelry Store. All rights reserved.
        </p>

        <div className="footer-socials">
          <a href="#">Instagram</a>
          <a href="#">Pinterest</a>
        </div>
        
      </div>

    </footer>
  );
}

export default Footer;
import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import ProductCard from "./productCard";
import Cart from "./Cart";
import Login from "./Login";
import Signup from "./Signup";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);

  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setCart([]);
    navigate("/login");
  };
  
  useEffect(() => {
    fetch("http://localhost:3000/products")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => {
        console.log(error);
      });

    fetch("http://localhost:3000/categories")
      .then((response) => response.json())
      .then((data) => {
        setCategories(data);
      })
      .catch((error) => {
        console.log(error);
      });

    const token = localStorage.getItem("token");

    if (token) {
      fetch("http://localhost:3000/cart", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then((response) => response.json())
        .then((data) => {
          setCart(data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

  // =========================
  // ADD TO CART
  // =========================

  const addToCart = async (product) => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:3000/cart",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            product_id: product.id,
            quantity: 1
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.log(data);
        return;
      }

      setCart((currentCart) => {
        const existingProduct = currentCart.find(
          (item) => item.product_id === product.id
        );

        if (existingProduct) {
          return currentCart.map((item) =>
            item.product_id === product.id
              ? {
                  ...item,
                  quantity: item.quantity + 1
                }
              : item
          );
        }

        return [
          ...currentCart,
          {
            ...product,
            product_id: product.id,
            quantity: 1
          }
        ];
      });

      console.log("Added to cart:", data);
    } catch (error) {
      console.log("Error adding to cart:", error);
    }
  };

  // =========================
  // INCREASE QUANTITY
  // =========================

  const increaseQuantity = async (productId) => {
    try {
      const token = localStorage.getItem("token");

      const item = cart.find(
        (item) => item.product_id === productId
      );

      if (!item) {
        return;
      }

      const response = await fetch(
        `http://localhost:3000/cart/${productId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            quantity: item.quantity + 1
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.log(data);
        return;
      }

      setCart((currentCart) =>
        currentCart.map((item) =>
          item.product_id === productId
            ? {
                ...item,
                quantity: item.quantity + 1
              }
            : item
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  // =========================
  // DECREASE QUANTITY
  // =========================

  const decreaseQuantity = async (productId) => {
    const item = cart.find(
      (item) => item.product_id === productId
    );

    if (!item || item.quantity <= 1) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:3000/cart/${productId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            quantity: item.quantity - 1
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.log(data);
        return;
      }

      setCart((currentCart) =>
        currentCart.map((item) =>
          item.product_id === productId
            ? {
                ...item,
                quantity: item.quantity - 1
              }
            : item
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  // =========================
  // REMOVE FROM CART
  // =========================

  const removeFromCart = async (productId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:3000/cart/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.log(data);
        return;
      }

      setCart((currentCart) =>
        currentCart.filter(
          (item) => item.product_id !== productId
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  // =========================
  // TOTAL
  // =========================

  const total = cart.reduce(
    (sum, product) =>
      sum + Number(product.price) * product.quantity,
    0
  );

  // =========================
  // HOME PAGE
  // =========================

  function Home() {
    return (
      <div>
        <h1>Jewelry Store</h1>

        <div className="categories">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() =>
                setSelectedCategory(category.id)
              }
            >
              {category.name}
            </button>
          ))}
        </div>

        <div
          className="products"
          id="products"
        >
          {products
            .filter(
              (product) =>
                selectedCategory === null ||
                product.category_id === selectedCategory
            )
            .filter((product) =>
              product.name
                .toLowerCase()
                .includes(search.toLowerCase())
            )
            .map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                addToCart={addToCart}
              />
            ))}
        </div>
      </div>
    );
  }

  // =========================
  // CART PAGE
  // =========================

  function CartPage() {
    return (
      <Cart
        cart={cart}
        increaseQuantity={increaseQuantity}
        decreaseQuantity={decreaseQuantity}
        removeFromCart={removeFromCart}
        total={total}
      />
    );
  }

  // =========================
  // MAIN APP
  // =========================

  return (
    <div>
      <Navbar
        isLoggedIn={isLoggedIn}
        handleLogout={handleLogout}
        cart={cart}
        setSearch={setSearch}
      />

      <Routes>
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        <Route
          path="/cart"
          element={<CartPage />}
        />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;
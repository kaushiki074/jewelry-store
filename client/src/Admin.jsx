import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Admin.css";

function Admin() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [categories, setCategories] = useState([]);

  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));

      if (payload.role !== "admin") {
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      navigate("/login");
    }
  }, [navigate, token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const fetchProducts = () => {
    fetch("http://localhost:3000/products")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchCategories = () => {
    fetch("http://localhost:3000/categories")
      .then((response) => response.json())
      .then((data) => {
        setCategories(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();

    setMessage("");

    try {
      const response = await fetch(
        "http://localhost:3000/products",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            name: name,
            price: Number(price),
            description: description,
            image: image,
            category_id: Number(categoryId)
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Failed to add product");
        return;
      }

      setMessage("Product added successfully!");

      setName("");
      setPrice("");
      setDescription("");
      setImage("");
      setCategoryId("");

      fetchProducts();
    } catch (error) {
      console.log(error);
      setMessage("Something went wrong");
    }
  };

  const handleDelete = async (productId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/products/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Failed to delete product");
        return;
      }

      setMessage("Product deleted successfully!");

      fetchProducts();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="admin-page">

      <div className="admin-header">

        <div>
          <h1>Admin Panel</h1>
          <p>Manage your jewelry products</p>
        </div>

        <div className="admin-header-buttons">

          <button
            onClick={() => navigate("/")}
            className="back-button"
          >
            Back to Store
          </button>

          <button
            onClick={handleLogout}
            className="logout-button"
          >
            Logout
          </button>

        </div>

      </div>

      <section className="admin-section">

        <h2>Add New Product</h2>

        <form
          className="product-form"
          onSubmit={handleAddProduct}
        >

          <input
            type="text"
            placeholder="Product name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />

          <textarea
            placeholder="Product description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Image file name"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            required
          />

          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
          >
            <option value="">
              Select category
            </option>

            {categories.map((category) => (
              <option
                key={category.id}
                value={category.id}
              >
                {category.name}
              </option>
            ))}
          </select>

          <button type="submit">
            Add Product
          </button>

        </form>

        {message && (
          <p className="admin-message">
            {message}
          </p>
        )}

      </section>

      <section className="admin-section">

        <h2>Existing Products</h2>

        <div className="admin-products">

          {products.map((product) => (

            <div
              className="admin-product"
              key={product.id}
            >

              <img
                src={`http://localhost:3000/images/${product.image_url}`}
                alt={product.name}
              />

              <div className="admin-product-info">

                <h3>{product.name}</h3>

                <p>
                  ₹{Number(product.price).toFixed(2)}
                </p>

                <p>
                  {product.description}
                </p>

              </div>

              <button
                className="delete-button"
                onClick={() => handleDelete(product.id)}
              >
                Delete
              </button>

            </div>

          ))}

        </div>

      </section>

    </div>
  );
}

export default Admin;
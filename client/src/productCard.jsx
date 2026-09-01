import { useState } from "react";
import { Heart } from "lucide-react";

function ProductCard({ product, addToCart }) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  return (
    <div className="product-card">

      <img
        src={`http://localhost:3000/images/${product.image_url}`}
        alt={product.name}
      />

      <h2>{product.name}</h2>

      <p>₹{product.price}</p>

      <p>{product.description}</p>

      <div className="product-actions">

        <button
          type="button"
          className={`product-heart ${
            isWishlisted ? "active" : ""
          }`}
          onClick={() => setIsWishlisted(!isWishlisted)}
          aria-label="Add to wishlist"
        >
          <Heart />
        </button>

        <button
          className="add-to-cart-button"
          onClick={() => addToCart(product)}
        >
          Add to Cart
        </button>

      </div>

    </div>
  );
}

export default ProductCard;
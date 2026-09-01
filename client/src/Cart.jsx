import { Link } from "react-router-dom";
import "./Cart.css";

function Cart({
  cart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  total
}) {
  return (
    <div className="cart-page">

      {/* PAGE HEADER */}

      <div className="cart-header">
        <h1>Your Cart</h1>

        <Link to="/" className="continue-shopping">
          ← Continue Shopping
        </Link>
      </div>


      {/* EMPTY CART */}

      {cart.length === 0 ? (

        <div className="empty-cart">

          <h2>Your cart is empty</h2>

          <p>
            Looks like you haven't added anything yet.
          </p>

          <Link to="/" className="shop-button">
            Start Shopping
          </Link>

        </div>

      ) : (

        <div className="cart-content">

          {/* CART ITEMS */}

          <div className="cart-items">

            {cart.map((product) => (

              <div
                className="cart-item"
                key={product.product_id}
              >

                {/* PRODUCT IMAGE */}

                <img
                  src={`http://localhost:3000/images/${product.image_url}`}
                  alt={product.name}
                  className="cart-product-image"
                />


                {/* PRODUCT DETAILS */}

                <div className="cart-product-details">

                  <h2>
                    {product.name}
                  </h2>

                  <p className="cart-price">
                    ₹{product.price}
                  </p>


                  {/* QUANTITY */}

                  <div className="quantity-controls">

                    <button
                      type="button"
                      onClick={() =>
                        decreaseQuantity(
                          product.product_id
                        )
                      }
                    >
                      −
                    </button>

                    <span>
                      {product.quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        increaseQuantity(
                          product.product_id
                        )
                      }
                    >
                      +
                    </button>

                  </div>


                  {/* REMOVE */}

                  <button
                    type="button"
                    className="remove-button"
                    onClick={() =>
                      removeFromCart(
                        product.product_id
                      )
                    }
                  >
                    Remove
                  </button>

                </div>


                {/* ITEM TOTAL */}

                <div className="item-total">

                  ₹
                  {Number(product.price) *
                    product.quantity}

                </div>

              </div>

            ))}

          </div>


          {/* ORDER SUMMARY */}

          <div className="cart-summary">

            <h2>
              Order Summary
            </h2>

            <div className="summary-row">

              <span>
                Items
              </span>

              <span>
                {cart.reduce(
                  (sum, item) =>
                    sum + Number(item.quantity),
                  0
                )}
              </span>

            </div>

            <div className="summary-row">

              <span>
                Subtotal
              </span>

              <span>
                ₹{total}
              </span>

            </div>

            <div className="summary-row">

              <span>
                Shipping
              </span>

              <span>
                Free
              </span>

            </div>

            <hr />

            <div className="summary-total">

              <span>
                Total
              </span>

              <span>
                ₹{total}
              </span>

            </div>

            <button
              type="button"
              className="checkout-button"
              onClick={() =>
                alert("Checkout coming soon!")
              }
            >
              Proceed to Checkout
            </button>

          </div>

        </div>

      )}

    </div>
  );
}

export default Cart;
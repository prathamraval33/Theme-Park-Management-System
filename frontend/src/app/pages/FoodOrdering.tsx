import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import "../../styles/food.css";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

interface FoodItem {
  _id: string;
  food_name: string;
  price: number;
  image: string;
  category: string;
}

type CartItem = {
  _id: string;
  food_name: string;
  price: number;
  quantity: number;
}

export function FoodOrdering() {

  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [category, setCategory] = useState("All");
  const [qrCode, setQrCode] = useState("");

  useEffect(() => {

    const fetchFoods = async () => {

      try {

        const res = await axios.get(
          "http://localhost:5000/api/foods"
        );

        setFoods(res.data);

      } catch (error) {
        console.error(error);
      }

    };

    fetchFoods();

  }, []);

  /* CART */

  const addToCart = (food: FoodItem) => {

    const exist = cart.find(i => i._id === food._id);

    if (exist) {

      setCart(
        cart.map(i =>
          i._id === food._id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      );

    } else {

      setCart([
        ...cart,
        {
          _id: food._id,
          food_name: food.food_name,
          price: food.price,
          quantity: 1
        }
      ]);

    }

  };

  const increaseQty = (id: string) => {
    setCart(cart.map(i =>
      i._id === id
        ? { ...i, quantity: i.quantity + 1 }
        : i
    ));
  };

  const decreaseQty = (id: string) => {
    setCart(
      cart
        .map(i =>
          i._id === id
            ? { ...i, quantity: i.quantity - 1 }
            : i
        )
        .filter(i => i.quantity > 0)
    );
  };

  const removeItem = (id: string) => {
    setCart(cart.filter(i => i._id !== id));
  };

  const total = cart.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  /* FILTER */

  const filteredFoods = foods.filter(food =>
    category === "All" || food.category === category
  );

  /* ORDER */

  const placeOrder = async () => {

    const userData = localStorage.getItem("user");

    if (!userData) {
       Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "Please login first"
      });
      return;
    }

    const user = JSON.parse(userData);

    try {

      const res = await axios.post(
        "http://localhost:5000/api/foodorders/create",
        {
          email: user.email,
          items: cart,
          total_amount: total
        }
      );

      setQrCode(res.data.qr_code);
      setCart([]);
toast.success("🎉Order placed successfully!");
     

    } catch {

       Swal.fire({
        icon: "warning",
        title: "order failed",
        text: "Please try again"
      });

    }

  };

  return (

    <div className="food-page">

      <h1 className="food-title">🍔 Food & Drinks</h1>

      {/* CATEGORY FILTER */}

      <div className="category-tabs">

        {[
          "All",
          "Fast-Food",
          "Beverages",
          "Snacks",
          "Deserts"
        ].map(cat => (

          <motion.button
            key={cat}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            className={category === cat ? "active" : ""}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </motion.button>

        ))}

      </div>

      <div className="food-layout">

        {/* FOOD GRID */}

        <div className="food-grid">

          <AnimatePresence>

            {filteredFoods.map(food => (

              <motion.div
                key={food._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
                className="food-card"
              >

                <div className="image-wrapper">

                  <img
                    src={food.image}
                    alt={food.food_name}
                  />

                </div>

                <div className="food-content">

                  <h3>{food.food_name}</h3>

                  <p className="price">
                    ₹{food.price}
                  </p>

                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    className="add-btn"
                    onClick={() => addToCart(food)}
                  >
                    Add to Cart
                  </motion.button>

                </div>

              </motion.div>

            ))}

          </AnimatePresence>

        </div>

        {/* CART */}

        <div className="cart-panel">

          <h2>🛒 Order Summary</h2>

          {cart.length === 0 ? (
            <p className="empty">
              Cart is empty
            </p>
          ) : (

            cart.map(item => (

              <div key={item._id} className="cart-item">

                <div className="cart-row">

                  <span>{item.food_name}</span>

                  <button
                    className="remove"
                    onClick={() => removeItem(item._id)}
                  >
                    ✕
                  </button>

                </div>

                <div className="cart-controls">

                  <div>

                    <button onClick={() => decreaseQty(item._id)}>
                      -
                    </button>

                    <span>{item.quantity}</span>

                    <button onClick={() => increaseQty(item._id)}>
                      +
                    </button>

                  </div>

                  <span>
                    ₹{item.price * item.quantity}
                  </span>

                </div>

              </div>

            ))

          )}

          <div className="cart-total">

            <span>Total</span>
            <span>₹{total}</span>

          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            className="checkout-btn"
            onClick={placeOrder}
          >
            Place Order
          </motion.button>
{/*  {qrCode && (

            <div className="qr-section">

              <h3>Receipt</h3>

              <img src={qrCode} />

            </div>

          )}*/}
         

        </div>

      </div>

    </div>

  );

}
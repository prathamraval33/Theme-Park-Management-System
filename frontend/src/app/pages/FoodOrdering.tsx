import { useEffect, useState } from "react";
import axios from "axios";

type FoodItem = {
  _id: string;
  food_name: string;
  price: number;
  image: string;
};

type CartItem = {
  _id: string;
  food_name: string;
  price: number;
  quantity: number;
};

export function FoodOrdering() {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/foods");
        setFoods(res.data);
      } catch (error) {
        console.error("Error fetching foods:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, []);

  const addToCart = (food: FoodItem) => {
    const existing = cart.find(item => item._id === food._id);

    if (existing) {
      setCart(cart.map(item =>
        item._id === food._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
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
    setCart(cart.map(item =>
      item._id === id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    ));
  };

  const decreaseQty = (id: string) => {
    setCart(cart.map(item =>
      item._id === id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    ));
  };

  const removeItem = (id: string) => {
    setCart(cart.filter(item => item._id !== id));
  };

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div style={{
      padding: "50px",
      fontFamily: "Poppins, sans-serif",
      background: "#f8f9fa",
      minHeight: "100vh"
    }}>
      <h1 style={{
        marginBottom: "40px",
        fontSize: "32px",
        fontWeight: "600"
      }}>
        🍔 Food Ordering
      </h1>

      <div style={{
        display: "grid",
        gridTemplateColumns: "2fr 1fr",
        gap: "40px"
      }}>

        {/* MENU */}
        <div>
          {loading ? (
            <p>Loading foods...</p>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
              gap: "25px"
            }}>
              {foods.map(food => (
                <div
                  key={food._id}
                  style={{
                    background: "#fff",
                    borderRadius: "12px",
                    overflow: "hidden",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
                    transition: "all 0.3s ease",
                    cursor: "pointer"
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "translateY(-8px)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "translateY(0)")
                  }
                >
                  
                  <img
                    src={`/assets/${food.image}`}
                    alt={food.food_name}
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover"
                    }}
                  />

                  <div style={{ padding: "18px" }}>
                    <h3 style={{ marginBottom: "10px" }}>
                      {food.food_name}
                    </h3>

                    <p style={{
                      fontWeight: "600",
                      color: "#ff6b35",
                      marginBottom: "15px"
                    }}>
                      ₹{food.price}
                    </p>

                    <button
                      onClick={() => addToCart(food)}
                      style={{
                        width: "100%",
                        padding: "10px",
                        background: "linear-gradient(45deg, #ff6b35, #ff8e53)",
                        border: "none",
                        borderRadius: "8px",
                        color: "#fff",
                        fontWeight: "500",
                        cursor: "pointer",
                        transition: "0.3s"
                      }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CART */}
        <div>
          <div style={{
            background: "#fff",
            padding: "25px",
            borderRadius: "12px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.08)"
          }}>
            <h2 style={{ marginBottom: "20px" }}>
              🛒 Order Summary
            </h2>

            {cart.length === 0 ? (
              <p style={{ color: "#888" }}>
                Your cart is empty.
              </p>
            ) : (
              <>
                {cart.map(item => (
                  <div key={item._id} style={{
                    marginBottom: "18px",
                    borderBottom: "1px solid #eee",
                    paddingBottom: "10px"
                  }}>
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "8px"
                    }}>
                      <strong>{item.food_name}</strong>
                      <button
                        onClick={() => removeItem(item._id)}
                        style={{
                          background: "transparent",
                          border: "none",
                          color: "red",
                          cursor: "pointer"
                        }}
                      >
                        ✕
                      </button>
                    </div>

                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}>
                      <div>
                        <button onClick={() => decreaseQty(item._id)}>-</button>
                        <span style={{ margin: "0 10px" }}>
                          {item.quantity}
                        </span>
                        <button onClick={() => increaseQty(item._id)}>+</button>
                      </div>

                      <span>
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  </div>
                ))}

                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "20px",
                  fontWeight: "600",
                  fontSize: "18px"
                }}>
                  <span>Total</span>
                  <span>₹{totalAmount}</span>
                </div>

                <button
                  onClick={() => {
                    alert("Order placed successfully!");
                    setCart([]);
                  }}
                  style={{
                    width: "100%",
                    marginTop: "20px",
                    padding: "12px",
                    background: "linear-gradient(45deg, #007bff, #00c6ff)",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                    fontWeight: "500",
                    cursor: "pointer"
                  }}
                >
                  Place Order
                </button>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
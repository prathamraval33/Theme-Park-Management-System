import { useEffect, useState } from "react";
import "../../styles/banner.css";

const images = [
  "https://images.unsplash.com/photo-1761242606389-0a45db29fdee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  "https://images.unsplash.com/photo-1502139214982-d0ad755818d8?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1505852679233-d9fd70aff56d?auto=format&fit=crop&w=1400&q=80"
];

export function Banner() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000); // change every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="banner-container">
      <img src={images[current]} alt="Theme Park Banner" />
    </div>
  );
}

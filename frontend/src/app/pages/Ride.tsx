import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "../../styles/ride.css";

interface Ride {
  _id: string;
  ride_name: string;
  description: string;
  capacity: number;
  avgDuration: number;
  currentQueue: number;
  price: number;
  status: string;
  category: string;
  image: string;
  gif?: string;
}

export function Rides() {

  const [rides, setRides] = useState<Ride[]>([]);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchRides();
  }, []);

  const fetchRides = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/rides");
      setRides(res.data);
    } catch (err) {
      console.error("Ride fetch error", err);
    }
  };

  const waitTime = (ride: Ride) =>
    ride.avgDuration * ride.currentQueue;

  const waitColor = (wait: number) => {
    if (wait <= 10) return "queue-green";
    if (wait <= 25) return "queue-yellow";
    return "queue-red";
  };

  const filteredRides = rides.filter((ride) => {

    const matchCategory =
      category === "All" || ride.category === category;

    const matchSearch =
      ride.ride_name
        .toLowerCase()
        .includes(search.toLowerCase());

    return matchCategory && matchSearch;

  });

  return (

    <div className="rides-page">

      {/* HEADER */}

      <div className="rides-header">

        <h1>🎢 Theme Park Attractions</h1>

        <p>
          Discover thrilling adventures and unforgettable rides
        </p>

      </div>

      {/* SEARCH */}

      <div className="ride-search">

      

      </div>

      {/* CATEGORY FILTER */}

      <div className="ride-categories">

        {["All","Thrill","Water","Kids","Family"].map((cat)=>(
          <button
            key={cat}
            className={category===cat ? "active" : ""}
            onClick={()=>setCategory(cat)}
          >
            {cat}
          </button>
        ))}

      </div>

      {/* GRID */}

      <div className="rides-grid">

        {filteredRides.map((ride)=>{

          const wait = waitTime(ride);

          return (

            <motion.div
              key={ride._id}
              className="ride-card"
              whileHover={{ scale: 1.05 }}
              transition={{ type:"spring", stiffness:200 }}
            >

              {/* IMAGE */}

              <div className="ride-image">

                <img
                  src={ride.image}
                  alt={ride.ride_name}
                  className="ride-main-img"
                />

                {ride.gif && (

                  <img
                    src={ride.gif}
                    className="ride-gif"
                    alt="preview"
                  />

                )}

                <div className={`queue-badge ${waitColor(wait)}`}>
                  {wait} min wait
                </div>

              </div>

              {/* CONTENT */}

              <div className="ride-content">

                <h3>{ride.ride_name}</h3>

                <p className="ride-desc">
                  {ride.description}
                </p>

                <div className="ride-meta">

                  <span>
                    Capacity: {ride.capacity}
                  </span>

                 

                </div>

                <button
                  className="ride-book-btn"
                  onClick={()=>navigate(`/tickets/${ride._id}`)}
                >
                  🎟 Book Ride
                </button>

              </div>

            </motion.div>

          );

        })}

      </div>

    </div>

  );

}
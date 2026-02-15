import { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/queue.css";

interface Ride {
  _id: string;
  ride_name: string;
  currentQueue: number;
  avgDuration: number;
  status: string;
}

export function QueueStatus() {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRides();
  }, []);

  const fetchRides = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/rides");
      setRides(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    if (status === "Open") return "green";
    if (status === "Maintenance") return "orange";
    return "red";
  };

  return (
    <div className="queue-page">
      <div className="queue-container">
        <h2 className="queue-title">Live Queue Status</h2>

        {loading ? (
          <p>Loading queue data...</p>
        ) : (
          <table className="queue-table">
            <thead>
              <tr>
                <th>Ride Name</th>
                <th>Queue Length</th>
                <th>Estimated Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rides.map((ride) => {
                const waitTime =
                  ride.status === "Open"
                    ? ride.currentQueue * ride.avgDuration
                    : "N/A";

                return (
                  <tr key={ride._id}>
                    <td>{ride.ride_name}</td>
                    <td>{ride.currentQueue} people</td>
                    <td>
                      {typeof waitTime === "number"
                        ? `${waitTime} minutes`
                        : "N/A"}
                    </td>
                    <td>
                      <span
                        style={{
                          color: getStatusColor(ride.status),
                          fontWeight: "bold",
                        }}
                      >
                        {ride.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        <div className="queue-note">
          <strong>Note:</strong> Waiting times are approximate and updated dynamically.
        </div>
      </div>
    </div>
  );
}

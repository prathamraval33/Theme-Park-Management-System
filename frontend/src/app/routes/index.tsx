import { createBrowserRouter, Outlet } from "react-router-dom";
import { Navigation } from "../components/Navigation";
import { Footer } from "../components/Footer";
import { ProtectedRoute } from "../components/ProtectedRoute";

import { Home } from "../pages/Home";
import { Login } from "../pages/Login";
import { Signup } from "../pages/Signup";
import { TicketBooking } from "../pages/TicketBooking";
import { QueueStatus } from "../pages/QueueStatus";
import { FoodOrdering } from "../pages/FoodOrdering";
import { AdminDashboard } from "../pages/AdminDashboard";
import { Contact } from "../pages/Contact";
import { Rides } from "../pages/Ride";
import { RideStaffDashboard } from "../pages/ridestaff/RideStaffDashboard";

function MainLayout() {
  return (
    <>
      <Navigation />
      <Outlet />
      <Footer />
    </>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,      // 🔥 THIS is correct Home
        element: <Home />,
      },

      {
        path: "rides",
        element: <Rides />,
      },

      {
        path: "tickets",
        element: <TicketBooking />,
      },

      {
        path: "queue",
        element: <QueueStatus />,
      },

      {
        path: "food",
        element: <FoodOrdering />,
      },

      {
        path: "contact",
        element: <Contact />,
      },

      {
        path: "admin",
        element: (
          <ProtectedRoute allowedRoles={["Admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },

      {
        path: "ride-staff",
        element: (
          <ProtectedRoute allowedRoles={["RideStaff"]}>
            <RideStaffDashboard />
          </ProtectedRoute>
        ),
      },
    ],
  },

  {
    path: "/login",
    element: <Login />,
  },

  {
    path: "/signup",
    element: <Signup />,
  },
]);
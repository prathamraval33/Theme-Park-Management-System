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

// Layout
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
    element: <MainLayout />,
    children: [
      { path: "/", Component: Home },
      { path: "/rides", Component: Rides },
      { path: "/tickets", Component: TicketBooking },
      { path: "/queue", Component: QueueStatus },
      { path: "/food", Component: FoodOrdering },
      { path: "/contact", Component: Contact },

      // 🔐 Admin Only
      {
        path: "/admin",
        element: (
          <ProtectedRoute allowedRoles={["Admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },

      // 🔐 Ride Staff Only
      {
        path: "/ride-staff",
        element: (
          <ProtectedRoute allowedRoles={["RideStaff"]}>
            <RideStaffDashboard />
          </ProtectedRoute>
        ),
      },
    ],
  },

  // No layout pages
  { path: "/login", Component: Login },
  { path: "/signup", Component: Signup },
]);

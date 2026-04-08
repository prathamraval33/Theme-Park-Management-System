import { createBrowserRouter, Outlet } from "react-router-dom";
import { Navigation } from "../components/Navigation";
import { Footer } from "../components/Footer";
import { ProtectedRoute } from "../components/ProtectedRoute";

import { Home } from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import { TicketBooking } from "../pages/TicketBooking";
import { QueueStatus } from "../pages/QueueStatus";
import { FoodOrdering } from "../pages/FoodOrdering";
import { AdminLayout } from "../pages/admin/AdminLayout";
import { Contact } from "../pages/Contact";
import { Rides } from "../pages/Ride";
import { Profile } from "../pages/Profile";
import { Dashboard } from "../pages/admin/Dashboard";
import { RideManagement } from "../pages/admin/RideManagement";
import { FoodManagement } from "../pages/admin/FoodManagement";
import { UserManagement } from "../pages/admin/UserManagement";
import { RideStaffDashboard } from "../pages/ridestaff/RideStaffDashboard";
import VerifyOTP from "../pages/VerifyOTP";

/* ================= LAYOUT ================= */

function MainLayout() {
  return (
    <>
      <Navigation />
      <Outlet />
      <Footer />
    </>
  );
}

/* ================= ROUTES ================= */

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },

      { path: "rides", element: <Rides /> },
      { path: "tickets", element: <TicketBooking /> },
      { path: "tickets/:id", element: <TicketBooking /> },

      { path: "queue", element: <QueueStatus /> },
      { path: "food", element: <FoodOrdering /> },
      { path: "contact", element: <Contact /> },
      { path: "profile", element: <Profile /> },

     /* {
        path: "admin",
        element: (
          <ProtectedRoute allowedRoles={["Admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },*/

      {
  path: "/admin",
  element: <AdminLayout />,
  children: [
    { index: true, element: <Dashboard /> },
    { path: "rides", element: <RideManagement /> },
    { path: "food", element: <FoodManagement /> },
    { path: "users", element: <UserManagement /> }
  ]
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

  // 🔥 AUTH ROUTES (OUTSIDE LAYOUT)
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
  path: "/verify-otp",
  element: <VerifyOTP />
},

]);
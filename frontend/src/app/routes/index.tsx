import { createBrowserRouter, Outlet } from "react-router-dom";
import { Navigation } from "../components/Navigation";
import { Footer } from "../components/Footer";

import { Home } from "../pages/Home";
import { Login } from "../pages/Login";
import { Signup } from "../pages/Signup";
import { TicketBooking } from "../pages/TicketBooking";
import { QueueStatus } from "../pages/QueueStatus";
import { FoodOrdering } from "../pages/FoodOrdering";
import { AdminDashboard } from "../pages/AdminDashboard";
import { Contact } from "../pages/Contact";
import { Rides } from "../pages/Ride";

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
      { path: "/admin", Component: AdminDashboard },
      { path: "/contact", Component: Contact },
    ],
  },

  // 🔴 NO HEADER PAGES
  { path: "/login", Component: Login },
  { path: "/signup", Component: Signup },
]);

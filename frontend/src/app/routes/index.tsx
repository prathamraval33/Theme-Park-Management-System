import { createBrowserRouter } from "react-router-dom";
import { Home } from "../pages/Home";
import { Login } from "../pages/Login";
import { TicketBooking } from "../pages/TicketBooking";
import { QueueStatus } from "../pages/QueueStatus";
import { FoodOrdering } from "../pages/FoodOrdering";
import { AdminDashboard } from "../pages/AdminDashboard";
import { CustomerDashboard } from "../pages/CustomerDashboard";
import { StaffPanel } from "../pages/StaffPanel";
import { SuperAdmin } from "../pages/SuperAdmin";
import { Contact } from "../pages/Contact";
import { Signup } from "../pages/Signup";
import { Profile } from "../pages/Profile";
 import { Rides } from "../pages/Ride";
 import { RideStaffDashboard } from "../pages/ridestaff/RideStaffDashboard";


import { RideStaffManageRides } from "../pages/ridestaff/RideStaffManageRides";


export const router = createBrowserRouter([
  { path: "/", Component: Home },
  { path: "/login", Component: Login },
  { path: "/signup", Component: Signup },
  { path: "/tickets", Component: TicketBooking },
  { path: "/queue", Component: QueueStatus },
  { path: "/food", Component: FoodOrdering },
  { path: "/admin", Component: AdminDashboard },
  { path: "/customer", Component: CustomerDashboard },
  { path: "/staff", Component: StaffPanel },
  { path: "/superadmin", Component: SuperAdmin },
  { path: "/contact", Component: Contact },
  { path: "/profile", Component: Profile },
{ path: "/rides", Component: Rides },
{path: "/ride-staff",Component: RideStaffDashboard},




]);

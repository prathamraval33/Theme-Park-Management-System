import { createBrowserRouter } from 'react-router';
import { Home } from '@/app/pages/Home';
import { Login } from '@/app/pages/Login';
import { TicketBooking } from '@/app/pages/TicketBooking';
import { QueueStatus } from '@/app/pages/QueueStatus';
import { FoodOrdering } from '@/app/pages/FoodOrdering';
import { AdminDashboard } from '@/app/pages/AdminDashboard';
import { CustomerDashboard } from '@/app/pages/CustomerDashboard';
import { StaffPanel } from '@/app/pages/StaffPanel';
import { SuperAdmin } from '@/app/pages/SuperAdmin';
import { Contact } from '@/app/pages/Contact';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Home,
  },
  {
    path: '/login',
    Component: Login,
  },
  {
    path: '/tickets',
    Component: TicketBooking,
  },
  {
    path: '/queue',
    Component: QueueStatus,
  },
  {
    path: '/food',
    Component: FoodOrdering,
  },
  {
    path: '/admin',
    Component: AdminDashboard,
  },
  {
    path: '/customer',
    Component: CustomerDashboard,
  },
  {
    path: '/staff',
    Component: StaffPanel,
  },
  {
    path: '/superadmin',
    Component: SuperAdmin,
  },
  {
    path: '/contact',
    Component: Contact,
  },
]);

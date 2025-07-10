import { Home, Search, Ticket, User, Users, Route, IndianRupee, BarChart3 } from "lucide-react";
import { useLocation } from "wouter";

interface BottomNavProps {
  userRole: 'passenger' | 'driver' | 'admin';
}

export default function BottomNav({ userRole }: BottomNavProps) {
  const [location, setLocation] = useLocation();

  const getNavItems = () => {
    switch (userRole) {
      case 'passenger':
        return [
          { path: '/passenger-dashboard', icon: Home, label: 'Home' },
          { path: '/booking-flow', icon: Search, label: 'Book' },
          { path: '/my-trips', icon: Ticket, label: 'My Trips' },
          { path: '/profile', icon: User, label: 'Profile' },
        ];
      case 'driver':
        return [
          { path: '/driver-dashboard', icon: Home, label: 'Dashboard' },
          { path: '/passenger-list', icon: Users, label: 'Passengers' },
          { path: '/routes', icon: Route, label: 'Routes' },
          { path: '/earnings', icon: IndianRupee, label: 'Earnings' },
        ];
      case 'admin':
        return [
          { path: '/admin-dashboard', icon: Home, label: 'Dashboard' },
          { path: '/manage-routes', icon: Route, label: 'Routes' },
          { path: '/bookings', icon: Ticket, label: 'Bookings' },
          { path: '/reports', icon: BarChart3, label: 'Reports' },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="bottom-nav">
      {navItems.map((item) => (
        <button
          key={item.path}
          onClick={() => setLocation(item.path)}
          className={`nav-item ${location === item.path ? 'active' : ''}`}
        >
          <item.icon className="w-6 h-6" />
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
}

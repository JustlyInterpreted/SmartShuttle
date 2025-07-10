import { Plus } from "lucide-react";
import { useLocation } from "wouter";

export default function FloatingActionButton() {
  const [location, setLocation] = useLocation();

  const showFAB = location === '/passenger-dashboard';

  if (!showFAB) return null;

  return (
    <button
      onClick={() => setLocation('/booking-flow')}
      className="floating-btn ripple hover:scale-105 transition-transform"
    >
      <Plus className="w-6 h-6" />
    </button>
  );
}

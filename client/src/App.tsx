import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState, useEffect } from "react";
import NotFound from "@/pages/not-found";
import Splash from "@/pages/splash";
import RoleSelection from "@/pages/role-selection";
import PassengerDashboard from "@/pages/passenger-dashboard";
import BookingFlow from "@/pages/booking-flow";
import RideResults from "@/pages/ride-results";
import SeatSelection from "@/pages/seat-selection";
import PaymentFlow from "@/pages/payment-flow";
import TrackingView from "@/pages/tracking-view";
import DriverDashboard from "@/pages/driver-dashboard";
import PassengerList from "@/pages/passenger-list";
import QRScanner from "@/pages/qr-scanner";
import AdminDashboard from "@/pages/admin-dashboard";
import StatusBar from "@/components/ui/status-bar";
import FloatingActionButton from "@/components/ui/floating-action-button";

function Router() {
  const [showSplash, setShowSplash] = useState(true);
  const [userRole, setUserRole] = useState<'passenger' | 'driver' | 'admin' | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <Splash />;
  }

  return (
    <div className="min-h-screen bg-background">
      <StatusBar />
      <Switch>
        <Route path="/" component={() => userRole ? 
          (userRole === 'passenger' ? <PassengerDashboard /> : 
           userRole === 'driver' ? <DriverDashboard /> : 
           <AdminDashboard />) : 
          <RoleSelection onRoleSelect={setUserRole} />} />
        <Route path="/role-selection" component={() => <RoleSelection onRoleSelect={setUserRole} />} />
        <Route path="/passenger-dashboard" component={PassengerDashboard} />
        <Route path="/booking-flow" component={BookingFlow} />
        <Route path="/ride-results" component={RideResults} />
        <Route path="/seat-selection" component={SeatSelection} />
        <Route path="/payment-flow" component={PaymentFlow} />
        <Route path="/tracking-view" component={TrackingView} />
        <Route path="/driver-dashboard" component={DriverDashboard} />
        <Route path="/passenger-list" component={PassengerList} />
        <Route path="/qr-scanner" component={QRScanner} />
        <Route path="/admin-dashboard" component={AdminDashboard} />
        <Route component={NotFound} />
      </Switch>
      <FloatingActionButton />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

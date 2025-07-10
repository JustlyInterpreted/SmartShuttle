import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Users, QrCode, MapPin, AlertTriangle, Bell, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import AppBar from "@/components/ui/app-bar";
import BottomNav from "@/components/ui/bottom-nav";

export default function DriverDashboard() {
  const [, setLocation] = useLocation();

  const { data: currentRoute } = useQuery({
    queryKey: ['/api/schedules/1'], // Mock current route
  });

  const { data: dashboardStats } = useQuery({
    queryKey: ['/api/admin/dashboard'],
  });

  const todaySchedules = [
    {
      id: 1,
      route: "Ranchi → Bokaro",
      time: "10:30 AM - 12:45 PM",
      status: "current",
    },
    {
      id: 2,
      route: "Bokaro → Ranchi", 
      time: "2:00 PM - 4:15 PM",
      status: "next",
    },
    {
      id: 3,
      route: "Ranchi → Dhanbad",
      time: "6:00 PM - 9:30 PM", 
      status: "scheduled",
    },
  ];

  const newBookings = [
    {
      id: 1,
      passenger: "Priya Sharma",
      seat: "A3",
      pickup: "Namkum Junction",
      destination: "Bokaro",
      fare: 65,
      type: "live",
    },
    {
      id: 2,
      passenger: "Raj Kumar",
      seat: "B2", 
      pickup: "Ramgarh",
      destination: "Bokaro",
      fare: 45,
      type: "sms",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'current':
        return 'bg-success text-white';
      case 'next':
        return 'bg-warning text-white';
      case 'scheduled':
        return 'bg-gray-300 text-gray-600';
      default:
        return 'bg-gray-300 text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <AppBar 
        title="Driver Dashboard"
        actions={
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-success rounded-full"></div>
              <span className="text-sm text-primary-foreground">Online</span>
            </div>
            <Settings className="w-6 h-6 text-primary-foreground" />
          </div>
        }
      />

      <div className="p-4 space-y-4">
        {/* Current Route */}
        <Card className="elevation-1">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-800">Current Route</h3>
              <Badge className="bg-success text-white">Active</Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Route</span>
                <span className="text-gray-800 font-medium">Ranchi → Bokaro</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Departure</span>
                <span className="text-gray-800">10:30 AM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Vehicle</span>
                <span className="text-gray-800">RJ14 GH 5678</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Passengers</span>
                <span className="text-gray-800">8/20 booked</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="elevation-1">
          <CardContent className="p-4">
            <h3 className="font-medium text-gray-800 mb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <Button 
                onClick={() => setLocation('/passenger-list')}
                className="bg-primary text-white hover:bg-primary/90 flex flex-col items-center p-3 h-auto"
              >
                <Users className="w-6 h-6 mb-1" />
                <span className="text-sm">Passenger List</span>
              </Button>
              <Button 
                onClick={() => setLocation('/qr-scanner')}
                className="bg-secondary text-white hover:bg-secondary/90 flex flex-col items-center p-3 h-auto"
              >
                <QrCode className="w-6 h-6 mb-1" />
                <span className="text-sm">Scan QR</span>
              </Button>
              <Button 
                variant="outline"
                className="flex flex-col items-center p-3 h-auto text-success border-success hover:bg-success hover:text-white"
              >
                <MapPin className="w-6 h-6 mb-1" />
                <span className="text-sm">Update Status</span>
              </Button>
              <Button 
                variant="outline"
                className="flex flex-col items-center p-3 h-auto text-warning border-warning hover:bg-warning hover:text-white"
              >
                <AlertTriangle className="w-6 h-6 mb-1" />
                <span className="text-sm">Emergency</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* New Bookings */}
        <Card className="elevation-1">
          <CardContent className="p-4">
            <h3 className="font-medium text-gray-800 mb-3">New Bookings</h3>
            <div className="space-y-3">
              {newBookings.map((booking) => (
                <div key={booking.id} className={`p-3 rounded-lg ${booking.type === 'live' ? 'bg-blue-50' : 'bg-green-50'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium text-gray-800">Seat {booking.seat} - {booking.passenger}</p>
                      <p className="text-sm text-gray-600">{booking.pickup} → {booking.destination}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-primary font-medium">₹{booking.fare}</span>
                      <p className="text-sm text-gray-600">{booking.type === 'live' ? 'Live booking' : 'SMS booking'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Today's Schedule */}
        <Card className="elevation-1">
          <CardContent className="p-4">
            <h3 className="font-medium text-gray-800 mb-3">Today's Schedule</h3>
            <div className="space-y-3">
              {todaySchedules.map((schedule) => (
                <div key={schedule.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">{schedule.route}</p>
                    <p className="text-sm text-gray-600">{schedule.time}</p>
                  </div>
                  <Badge className={getStatusColor(schedule.status)}>
                    {schedule.status === 'current' ? 'Current' : 
                     schedule.status === 'next' ? 'Next' : 'Scheduled'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Earnings Summary */}
        <Card className="bg-gradient-to-r from-primary to-blue-600 text-white">
          <CardContent className="p-4">
            <h3 className="font-medium mb-3">Today's Earnings</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="opacity-90">Total Rides</span>
                <span className="font-medium">15</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-90">Passengers</span>
                <span className="font-medium">42</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-90">Earnings</span>
                <span className="font-medium text-xl">₹2,340</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNav userRole="driver" />
    </div>
  );
}

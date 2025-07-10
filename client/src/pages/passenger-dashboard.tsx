import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Bell, User, Search, QrCode, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLocation } from "wouter";
import AppBar from "@/components/ui/app-bar";
import BottomNav from "@/components/ui/bottom-nav";
import RouteCard from "@/components/ui/route-card";
import { SMS_BOOKING_FORMAT } from "@/lib/constants";

export default function PassengerDashboard() {
  const [, setLocation] = useLocation();

  const { data: routes, isLoading } = useQuery({
    queryKey: ['/api/routes'],
  });

  const handleQuickBook = () => {
    setLocation('/booking-flow');
  };

  const handleQRScan = () => {
    setLocation('/qr-scanner');
  };

  const handleTrackShuttle = () => {
    setLocation('/tracking-view');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <AppBar title="Ranchi" />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <AppBar 
        title="Ranchi"
        actions={
          <div className="flex items-center space-x-4">
            <Bell className="w-6 h-6 text-primary-foreground" />
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-primary-foreground" />
            </div>
          </div>
        }
      />

      <div className="p-4 space-y-6">
        {/* Quick Actions */}
        <Card className="elevation-1">
          <CardContent className="p-4">
            <h3 className="font-medium text-gray-800 mb-3">Quick Book</h3>
            <div className="grid grid-cols-2 gap-3">
              <Button 
                onClick={handleQuickBook}
                className="bg-primary text-white hover:bg-primary/90 flex flex-col items-center p-3 h-auto"
              >
                <Search className="w-6 h-6 mb-1" />
                <span className="text-sm">Find Rides</span>
              </Button>
              <Button 
                onClick={handleQRScan}
                variant="outline"
                className="flex flex-col items-center p-3 h-auto"
              >
                <QrCode className="w-6 h-6 mb-1" />
                <span className="text-sm">QR Scan</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Popular Routes */}
        <div>
          <h3 className="font-medium text-gray-800 mb-3">Popular Routes</h3>
          <div className="space-y-3">
            <div className="route-card">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium text-gray-800">Ranchi → Bokaro</h4>
                  <p className="text-sm text-gray-600">Next: 10:30 AM</p>
                </div>
                <span className="text-primary font-medium">₹85</span>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span><Clock className="w-4 h-4 inline mr-1" />2h 15m</span>
                <span><Users className="w-4 h-4 inline mr-1" />12 seats</span>
              </div>
            </div>

            <div className="route-card">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium text-gray-800">Ranchi → Dhanbad</h4>
                  <p className="text-sm text-gray-600">Next: 11:00 AM</p>
                </div>
                <span className="text-primary font-medium">₹120</span>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span><Clock className="w-4 h-4 inline mr-1" />3h 30m</span>
                <span><Users className="w-4 h-4 inline mr-1" />8 seats</span>
              </div>
            </div>

            <div className="route-card">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium text-gray-800">Ranchi → Hazaribagh</h4>
                  <p className="text-sm text-gray-600">Next: 12:00 PM</p>
                </div>
                <span className="text-primary font-medium">₹65</span>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span><Clock className="w-4 h-4 inline mr-1" />1h 45m</span>
                <span><Users className="w-4 h-4 inline mr-1" />15 seats</span>
              </div>
            </div>
          </div>
        </div>

        {/* Current Booking */}
        <Card className="bg-success text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">Current Trip</h3>
              <span className="text-sm bg-white bg-opacity-20 px-2 py-1 rounded">On Route</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Ranchi → Bokaro</span>
                <span>Seat A-12</span>
              </div>
              <div className="flex justify-between text-sm opacity-90">
                <span>Dep: 10:30 AM</span>
                <span>ETA: 12:45 PM</span>
              </div>
              <Button 
                onClick={handleTrackShuttle}
                className="bg-white text-success hover:bg-gray-100 w-full mt-3"
              >
                Track Shuttle
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* SMS Booking Guide */}
        <Card className="bg-orange-50">
          <CardContent className="p-4">
            <h3 className="font-medium text-gray-800 mb-2">SMS Booking</h3>
            <p className="text-sm text-gray-600 mb-3">Book offline by SMS when app isn't available</p>
            <div className="bg-white rounded-lg p-3 border border-orange-200">
              <p className="text-sm"><strong>Format:</strong> {SMS_BOOKING_FORMAT.format}</p>
              <p className="text-sm mt-1"><strong>Example:</strong> {SMS_BOOKING_FORMAT.example}</p>
              <p className="text-sm mt-1"><strong>Send to:</strong> {SMS_BOOKING_FORMAT.number}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNav userRole="passenger" />
    </div>
  );
}

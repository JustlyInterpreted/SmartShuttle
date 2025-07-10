import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Phone, Clock, Navigation, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLocation } from "wouter";
import AppBar from "@/components/ui/app-bar";
import { useWebSocket } from "@/hooks/use-websocket";
import { wsManager } from "@/lib/websocket";
import { WEBSOCKET_EVENTS, EMERGENCY_CONTACTS } from "@/lib/constants";
import type { ScheduleWithDetails } from "@shared/schema";

export default function TrackingView() {
  const [, setLocation] = useLocation();
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 23.3441,
    longitude: 85.3096,
  });
  const [schedule] = useState<ScheduleWithDetails>({
    id: 1,
    routeId: 1,
    vehicleId: 1,
    driverId: 1,
    departureTime: new Date(),
    arrivalTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
    availableSeats: 12,
    totalSeats: 20,
    status: "active",
    createdAt: new Date(),
    route: {
      id: 1,
      fromCityId: 1,
      toCityId: 2,
      name: "Ranchi to Bokaro",
      code: "RB01",
      distance: "85.00",
      estimatedDuration: 135,
      baseFare: "75.00",
      distanceFare: "10.00",
      isActive: true,
      createdAt: new Date(),
      fromCity: { id: 1, name: "Ranchi", code: "RAN", isActive: true, createdAt: new Date() },
      toCity: { id: 2, name: "Bokaro", code: "BOK", isActive: true, createdAt: new Date() },
    },
    vehicle: {
      id: 1,
      registrationNumber: "RJ14 GH 5678",
      model: "Setu Express",
      capacity: 20,
      amenities: ["AC", "WiFi", "USB Charging"],
      isActive: true,
      createdAt: new Date(),
    },
    driver: {
      id: 1,
      name: "Amit Singh",
      phone: "+919876543210",
      licenseNumber: "RJ1420230001",
      rating: "4.8",
      isActive: true,
      createdAt: new Date(),
    },
  });

  // Subscribe to tracking updates
  useWebSocket(WEBSOCKET_EVENTS.TRACKING_UPDATE, (data) => {
    if (data.scheduleId === schedule.id) {
      setCurrentLocation(data.location);
    }
  });

  useEffect(() => {
    // Subscribe to tracking for this schedule
    wsManager.subscribeToTracking(schedule.id);
  }, [schedule.id]);

  const { data: trackingHistory } = useQuery({
    queryKey: [`/api/tracking/${schedule.id}`],
    refetchInterval: 10000, // Refetch every 10 seconds
  });

  const journeyStops = [
    {
      name: "Ranchi Main Bus Stand",
      status: "completed",
      time: "10:30 AM",
      icon: "check",
    },
    {
      name: "Namkum Junction", 
      status: "current",
      time: "Now",
      icon: "current",
    },
    {
      name: "Ramgarh",
      status: "upcoming",
      time: "11:45 AM",
      icon: "upcoming",
    },
    {
      name: "Bokaro Steel City",
      status: "upcoming", 
      time: "12:45 PM",
      icon: "upcoming",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-success';
      case 'current':
        return 'text-primary';
      case 'upcoming':
        return 'text-gray-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return 'w-4 h-4 bg-success rounded-full';
      case 'current':
        return 'w-4 h-4 bg-primary rounded-full pulse';
      case 'upcoming':
        return 'w-4 h-4 bg-gray-300 rounded-full';
      default:
        return 'w-4 h-4 bg-gray-300 rounded-full';
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <AppBar title="Track Shuttle" showBack />

      <div className="p-4 space-y-4">
        {/* Live Status */}
        <Card className="bg-success text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">Live Status</h3>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-white rounded-full pulse"></div>
                <span className="text-sm">On Route</span>
              </div>
            </div>
            <div className="text-sm opacity-90">
              <p>Your shuttle is on the way</p>
              <p>Expected arrival: {new Date(schedule.arrivalTime).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
              })}</p>
            </div>
          </CardContent>
        </Card>

        {/* Map Placeholder */}
        <Card className="elevation-1">
          <CardContent className="p-4">
            <h3 className="font-medium text-gray-800 mb-3">Route Map</h3>
            <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-gray-400 mb-2 mx-auto" />
                <p className="text-gray-500">Live Map View</p>
                <p className="text-sm text-gray-400">Showing shuttle location</p>
              </div>
              {/* Simulated shuttle position */}
              <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center pulse">
                  <i className="fas fa-bus text-white text-sm"></i>
                </div>
              </div>
              {/* Route line */}
              <div className="absolute top-1/4 left-1/4 right-1/4 h-1 bg-primary opacity-50 rounded"></div>
            </div>
          </CardContent>
        </Card>

        {/* Journey Progress */}
        <Card className="elevation-1">
          <CardContent className="p-4">
            <h3 className="font-medium text-gray-800 mb-3">Journey Progress</h3>
            <div className="space-y-4">
              {journeyStops.map((stop, index) => (
                <div key={index}>
                  <div className="flex items-center space-x-3">
                    <div className={getStatusIcon(stop.status)}></div>
                    <div className="flex-1">
                      <p className={`font-medium ${getStatusColor(stop.status)}`}>{stop.name}</p>
                      <p className="text-sm text-gray-600">
                        {stop.status === 'completed' ? 'Departed: ' : 
                         stop.status === 'current' ? 'Current Location' : 'ETA: '}
                        {stop.time}
                      </p>
                    </div>
                    {stop.status === 'completed' && (
                      <i className="fas fa-check text-success"></i>
                    )}
                    {stop.status === 'current' && (
                      <span className="text-sm text-primary font-medium">Now</span>
                    )}
                    {stop.status === 'upcoming' && (
                      <span className="text-sm text-gray-500">Next</span>
                    )}
                  </div>
                  {index < journeyStops.length - 1 && (
                    <div className="ml-2 h-8 w-0.5 bg-gray-300"></div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Shuttle Info */}
        <Card className="elevation-1">
          <CardContent className="p-4">
            <h3 className="font-medium text-gray-800 mb-3">Shuttle Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Vehicle</span>
                <span className="text-gray-800">{schedule.vehicle.model} ({schedule.vehicle.registrationNumber})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Driver</span>
                <span className="text-gray-800">{schedule.driver.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Contact</span>
                <a href={`tel:${schedule.driver.phone}`} className="text-primary flex items-center">
                  <Phone className="w-4 h-4 mr-1" />
                  {schedule.driver.phone}
                </a>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Your Seat</span>
                <span className="text-gray-800">A1</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contact */}
        <Card className="bg-red-50">
          <CardContent className="p-4">
            <h3 className="font-medium text-gray-800 mb-2 flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
              Emergency Contact
            </h3>
            <p className="text-sm text-gray-600 mb-3">If you need immediate assistance</p>
            <Button 
              className="w-full bg-destructive text-white hover:bg-destructive/90"
              onClick={() => window.open(`tel:${EMERGENCY_CONTACTS[0].number}`)}
            >
              <Phone className="w-4 h-4 mr-2" />
              Call Emergency: {EMERGENCY_CONTACTS[0].number}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

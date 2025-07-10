import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { UserPlus, MapPin, MessageSquare, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import AppBar from "@/components/ui/app-bar";
import { useWebSocket } from "@/hooks/use-websocket";
import { WEBSOCKET_EVENTS } from "@/lib/constants";

interface PassengerBooking {
  id: number;
  passenger: {
    name: string;
    phone: string;
    initials: string;
    color: string;
  };
  seat: string;
  route: string;
  fare: number;
  status: 'boarded' | 'boarding' | 'waiting';
  bookingType: 'app' | 'sms' | 'walk-in';
  location?: {
    distance: string;
    status: string;
  };
}

export default function PassengerList() {
  const [, setLocation] = useLocation();
  const [passengers, setPassengers] = useState<PassengerBooking[]>([
    {
      id: 1,
      passenger: {
        name: "Rahul Kumar",
        phone: "+919876543210",
        initials: "RK",
        color: "bg-primary",
      },
      seat: "A1",
      route: "Main Bus Stand → Bokaro",
      fare: 85,
      status: "boarded",
      bookingType: "app",
    },
    {
      id: 2,
      passenger: {
        name: "Priya Sharma",
        phone: "+919876543211", 
        initials: "PS",
        color: "bg-secondary",
      },
      seat: "A3",
      route: "Namkum Junction → Bokaro",
      fare: 65,
      status: "boarding",
      bookingType: "app",
      location: {
        distance: "2.3 km",
        status: "from pickup point",
      },
    },
    {
      id: 3,
      passenger: {
        name: "Raj Kumar",
        phone: "+919876543212",
        initials: "RK", 
        color: "bg-success",
      },
      seat: "B2",
      route: "Ramgarh → Bokaro",
      fare: 45,
      status: "waiting",
      bookingType: "sms",
    },
    {
      id: 4,
      passenger: {
        name: "Anita Singh",
        phone: "+919876543213",
        initials: "AS",
        color: "bg-pink-500",
      },
      seat: "C1", 
      route: "Main Bus Stand → Ramgarh",
      fare: 35,
      status: "boarded",
      bookingType: "app",
    },
  ]);

  // Listen for new bookings
  useWebSocket(WEBSOCKET_EVENTS.NEW_BOOKING, (data) => {
    // Add new booking to the list
    console.log('New booking received:', data);
  });

  // Listen for passenger location updates
  useWebSocket(WEBSOCKET_EVENTS.PASSENGER_LOCATION, (data) => {
    setPassengers(prev => prev.map(p => 
      p.id === data.bookingId 
        ? { ...p, location: { distance: '1.2 km', status: 'from pickup point' } }
        : p
    ));
  });

  const { data: scheduleBookings, isLoading } = useQuery({
    queryKey: ['/api/schedules/1/bookings'], // Current schedule
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'boarded':
        return 'bg-success text-white';
      case 'boarding':
        return 'bg-warning text-white';
      case 'waiting':
        return 'bg-primary text-white';
      default:
        return 'bg-gray-300 text-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'boarded':
        return 'Boarded';
      case 'boarding':
        return 'Boarding';
      case 'waiting':
        return 'Waiting';
      default:
        return 'Unknown';
    }
  };

  const getBookingTypeColor = (type: string) => {
    switch (type) {
      case 'app':
        return 'bg-blue-50 border-blue-200';
      case 'sms':
        return 'bg-green-50 border-green-200';
      case 'walk-in':
        return 'bg-orange-50 border-orange-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <AppBar title="Passenger List" showBack />

      <div className="p-4 space-y-4">
        {/* Route Info */}
        <Card className="elevation-1">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium text-gray-800">Ranchi → Bokaro</h3>
                <p className="text-sm text-gray-600">Dec 15, 2024 • 10:30 AM</p>
              </div>
              <div className="text-right">
                <p className="text-primary font-medium">{passengers.length}/20</p>
                <p className="text-sm text-gray-600">Passengers</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Passenger List */}
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-3">
            {passengers.map((passenger) => (
              <Card key={passenger.id} className="elevation-1">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 ${passenger.passenger.color} rounded-full flex items-center justify-center`}>
                        <span className="text-white font-medium">{passenger.passenger.initials}</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">{passenger.passenger.name}</h4>
                        <p className="text-sm text-gray-600">{passenger.passenger.phone}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(passenger.status)}>
                        {passenger.seat}
                      </Badge>
                      <p className="text-xs text-gray-600 mt-1">{getStatusText(passenger.status)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">{passenger.route}</span>
                    <span className="text-primary font-medium">₹{passenger.fare}</span>
                  </div>

                  {passenger.location && (
                    <div className={`mt-2 p-2 rounded-lg ${getBookingTypeColor('app')}`}>
                      <p className="text-xs text-gray-600 flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        Live location: {passenger.location.distance} {passenger.location.status}
                      </p>
                    </div>
                  )}

                  {passenger.bookingType === 'sms' && (
                    <div className={`mt-2 p-2 rounded-lg ${getBookingTypeColor('sms')}`}>
                      <p className="text-xs text-gray-600 flex items-center">
                        <MessageSquare className="w-3 h-3 mr-1" />
                        SMS Booking: SETU RB01 15DEC 1
                      </p>
                    </div>
                  )}

                  <div className="flex space-x-2 mt-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(`tel:${passenger.passenger.phone}`)}
                      className="flex-1"
                    >
                      <Phone className="w-4 h-4 mr-1" />
                      Call
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                    >
                      <MapPin className="w-4 h-4 mr-1" />
                      Locate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Add Walk-in Passenger */}
        <Button 
          onClick={() => setLocation('/add-passenger')}
          className="w-full bg-primary text-white hover:bg-primary/90 py-4 font-medium text-lg elevation-2"
        >
          <UserPlus className="w-5 h-5 mr-2" />
          Add Walk-in Passenger
        </Button>
      </div>
    </div>
  );
}

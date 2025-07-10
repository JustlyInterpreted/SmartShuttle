import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLocation } from "wouter";
import AppBar from "@/components/ui/app-bar";
import SeatGrid from "@/components/ui/seat-grid";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { ScheduleWithDetails, SeatAvailability } from "@shared/schema";

export default function SeatSelection() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [schedule, setSchedule] = useState<ScheduleWithDetails | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('selectedSchedule');
    if (stored) {
      setSchedule(JSON.parse(stored));
    } else {
      setLocation('/ride-results');
    }
  }, [setLocation]);

  const { data: seats, isLoading } = useQuery({
    queryKey: [`/api/schedules/${schedule?.id}/seats`],
    enabled: !!schedule,
  });

  const handleSeatSelect = (seatNumber: string) => {
    setSelectedSeats(prev => {
      if (prev.includes(seatNumber)) {
        return prev.filter(seat => seat !== seatNumber);
      } else if (prev.length < 1) { // Limit to 1 seat for simplicity
        return [...prev, seatNumber];
      }
      return prev;
    });
  };

  const calculateTotal = () => {
    if (!schedule) return 0;
    const baseFare = parseFloat(schedule.route.baseFare);
    const distanceFare = parseFloat(schedule.route.distanceFare);
    const serviceFee = 5; // Fixed service fee
    return baseFare + distanceFare + serviceFee;
  };

  const handleProceed = () => {
    if (selectedSeats.length === 0) {
      toast({
        title: "No seats selected",
        description: "Please select at least one seat to continue",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem('selectedSeats', JSON.stringify(selectedSeats));
    localStorage.setItem('totalFare', JSON.stringify(calculateTotal()));
    setLocation('/payment-flow');
  };

  if (!schedule) {
    return (
      <div className="min-h-screen bg-background">
        <AppBar title="Select Seats" showBack />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <AppBar title="Select Seats" showBack />

      <div className="p-4 space-y-4">
        {/* Shuttle Info */}
        <Card className="elevation-1">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <i className="fas fa-bus text-white"></i>
              </div>
              <div>
                <h4 className="font-medium text-gray-800">{schedule.vehicle.model}</h4>
                <p className="text-sm text-gray-600">
                  {schedule.vehicle.registrationNumber} • {new Date(schedule.departureTime).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                  })}
                </p>
              </div>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>{schedule.route.fromCity.name} → {schedule.route.toCity.name}</span>
              <span>Available: {schedule.availableSeats}/{schedule.totalSeats} seats</span>
            </div>
          </CardContent>
        </Card>

        {/* Seat Selection */}
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <SeatGrid
            seats={seats || []}
            selectedSeats={selectedSeats}
            onSeatSelect={handleSeatSelect}
            maxSeats={1}
          />
        )}

        {/* Booking Summary */}
        <Card className="elevation-1">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium text-gray-800">Booking Summary</h3>
              <span className="text-sm text-gray-600">
                {selectedSeats.length === 0 ? 'No seats selected' : `Selected: ${selectedSeats.join(', ')}`}
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Base Fare (1 Adult)</span>
                <span className="text-gray-800">₹{schedule.route.baseFare}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Distance Charge</span>
                <span className="text-gray-800">₹{schedule.route.distanceFare}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Service Fee</span>
                <span className="text-gray-800">₹5</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between font-medium">
                <span className="text-gray-800">Total</span>
                <span className="text-primary text-lg">₹{calculateTotal()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Proceed Button */}
        <Button
          onClick={handleProceed}
          disabled={selectedSeats.length === 0}
          className={`w-full py-4 font-medium text-lg elevation-2 ${
            selectedSeats.length === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-primary text-white hover:bg-primary/90'
          }`}
        >
          {selectedSeats.length === 0 ? 'Select a seat to proceed' : 'Proceed to Payment'}
        </Button>
      </div>
    </div>
  );
}

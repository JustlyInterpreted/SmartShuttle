import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { CreditCard, Smartphone, Wallet, Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useLocation } from "wouter";
import AppBar from "@/components/ui/app-bar";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { ScheduleWithDetails } from "@shared/schema";
import type { PaymentDetails } from "@/types";

export default function PaymentFlow() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [schedule, setSchedule] = useState<ScheduleWithDetails | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [totalFare, setTotalFare] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [passengerData, setPassengerData] = useState({
    name: '',
    phone: '',
    age: '',
  });
  const [termsAccepted, setTermsAccepted] = useState(false);

  useEffect(() => {
    const storedSchedule = localStorage.getItem('selectedSchedule');
    const storedSeats = localStorage.getItem('selectedSeats');
    const storedFare = localStorage.getItem('totalFare');

    if (storedSchedule && storedSeats && storedFare) {
      setSchedule(JSON.parse(storedSchedule));
      setSelectedSeats(JSON.parse(storedSeats));
      setTotalFare(JSON.parse(storedFare));
    } else {
      setLocation('/seat-selection');
    }
  }, [setLocation]);

  const createPassengerMutation = useMutation({
    mutationFn: async (passengerData: any) => {
      const response = await apiRequest('POST', '/api/passengers', passengerData);
      return response.json();
    },
  });

  const createBookingMutation = useMutation({
    mutationFn: async (bookingData: any) => {
      const response = await apiRequest('POST', '/api/bookings', bookingData);
      return response.json();
    },
  });

  const updatePaymentMutation = useMutation({
    mutationFn: async ({ bookingId, paymentMethod, paymentStatus }: any) => {
      const response = await apiRequest('PATCH', `/api/bookings/${bookingId}/payment`, {
        paymentMethod,
        paymentStatus,
      });
      return response.json();
    },
  });

  const handlePayment = async () => {
    if (!paymentMethod || !termsAccepted || !schedule) {
      toast({
        title: "Incomplete information",
        description: "Please fill all required fields and accept terms",
        variant: "destructive",
      });
      return;
    }

    try {
      // Create passenger
      const passenger = await createPassengerMutation.mutateAsync({
        name: passengerData.name,
        phone: passengerData.phone,
        age: parseInt(passengerData.age),
      });

      // Create booking
      const booking = await createBookingMutation.mutateAsync({
        scheduleId: schedule.id,
        passengerId: passenger.id,
        fromStopId: 1, // First stop by default
        toStopId: 4, // Last stop by default  
        seatNumber: selectedSeats[0],
        totalFare: totalFare.toString(),
        bookingType: 'app',
        paymentMethod: paymentMethod,
        paymentStatus: paymentMethod === 'cash' ? 'pending' : 'completed',
        bookingStatus: 'confirmed',
      });

      // Update payment status
      await updatePaymentMutation.mutateAsync({
        bookingId: booking.id,
        paymentMethod,
        paymentStatus: paymentMethod === 'cash' ? 'pending' : 'completed',
      });

      toast({
        title: "Booking confirmed!",
        description: "Your seat has been reserved successfully",
      });

      // Clear stored data
      localStorage.removeItem('selectedSchedule');
      localStorage.removeItem('selectedSeats');
      localStorage.removeItem('totalFare');
      localStorage.setItem('currentBooking', JSON.stringify(booking));

      setLocation('/passenger-dashboard');
    } catch (error) {
      toast({
        title: "Payment failed",
        description: "Please try again or contact support",
        variant: "destructive",
      });
    }
  };

  const paymentOptions = [
    { value: 'upi', label: 'UPI Payment', icon: Smartphone },
    { value: 'card', label: 'Debit/Credit Card', icon: CreditCard },
    { value: 'wallet', label: 'Digital Wallet', icon: Wallet },
    { value: 'cash', label: 'Cash on Boarding', icon: Banknote },
  ];

  if (!schedule) {
    return (
      <div className="min-h-screen bg-background">
        <AppBar title="Payment" showBack />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <AppBar title="Payment" showBack />

      <div className="p-4 space-y-4">
        {/* Booking Summary */}
        <Card className="elevation-1">
          <CardContent className="p-4">
            <h3 className="font-medium text-gray-800 mb-3">Booking Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Route</span>
                <span className="text-gray-800">{schedule.route.fromCity.name} → {schedule.route.toCity.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date & Time</span>
                <span className="text-gray-800">
                  {new Date(schedule.departureTime).toLocaleDateString()}, {new Date(schedule.departureTime).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Seats</span>
                <span className="text-gray-800">{selectedSeats.join(', ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shuttle</span>
                <span className="text-gray-800">{schedule.vehicle.model} ({schedule.vehicle.registrationNumber})</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between font-medium">
                <span className="text-gray-800">Total Amount</span>
                <span className="text-primary text-lg">₹{totalFare}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card className="elevation-1">
          <CardContent className="p-4">
            <h3 className="font-medium text-gray-800 mb-3">Payment Method</h3>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="space-y-3">
                {paymentOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label htmlFor={option.value} className="flex items-center space-x-3 cursor-pointer flex-1">
                      <option.icon className="w-5 h-5 text-primary" />
                      <span>{option.label}</span>
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Passenger Information */}
        <Card className="elevation-1">
          <CardContent className="p-4">
            <h3 className="font-medium text-gray-800 mb-3">Passenger Information</h3>
            <div className="space-y-3">
              <div>
                <Label className="text-sm text-gray-600 mb-2">Full Name</Label>
                <Input
                  type="text"
                  placeholder="Enter passenger name"
                  value={passengerData.name}
                  onChange={(e) => setPassengerData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <Label className="text-sm text-gray-600 mb-2">Phone Number</Label>
                <Input
                  type="tel"
                  placeholder="Enter phone number"
                  value={passengerData.phone}
                  onChange={(e) => setPassengerData(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              <div>
                <Label className="text-sm text-gray-600 mb-2">Age</Label>
                <Input
                  type="number"
                  placeholder="Enter age"
                  value={passengerData.age}
                  onChange={(e) => setPassengerData(prev => ({ ...prev, age: e.target.value }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Terms & Conditions */}
        <Card className="bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="terms"
                checked={termsAccepted}
                onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
              />
              <div>
                <Label htmlFor="terms" className="text-sm text-gray-700 cursor-pointer">
                  I agree to the{' '}
                  <a href="#" className="text-primary underline">Terms & Conditions</a>
                  {' '}and{' '}
                  <a href="#" className="text-primary underline">Privacy Policy</a>
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Button */}
        <Button
          onClick={handlePayment}
          disabled={!paymentMethod || !termsAccepted || createBookingMutation.isLoading}
          className="w-full bg-primary text-white hover:bg-primary/90 py-4 font-medium text-lg elevation-2"
        >
          {createBookingMutation.isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Processing...</span>
            </div>
          ) : (
            `Proceed to Pay ₹${totalFare}`
          )}
        </Button>
      </div>
    </div>
  );
}

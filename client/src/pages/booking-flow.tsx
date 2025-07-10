import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpDown, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";
import AppBar from "@/components/ui/app-bar";
import { TIME_PREFERENCES } from "@/lib/constants";
import type { BookingSearchParams, PassengerCounts } from "@/types";

export default function BookingFlow() {
  const [, setLocation] = useLocation();
  const [searchParams, setSearchParams] = useState<BookingSearchParams>({
    fromCityId: 0,
    toCityId: 0,
    date: new Date().toISOString().split('T')[0],
    passengers: 1,
    timePreference: 'any',
  });
  const [passengerCounts, setPassengerCounts] = useState<PassengerCounts>({
    adults: 1,
    children: 0,
  });

  const { data: cities } = useQuery({
    queryKey: ['/api/cities'],
  });

  const updatePassengerCount = (type: 'adults' | 'children', delta: number) => {
    const newCounts = { ...passengerCounts };
    if (type === 'adults') {
      newCounts.adults = Math.max(1, newCounts.adults + delta);
    } else {
      newCounts.children = Math.max(0, newCounts.children + delta);
    }
    setPassengerCounts(newCounts);
    setSearchParams(prev => ({ ...prev, passengers: newCounts.adults + newCounts.children }));
  };

  const swapCities = () => {
    setSearchParams(prev => ({
      ...prev,
      fromCityId: prev.toCityId,
      toCityId: prev.fromCityId,
    }));
  };

  const handleSearch = () => {
    if (searchParams.fromCityId && searchParams.toCityId) {
      localStorage.setItem('searchParams', JSON.stringify(searchParams));
      setLocation('/ride-results');
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <AppBar title="Book Your Ride" showBack />

      <div className="p-4 space-y-4">
        {/* Route Selection */}
        <Card className="elevation-1">
          <CardContent className="p-4">
            <h3 className="font-medium text-gray-800 mb-3">Select Route</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
                <div className="flex-1">
                  <Select 
                    value={searchParams.fromCityId.toString()}
                    onValueChange={(value) => setSearchParams(prev => ({ ...prev, fromCityId: parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select departure city" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities?.map((city: any) => (
                        <SelectItem key={city.id} value={city.id.toString()}>
                          {city.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-center">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={swapCities}
                  className="w-8 h-8 rounded-full p-0"
                >
                  <ArrowUpDown className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-secondary rounded-full"></div>
                <div className="flex-1">
                  <Select 
                    value={searchParams.toCityId.toString()}
                    onValueChange={(value) => setSearchParams(prev => ({ ...prev, toCityId: parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select destination city" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities?.map((city: any) => (
                        <SelectItem key={city.id} value={city.id.toString()}>
                          {city.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Date & Time */}
        <Card className="elevation-1">
          <CardContent className="p-4">
            <h3 className="font-medium text-gray-800 mb-3">Travel Date & Time</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm text-gray-600 mb-2">Date</Label>
                <Input 
                  type="date" 
                  value={searchParams.date}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
              <div>
                <Label className="text-sm text-gray-600 mb-2">Preferred Time</Label>
                <Select 
                  value={searchParams.timePreference}
                  onValueChange={(value: any) => setSearchParams(prev => ({ ...prev, timePreference: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_PREFERENCES.map((time) => (
                      <SelectItem key={time.value} value={time.value}>
                        {time.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Passenger Details */}
        <Card className="elevation-1">
          <CardContent className="p-4">
            <h3 className="font-medium text-gray-800 mb-3">Passenger Details</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Adults</span>
                <div className="flex items-center space-x-3">
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => updatePassengerCount('adults', -1)}
                    className="w-8 h-8 rounded-full p-0"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-8 text-center">{passengerCounts.adults}</span>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => updatePassengerCount('adults', 1)}
                    className="w-8 h-8 rounded-full p-0"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Children (5-12 years)</span>
                <div className="flex items-center space-x-3">
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => updatePassengerCount('children', -1)}
                    className="w-8 h-8 rounded-full p-0"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-8 text-center">{passengerCounts.children}</span>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => updatePassengerCount('children', 1)}
                    className="w-8 h-8 rounded-full p-0"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search Button */}
        <Button 
          onClick={handleSearch}
          className="w-full bg-primary text-white hover:bg-primary/90 py-4 text-lg font-medium elevation-2"
          disabled={!searchParams.fromCityId || !searchParams.toCityId}
        >
          Search Available Rides
        </Button>
      </div>
    </div>
  );
}

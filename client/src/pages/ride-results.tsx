import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLocation } from "wouter";
import AppBar from "@/components/ui/app-bar";
import RouteCard from "@/components/ui/route-card";
import { apiRequest } from "@/lib/queryClient";
import type { BookingSearchParams } from "@/types";
import type { ScheduleWithDetails } from "@shared/schema";

export default function RideResults() {
  const [, setLocation] = useLocation();
  const [searchParams, setSearchParams] = useState<BookingSearchParams | null>(null);
  const [schedules, setSchedules] = useState<ScheduleWithDetails[]>([]);

  const searchMutation = useMutation({
    mutationFn: async (params: BookingSearchParams) => {
      const response = await apiRequest('POST', '/api/schedules/search', params);
      return response.json();
    },
    onSuccess: (data) => {
      setSchedules(data);
    },
  });

  useEffect(() => {
    const stored = localStorage.getItem('searchParams');
    if (stored) {
      const params = JSON.parse(stored);
      setSearchParams(params);
      searchMutation.mutate(params);
    }
  }, []);

  const handleSelectRide = (schedule: ScheduleWithDetails) => {
    localStorage.setItem('selectedSchedule', JSON.stringify(schedule));
    setLocation('/seat-selection');
  };

  const handleEdit = () => {
    setLocation('/booking-flow');
  };

  if (!searchParams) {
    return (
      <div className="min-h-screen bg-background">
        <AppBar title="Available Rides" showBack />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <AppBar title="Available Rides" showBack />

      <div className="p-4 space-y-4">
        {/* Route Info */}
        <Card className="elevation-1">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium text-gray-800">Route Search</h3>
                <p className="text-sm text-gray-600">
                  {new Date(searchParams.date).toLocaleDateString()} • {searchParams.passengers} passenger(s)
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={handleEdit}>
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Search Results */}
        {searchMutation.isLoading && (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}

        {searchMutation.isError && (
          <Card className="bg-red-50">
            <CardContent className="p-4">
              <p className="text-red-600">Failed to search rides. Please try again.</p>
            </CardContent>
          </Card>
        )}

        {schedules.length === 0 && !searchMutation.isLoading && !searchMutation.isError && (
          <Card className="bg-gray-50">
            <CardContent className="p-4">
              <p className="text-gray-600 text-center">No rides found for your search criteria.</p>
            </CardContent>
          </Card>
        )}

        {schedules.map((schedule) => (
          <RouteCard
            key={schedule.id}
            schedule={schedule}
            onSelect={handleSelectRide}
            showSelectButton
          />
        ))}
      </div>
    </div>
  );
}

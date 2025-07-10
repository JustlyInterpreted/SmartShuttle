import { Clock, Users, Star, Wifi, Snowflake } from "lucide-react";
import { Button } from "./button";
import type { ScheduleWithDetails } from "@shared/schema";

interface RouteCardProps {
  schedule: ScheduleWithDetails;
  onSelect?: (schedule: ScheduleWithDetails) => void;
  showSelectButton?: boolean;
}

export default function RouteCard({ schedule, onSelect, showSelectButton = false }: RouteCardProps) {
  const departureTime = new Date(schedule.departureTime).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const arrivalTime = new Date(schedule.arrivalTime).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const duration = Math.floor((new Date(schedule.arrivalTime).getTime() - new Date(schedule.departureTime).getTime()) / (1000 * 60));
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;

  return (
    <div className="route-card">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
            <i className="fas fa-bus text-white"></i>
          </div>
          <div>
            <h4 className="font-medium text-gray-800">{schedule.vehicle.model}</h4>
            <p className="text-sm text-gray-600">{schedule.vehicle.registrationNumber}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xl font-medium text-gray-800">₹{schedule.route.baseFare}</p>
          <p className="text-sm text-gray-600">per person</p>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-3">
        <div className="text-center">
          <p className="text-lg font-medium text-gray-800">{departureTime}</p>
          <p className="text-sm text-gray-600">{schedule.route.fromCity.name}</p>
        </div>
        <div className="flex-1 mx-4">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <div className="flex-1 h-0.5 bg-gray-300 mx-2"></div>
            <div className="text-sm text-gray-600">{hours}h {minutes}m</div>
            <div className="flex-1 h-0.5 bg-gray-300 mx-2"></div>
            <div className="w-2 h-2 bg-secondary rounded-full"></div>
          </div>
        </div>
        <div className="text-center">
          <p className="text-lg font-medium text-gray-800">{arrivalTime}</p>
          <p className="text-sm text-gray-600">{schedule.route.toCity.name}</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span>
            <Users className="w-4 h-4 inline mr-1" />
            {schedule.availableSeats}/{schedule.totalSeats} seats
          </span>
          {schedule.vehicle.amenities.includes('WiFi') && (
            <span>
              <Wifi className="w-4 h-4 inline mr-1" />
              WiFi
            </span>
          )}
          {schedule.vehicle.amenities.includes('AC') && (
            <span>
              <Snowflake className="w-4 h-4 inline mr-1" />
              AC
            </span>
          )}
        </div>
        <div className="flex items-center space-x-1">
          <span className="text-sm text-gray-600">{schedule.driver.rating}</span>
          <div className="flex text-warning">
            <Star className="w-4 h-4 fill-current" />
            <Star className="w-4 h-4 fill-current" />
            <Star className="w-4 h-4 fill-current" />
            <Star className="w-4 h-4 fill-current" />
            <Star className="w-4 h-4 fill-current" />
          </div>
        </div>
      </div>

      {showSelectButton && (
        <Button 
          onClick={() => onSelect?.(schedule)}
          className="w-full bg-primary text-white hover:bg-primary/90"
        >
          Select Seats
        </Button>
      )}
    </div>
  );
}

import { useState } from "react";
import { Button } from "./button";
import type { SeatAvailability } from "@shared/schema";

interface SeatGridProps {
  seats: SeatAvailability[];
  selectedSeats: string[];
  onSeatSelect: (seatNumber: string) => void;
  maxSeats?: number;
}

export default function SeatGrid({ seats, selectedSeats, onSeatSelect, maxSeats = 1 }: SeatGridProps) {
  const getSeatClass = (seat: SeatAvailability) => {
    if (selectedSeats.includes(seat.seatNumber)) {
      return 'seat selected';
    }
    if (seat.isOccupied) {
      return 'seat occupied';
    }
    return 'seat available';
  };

  const handleSeatClick = (seat: SeatAvailability) => {
    if (seat.isOccupied) return;
    
    if (selectedSeats.includes(seat.seatNumber)) {
      onSeatSelect(seat.seatNumber);
    } else if (selectedSeats.length < maxSeats) {
      onSeatSelect(seat.seatNumber);
    }
  };

  return (
    <div className="bg-white rounded-xl p-4 elevation-1">
      <h3 className="font-medium text-gray-800 mb-3">Select Your Seats</h3>
      
      {/* Driver Section */}
      <div className="flex justify-between items-center mb-4">
        <div className="w-12 h-8 bg-gray-400 rounded flex items-center justify-center">
          <i className="fas fa-steering-wheel text-white text-sm"></i>
        </div>
        <div className="text-sm text-gray-600">Front</div>
      </div>

      {/* Seat Grid */}
      <div className="seat-grid">
        {seats.map((seat) => (
          <div
            key={seat.seatNumber}
            className={getSeatClass(seat)}
            onClick={() => handleSeatClick(seat)}
          >
            {seat.seatNumber}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t">
        <h4 className="font-medium text-gray-800 mb-3">Seat Legend</h4>
        <div className="flex justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-success border-2 border-success rounded"></div>
            <span className="text-sm text-gray-600">Available</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-primary border-2 border-primary rounded"></div>
            <span className="text-sm text-gray-600">Selected</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-destructive border-2 border-destructive rounded"></div>
            <span className="text-sm text-gray-600">Occupied</span>
          </div>
        </div>
      </div>
    </div>
  );
}

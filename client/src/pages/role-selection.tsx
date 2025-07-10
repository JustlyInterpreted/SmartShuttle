import { User, ShipWheel } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import AppBar from "@/components/ui/app-bar";

interface RoleSelectionProps {
  onRoleSelect: (role: 'passenger' | 'driver' | 'admin') => void;
}

export default function RoleSelection({ onRoleSelect }: RoleSelectionProps) {
  return (
    <div className="min-h-screen bg-background">
      <AppBar title="Choose Your Role" />
      
      <div className="p-6 space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-medium text-gray-800 mb-2">How would you like to use Setu?</h2>
          <p className="text-gray-600">Select your role to get started</p>
        </div>

        <div className="space-y-4">
          {/* Passenger Role */}
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onRoleSelect('passenger')}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-medium text-gray-800">Passenger</h3>
                  <p className="text-gray-600">Book rides, track shuttles, and travel safely</p>
                </div>
                <i className="fas fa-chevron-right text-gray-400"></i>
              </div>
            </CardContent>
          </Card>

          {/* Driver Role */}
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onRoleSelect('driver')}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                  <ShipWheel className="w-8 h-8 text-secondary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-medium text-gray-800">Driver</h3>
                  <p className="text-gray-600">Manage routes, view passengers, and operate shuttles</p>
                </div>
                <i className="fas fa-chevron-right text-gray-400"></i>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="bg-blue-50 rounded-xl p-4 mt-8">
          <div className="flex items-start space-x-3">
            <i className="fas fa-info-circle text-primary text-xl mt-1"></i>
            <div>
              <h4 className="font-medium text-gray-800">New to Setu?</h4>
              <p className="text-gray-600 text-sm mt-1">You can switch roles anytime from your profile settings</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

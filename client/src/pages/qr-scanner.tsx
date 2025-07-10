import { useState, useEffect } from "react";
import { Camera, Keyboard, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import AppBar from "@/components/ui/app-bar";
import { useToast } from "@/hooks/use-toast";

interface ScannedItem {
  id: string;
  passenger: string;
  time: string;
  status: 'verified' | 'pending' | 'invalid';
}

export default function QRScanner() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isScanning, setIsScanning] = useState(true);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [recentScans, setRecentScans] = useState<ScannedItem[]>([
    {
      id: 'QR_1_123456789',
      passenger: 'Passenger A1',
      time: '5 minutes ago',
      status: 'verified',
    },
    {
      id: 'QR_2_123456790',
      passenger: 'Passenger B2', 
      time: '12 minutes ago',
      status: 'verified',
    },
  ]);

  useEffect(() => {
    // Simulate QR scanner initialization
    const timer = setTimeout(() => {
      setIsScanning(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleManualEntry = () => {
    if (!manualCode.trim()) {
      toast({
        title: "Empty code",
        description: "Please enter a valid QR code",
        variant: "destructive",
      });
      return;
    }

    // Simulate QR code processing
    const newScan: ScannedItem = {
      id: manualCode,
      passenger: `Passenger ${manualCode.slice(-2)}`,
      time: 'Just now',
      status: 'verified',
    };

    setRecentScans(prev => [newScan, ...prev]);
    setManualCode('');
    setShowManualEntry(false);

    toast({
      title: "QR Code verified",
      description: "Passenger successfully verified",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-success text-white';
      case 'pending':
        return 'bg-warning text-white';
      case 'invalid':
        return 'bg-destructive text-white';
      default:
        return 'bg-gray-300 text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <AppBar title="QR Scanner" showBack />

      <div className="p-4 space-y-4">
        {/* Scanner Interface */}
        <Card className="elevation-1">
          <CardContent className="p-4">
            <h3 className="font-medium text-gray-800 mb-3 text-center">Scan QR Code</h3>
            
            {/* Camera Preview Placeholder */}
            <div className="w-full h-64 bg-gray-900 rounded-lg flex items-center justify-center relative overflow-hidden">
              <div className="text-center text-white">
                <Camera className="w-12 h-12 mb-2 mx-auto" />
                <p>Position QR code in the frame</p>
              </div>
              
              {/* Scanning Frame */}
              <div className="absolute inset-4 border-2 border-white rounded-lg">
                <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-primary rounded-tl-lg"></div>
                <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-primary rounded-tr-lg"></div>
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-primary rounded-bl-lg"></div>
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-primary rounded-br-lg"></div>
              </div>
              
              {/* Scanning Line */}
              <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-primary opacity-75 animate-pulse"></div>

              {/* Flash effect when scanning */}
              {isScanning && (
                <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
              )}
            </div>
            
            <p className="text-sm text-gray-600 text-center mt-3">
              Point your camera at the QR code to scan
            </p>
          </CardContent>
        </Card>

        {/* Manual Entry */}
        {showManualEntry ? (
          <Card className="elevation-1">
            <CardContent className="p-4">
              <h3 className="font-medium text-gray-800 mb-3">Manual Entry</h3>
              <div className="space-y-3">
                <Input
                  placeholder="Enter QR code manually"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                />
                <div className="flex space-x-2">
                  <Button 
                    onClick={handleManualEntry}
                    className="flex-1 bg-primary text-white hover:bg-primary/90"
                  >
                    Verify Code
                  </Button>
                  <Button 
                    onClick={() => setShowManualEntry(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Button 
            onClick={() => setShowManualEntry(true)}
            variant="outline"
            className="w-full"
          >
            <Keyboard className="w-4 h-4 mr-2" />
            Enter Code Manually
          </Button>
        )}

        {/* Instructions */}
        <Card className="bg-blue-50">
          <CardContent className="p-4">
            <h3 className="font-medium text-gray-800 mb-2">How to Scan</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Hold your phone steady</li>
              <li>• Make sure QR code is within the frame</li>
              <li>• Ensure good lighting</li>
              <li>• Wait for automatic detection</li>
            </ul>
          </CardContent>
        </Card>

        {/* Recent Scans */}
        <Card className="elevation-1">
          <CardContent className="p-4">
            <h3 className="font-medium text-gray-800 mb-3">Recent Scans</h3>
            <div className="space-y-3">
              {recentScans.map((scan) => (
                <div key={scan.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">{scan.passenger}</p>
                    <p className="text-sm text-gray-600">Scanned {scan.time}</p>
                  </div>
                  <Badge className={getStatusColor(scan.status)}>
                    {scan.status === 'verified' ? 'Verified' : 
                     scan.status === 'pending' ? 'Pending' : 'Invalid'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button 
            variant="outline"
            className="flex flex-col items-center p-4 h-auto"
          >
            <Zap className="w-6 h-6 mb-1" />
            <span className="text-sm">Flash Toggle</span>
          </Button>
          <Button 
            variant="outline"
            className="flex flex-col items-center p-4 h-auto"
            onClick={() => setLocation('/passenger-list')}
          >
            <Camera className="w-6 h-6 mb-1" />
            <span className="text-sm">View All</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

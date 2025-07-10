import { Clock, Signal, Battery, Wifi } from "lucide-react";

export default function StatusBar() {
  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <div className="status-bar">
      <div className="flex items-center space-x-2">
        <Signal className="w-4 h-4" />
        <span className="text-xs">Jio 4G</span>
        <Wifi className="w-4 h-4" />
      </div>
      <div className="flex items-center space-x-2">
        <Battery className="w-4 h-4" />
        <span className="text-xs">85%</span>
        <Clock className="w-4 h-4" />
        <span className="text-xs">{currentTime}</span>
      </div>
    </div>
  );
}

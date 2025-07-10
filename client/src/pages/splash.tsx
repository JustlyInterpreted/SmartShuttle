import { useEffect } from "react";

export default function Splash() {
  useEffect(() => {
    // Preload important resources
    const preloadImages = () => {
      const images = [
        // Add any important images to preload
      ];
      images.forEach(src => {
        const img = new Image();
        img.src = src;
      });
    };
    
    preloadImages();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-primary to-blue-600 text-white">
      <div className="text-center">
        <div className="text-6xl font-bold mb-4">🚐</div>
        <h1 className="text-4xl font-bold mb-2">Setu</h1>
        <p className="text-xl opacity-90 mb-8">Smart Shuttle Service</p>
        <p className="text-lg opacity-80">Connecting Ranchi & Beyond</p>
      </div>
      <div className="absolute bottom-32">
        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );
}

import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

interface AppBarProps {
  title: string;
  showBack?: boolean;
  actions?: React.ReactNode;
  onBack?: () => void;
}

export default function AppBar({ title, showBack = false, actions, onBack }: AppBarProps) {
  const [, setLocation] = useLocation();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      window.history.back();
    }
  };

  return (
    <div className="app-bar">
      <div className="flex items-center space-x-3">
        {showBack && (
          <button onClick={handleBack} className="text-primary-foreground hover:opacity-80">
            <ArrowLeft className="w-6 h-6" />
          </button>
        )}
        <h1 className="text-xl font-medium">{title}</h1>
      </div>
      {actions && <div className="flex items-center space-x-4">{actions}</div>}
    </div>
  );
}

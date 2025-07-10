export interface BookingSearchParams {
  fromCityId: number;
  toCityId: number;
  date: string;
  passengers: number;
  timePreference?: 'morning' | 'afternoon' | 'evening' | 'any';
}

export interface PassengerCounts {
  adults: number;
  children: number;
}

export interface SeatSelection {
  seatNumber: string;
  passengerId?: number;
}

export interface PaymentDetails {
  method: 'upi' | 'card' | 'wallet' | 'cash';
  status: 'pending' | 'completed' | 'failed';
}

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp?: number;
}

export interface WebSocketMessage {
  type: string;
  data?: any;
  scheduleId?: number;
  bookingId?: number;
  location?: LocationData;
}

export interface RouteStop {
  id: number;
  name: string;
  code: string;
  estimatedArrival: number;
  fareFromStart: string;
  latitude?: string;
  longitude?: string;
}

export interface LiveTrackingData {
  scheduleId: number;
  latitude: string;
  longitude: string;
  speed?: string;
  heading?: string;
  timestamp: Date;
}

export interface DashboardStats {
  todayBookings: number;
  activeShuttles: number;
  todayRevenue: number;
  averageRating: number;
}

export interface FeedbackData {
  bookingId: number;
  rating: number;
  comment?: string;
}

export interface Language {
  code: 'en' | 'hi';
  name: string;
}

export interface UserPreferences {
  language: Language['code'];
  notifications: boolean;
  location: boolean;
}

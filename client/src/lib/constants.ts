export const CITIES = [
  { id: 1, name: "Ranchi", code: "RAN" },
  { id: 2, name: "Bokaro", code: "BOK" },
  { id: 3, name: "Dhanbad", code: "DHN" },
  { id: 4, name: "Hazaribagh", code: "HZB" },
  { id: 5, name: "Ramgarh", code: "RMG" },
  { id: 6, name: "Chitarpur", code: "CTP" },
  { id: 7, name: "Gola", code: "GOL" },
  { id: 8, name: "Peterbar", code: "PTB" },
  { id: 9, name: "Tata (Jamshedpur)", code: "TAT" },
];

export const PICKUP_POINTS = {
  "Ranchi": [
    "Main Bus Stand",
    "Railway Station",
    "Airport",
    "Doranda",
    "Kanke",
  ],
  "Bokaro": [
    "Steel City",
    "City Centre",
    "Thermal Power Station",
  ],
  "Dhanbad": [
    "Bus Stand",
    "Railway Station",
    "Jharia",
  ],
};

export const TIME_PREFERENCES = [
  { value: 'morning', label: 'Morning (6-12 PM)' },
  { value: 'afternoon', label: 'Afternoon (12-6 PM)' },
  { value: 'evening', label: 'Evening (6-10 PM)' },
  { value: 'any', label: 'Any Time' },
];

export const PAYMENT_METHODS = [
  { value: 'upi', label: 'UPI Payment', icon: 'fa-mobile-alt' },
  { value: 'card', label: 'Debit/Credit Card', icon: 'fa-credit-card' },
  { value: 'wallet', label: 'Digital Wallet', icon: 'fa-wallet' },
  { value: 'cash', label: 'Cash on Boarding', icon: 'fa-money-bill-wave' },
];

export const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिंदी' },
];

export const SHUTTLE_AMENITIES = [
  { key: 'AC', label: 'Air Conditioning', icon: 'fa-snowflake' },
  { key: 'WiFi', label: 'WiFi', icon: 'fa-wifi' },
  { key: 'USB', label: 'USB Charging', icon: 'fa-usb' },
  { key: 'GPS', label: 'GPS Tracking', icon: 'fa-map-marker-alt' },
  { key: 'CCTV', label: 'CCTV', icon: 'fa-video' },
];

export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  BOARDED: 'boarded',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
};

export const SCHEDULE_STATUS = {
  SCHEDULED: 'scheduled',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  DELAYED: 'delayed',
};

export const EMERGENCY_CONTACTS = [
  { name: 'Setu Support', number: '1800-123-4567' },
  { name: 'Emergency Services', number: '112' },
  { name: 'Police', number: '100' },
  { name: 'Medical Emergency', number: '108' },
];

export const SMS_BOOKING_FORMAT = {
  format: 'SETU [Route Code] [Date] [Seats]',
  example: 'SETU RB01 15DEC 2',
  number: '9876543210',
};

export const WEBSOCKET_EVENTS = {
  SUBSCRIBE_TRACKING: 'subscribe_tracking',
  TRACKING_UPDATE: 'tracking_update',
  LOCATION_UPDATE: 'location_update',
  PASSENGER_LOCATION: 'passenger_location',
  NEW_BOOKING: 'new_booking',
  PAYMENT_UPDATE: 'payment_update',
};

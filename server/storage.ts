import {
  cities,
  routes,
  stops,
  vehicles,
  drivers,
  schedules,
  passengers,
  bookings,
  liveTracking,
  feedback,
  smsBookingCodes,
  adminLogs,
  type City,
  type Route,
  type Stop,
  type Vehicle,
  type Driver,
  type Schedule,
  type Passenger,
  type Booking,
  type LiveTracking,
  type Feedback,
  type SmsBookingCode,
  type AdminLog,
  type InsertCity,
  type InsertRoute,
  type InsertStop,
  type InsertVehicle,
  type InsertDriver,
  type InsertSchedule,
  type InsertPassenger,
  type InsertBooking,
  type InsertLiveTracking,
  type InsertFeedback,
  type InsertSmsBookingCode,
  type RouteWithCities,
  type ScheduleWithDetails,
  type BookingWithDetails,
  type BookingSearchParams,
  type SeatAvailability,
} from "@shared/schema";

export interface IStorage {
  // Cities
  getCities(): Promise<City[]>;
  createCity(city: InsertCity): Promise<City>;
  
  // Routes
  getRoutes(): Promise<RouteWithCities[]>;
  getRoute(id: number): Promise<RouteWithCities | undefined>;
  createRoute(route: InsertRoute): Promise<Route>;
  
  // Stops
  getStopsByRoute(routeId: number): Promise<Stop[]>;
  createStop(stop: InsertStop): Promise<Stop>;
  
  // Vehicles
  getVehicles(): Promise<Vehicle[]>;
  createVehicle(vehicle: InsertVehicle): Promise<Vehicle>;
  
  // Drivers
  getDrivers(): Promise<Driver[]>;
  createDriver(driver: InsertDriver): Promise<Driver>;
  
  // Schedules
  getSchedules(): Promise<ScheduleWithDetails[]>;
  getSchedule(id: number): Promise<ScheduleWithDetails | undefined>;
  searchSchedules(params: BookingSearchParams): Promise<ScheduleWithDetails[]>;
  createSchedule(schedule: InsertSchedule): Promise<Schedule>;
  updateScheduleSeats(scheduleId: number, availableSeats: number): Promise<void>;
  
  // Passengers
  getPassenger(id: number): Promise<Passenger | undefined>;
  getPassengerByPhone(phone: string): Promise<Passenger | undefined>;
  createPassenger(passenger: InsertPassenger): Promise<Passenger>;
  
  // Bookings
  getBookings(): Promise<BookingWithDetails[]>;
  getBooking(id: number): Promise<BookingWithDetails | undefined>;
  getBookingsBySchedule(scheduleId: number): Promise<BookingWithDetails[]>;
  getBookingsByPassenger(passengerId: number): Promise<BookingWithDetails[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBookingStatus(bookingId: number, status: string): Promise<void>;
  updateBookingPayment(bookingId: number, paymentMethod: string, paymentStatus: string): Promise<void>;
  
  // Seat management
  getSeatAvailability(scheduleId: number): Promise<SeatAvailability[]>;
  
  // Live tracking
  getLiveTracking(scheduleId: number): Promise<LiveTracking[]>;
  addLiveTracking(tracking: InsertLiveTracking): Promise<LiveTracking>;
  
  // Feedback
  getFeedback(): Promise<Feedback[]>;
  createFeedback(feedback: InsertFeedback): Promise<Feedback>;
  
  // SMS booking codes
  getSmsBookingCodes(): Promise<SmsBookingCode[]>;
  getSmsBookingCodeByCode(code: string): Promise<SmsBookingCode | undefined>;
  createSmsBookingCode(code: InsertSmsBookingCode): Promise<SmsBookingCode>;
  
  // Admin logs
  getAdminLogs(): Promise<AdminLog[]>;
  addAdminLog(action: string, details?: any): Promise<AdminLog>;
  
  // Dashboard analytics
  getDashboardStats(): Promise<{
    todayBookings: number;
    activeShuttles: number;
    todayRevenue: number;
    averageRating: number;
  }>;
}

export class MemStorage implements IStorage {
  private cities: Map<number, City> = new Map();
  private routes: Map<number, Route> = new Map();
  private stops: Map<number, Stop> = new Map();
  private vehicles: Map<number, Vehicle> = new Map();
  private drivers: Map<number, Driver> = new Map();
  private schedules: Map<number, Schedule> = new Map();
  private passengers: Map<number, Passenger> = new Map();
  private bookings: Map<number, Booking> = new Map();
  private liveTracking: Map<number, LiveTracking> = new Map();
  private feedback: Map<number, Feedback> = new Map();
  private smsBookingCodes: Map<number, SmsBookingCode> = new Map();
  private adminLogs: Map<number, AdminLog> = new Map();
  
  private currentId = 1;
  
  constructor() {
    this.initializeData();
  }
  
  private initializeData() {
    // Initialize cities
    const ranchCity: City = { id: 1, name: "Ranchi", code: "RAN", isActive: true, createdAt: new Date() };
    const bokaroCity: City = { id: 2, name: "Bokaro", code: "BOK", isActive: true, createdAt: new Date() };
    const dhanbadCity: City = { id: 3, name: "Dhanbad", code: "DHN", isActive: true, createdAt: new Date() };
    const hazaribaghCity: City = { id: 4, name: "Hazaribagh", code: "HZB", isActive: true, createdAt: new Date() };
    const ramgarhCity: City = { id: 5, name: "Ramgarh", code: "RMG", isActive: true, createdAt: new Date() };
    
    this.cities.set(1, ranchCity);
    this.cities.set(2, bokaroCity);
    this.cities.set(3, dhanbadCity);
    this.cities.set(4, hazaribaghCity);
    this.cities.set(5, ramgarhCity);
    
    // Initialize routes
    const route1: Route = {
      id: 1,
      fromCityId: 1,
      toCityId: 2,
      name: "Ranchi to Bokaro",
      code: "RB01",
      distance: "85.00",
      estimatedDuration: 135,
      baseFare: "75.00",
      distanceFare: "1.00",
      isActive: true,
      createdAt: new Date(),
    };
    
    const route2: Route = {
      id: 2,
      fromCityId: 1,
      toCityId: 3,
      name: "Ranchi to Dhanbad",
      code: "RD01",
      distance: "120.00",
      estimatedDuration: 210,
      baseFare: "100.00",
      distanceFare: "1.50",
      isActive: true,
      createdAt: new Date(),
    };
    
    this.routes.set(1, route1);
    this.routes.set(2, route2);
    
    // Initialize stops
    const stops1: Stop[] = [
      { id: 1, routeId: 1, name: "Ranchi Main Bus Stand", code: "RAN_MBS", latitude: "23.3441", longitude: "85.3096", order: 1, estimatedArrival: 0, fareFromStart: "0.00", isActive: true },
      { id: 2, routeId: 1, name: "Namkum Junction", code: "NAM_JUN", latitude: "23.2833", longitude: "85.3167", order: 2, estimatedArrival: 30, fareFromStart: "25.00", isActive: true },
      { id: 3, routeId: 1, name: "Ramgarh", code: "RMG_STA", latitude: "23.6333", longitude: "85.5167", order: 3, estimatedArrival: 75, fareFromStart: "45.00", isActive: true },
      { id: 4, routeId: 1, name: "Bokaro Steel City", code: "BOK_BSC", latitude: "23.6693", longitude: "85.9591", order: 4, estimatedArrival: 135, fareFromStart: "85.00", isActive: true },
    ];
    
    stops1.forEach(stop => this.stops.set(stop.id, stop));
    
    // Initialize vehicles
    const vehicle1: Vehicle = {
      id: 1,
      registrationNumber: "RJ14 GH 5678",
      model: "Tata Starbus",
      capacity: 20,
      amenities: ["AC", "WiFi", "USB Charging"],
      isActive: true,
      createdAt: new Date(),
    };
    
    this.vehicles.set(1, vehicle1);
    
    // Initialize drivers
    const driver1: Driver = {
      id: 1,
      name: "Amit Singh",
      phone: "+919876543210",
      licenseNumber: "RJ1420230001",
      rating: "4.8",
      isActive: true,
      createdAt: new Date(),
    };
    
    this.drivers.set(1, driver1);
    
    // Initialize schedules
    const today = new Date();
    const departure = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 30);
    const arrival = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 45);
    
    const schedule1: Schedule = {
      id: 1,
      routeId: 1,
      vehicleId: 1,
      driverId: 1,
      departureTime: departure,
      arrivalTime: arrival,
      availableSeats: 12,
      totalSeats: 20,
      status: "scheduled",
      createdAt: new Date(),
    };
    
    this.schedules.set(1, schedule1);
    
    // Initialize SMS booking codes
    const smsCode1: SmsBookingCode = {
      id: 1,
      routeId: 1,
      code: "RB01",
      description: "Ranchi to Bokaro route",
      isActive: true,
    };
    
    this.smsBookingCodes.set(1, smsCode1);
    
    this.currentId = 10;
  }
  
  // Cities
  async getCities(): Promise<City[]> {
    return Array.from(this.cities.values());
  }
  
  async createCity(city: InsertCity): Promise<City> {
    const id = this.currentId++;
    const newCity: City = { ...city, id, createdAt: new Date() };
    this.cities.set(id, newCity);
    return newCity;
  }
  
  // Routes
  async getRoutes(): Promise<RouteWithCities[]> {
    const routes = Array.from(this.routes.values());
    return routes.map(route => ({
      ...route,
      fromCity: this.cities.get(route.fromCityId)!,
      toCity: this.cities.get(route.toCityId)!,
    }));
  }
  
  async getRoute(id: number): Promise<RouteWithCities | undefined> {
    const route = this.routes.get(id);
    if (!route) return undefined;
    
    return {
      ...route,
      fromCity: this.cities.get(route.fromCityId)!,
      toCity: this.cities.get(route.toCityId)!,
    };
  }
  
  async createRoute(route: InsertRoute): Promise<Route> {
    const id = this.currentId++;
    const newRoute: Route = { ...route, id, createdAt: new Date() };
    this.routes.set(id, newRoute);
    return newRoute;
  }
  
  // Stops
  async getStopsByRoute(routeId: number): Promise<Stop[]> {
    return Array.from(this.stops.values()).filter(stop => stop.routeId === routeId);
  }
  
  async createStop(stop: InsertStop): Promise<Stop> {
    const id = this.currentId++;
    const newStop: Stop = { ...stop, id };
    this.stops.set(id, newStop);
    return newStop;
  }
  
  // Vehicles
  async getVehicles(): Promise<Vehicle[]> {
    return Array.from(this.vehicles.values());
  }
  
  async createVehicle(vehicle: InsertVehicle): Promise<Vehicle> {
    const id = this.currentId++;
    const newVehicle: Vehicle = { ...vehicle, id, createdAt: new Date() };
    this.vehicles.set(id, newVehicle);
    return newVehicle;
  }
  
  // Drivers
  async getDrivers(): Promise<Driver[]> {
    return Array.from(this.drivers.values());
  }
  
  async createDriver(driver: InsertDriver): Promise<Driver> {
    const id = this.currentId++;
    const newDriver: Driver = { ...driver, id, createdAt: new Date() };
    this.drivers.set(id, newDriver);
    return newDriver;
  }
  
  // Schedules
  async getSchedules(): Promise<ScheduleWithDetails[]> {
    const schedules = Array.from(this.schedules.values());
    return schedules.map(schedule => ({
      ...schedule,
      route: {
        ...this.routes.get(schedule.routeId)!,
        fromCity: this.cities.get(this.routes.get(schedule.routeId)!.fromCityId)!,
        toCity: this.cities.get(this.routes.get(schedule.routeId)!.toCityId)!,
      },
      vehicle: this.vehicles.get(schedule.vehicleId)!,
      driver: this.drivers.get(schedule.driverId)!,
    }));
  }
  
  async getSchedule(id: number): Promise<ScheduleWithDetails | undefined> {
    const schedule = this.schedules.get(id);
    if (!schedule) return undefined;
    
    return {
      ...schedule,
      route: {
        ...this.routes.get(schedule.routeId)!,
        fromCity: this.cities.get(this.routes.get(schedule.routeId)!.fromCityId)!,
        toCity: this.cities.get(this.routes.get(schedule.routeId)!.toCityId)!,
      },
      vehicle: this.vehicles.get(schedule.vehicleId)!,
      driver: this.drivers.get(schedule.driverId)!,
    };
  }
  
  async searchSchedules(params: BookingSearchParams): Promise<ScheduleWithDetails[]> {
    const schedules = await this.getSchedules();
    return schedules.filter(schedule => 
      schedule.route.fromCityId === params.fromCityId &&
      schedule.route.toCityId === params.toCityId &&
      schedule.availableSeats >= params.passengers &&
      schedule.status === "scheduled"
    );
  }
  
  async createSchedule(schedule: InsertSchedule): Promise<Schedule> {
    const id = this.currentId++;
    const newSchedule: Schedule = { ...schedule, id, createdAt: new Date() };
    this.schedules.set(id, newSchedule);
    return newSchedule;
  }
  
  async updateScheduleSeats(scheduleId: number, availableSeats: number): Promise<void> {
    const schedule = this.schedules.get(scheduleId);
    if (schedule) {
      schedule.availableSeats = availableSeats;
      this.schedules.set(scheduleId, schedule);
    }
  }
  
  // Passengers
  async getPassenger(id: number): Promise<Passenger | undefined> {
    return this.passengers.get(id);
  }
  
  async getPassengerByPhone(phone: string): Promise<Passenger | undefined> {
    return Array.from(this.passengers.values()).find(p => p.phone === phone);
  }
  
  async createPassenger(passenger: InsertPassenger): Promise<Passenger> {
    const id = this.currentId++;
    const newPassenger: Passenger = { ...passenger, id, createdAt: new Date() };
    this.passengers.set(id, newPassenger);
    return newPassenger;
  }
  
  // Bookings
  async getBookings(): Promise<BookingWithDetails[]> {
    const bookings = Array.from(this.bookings.values());
    return bookings.map(booking => ({
      ...booking,
      schedule: {
        ...this.schedules.get(booking.scheduleId)!,
        route: {
          ...this.routes.get(this.schedules.get(booking.scheduleId)!.routeId)!,
          fromCity: this.cities.get(this.routes.get(this.schedules.get(booking.scheduleId)!.routeId)!.fromCityId)!,
          toCity: this.cities.get(this.routes.get(this.schedules.get(booking.scheduleId)!.routeId)!.toCityId)!,
        },
        vehicle: this.vehicles.get(this.schedules.get(booking.scheduleId)!.vehicleId)!,
        driver: this.drivers.get(this.schedules.get(booking.scheduleId)!.driverId)!,
      },
      passenger: this.passengers.get(booking.passengerId)!,
      fromStop: this.stops.get(booking.fromStopId)!,
      toStop: this.stops.get(booking.toStopId)!,
    }));
  }
  
  async getBooking(id: number): Promise<BookingWithDetails | undefined> {
    const booking = this.bookings.get(id);
    if (!booking) return undefined;
    
    return {
      ...booking,
      schedule: {
        ...this.schedules.get(booking.scheduleId)!,
        route: {
          ...this.routes.get(this.schedules.get(booking.scheduleId)!.routeId)!,
          fromCity: this.cities.get(this.routes.get(this.schedules.get(booking.scheduleId)!.routeId)!.fromCityId)!,
          toCity: this.cities.get(this.routes.get(this.schedules.get(booking.scheduleId)!.routeId)!.toCityId)!,
        },
        vehicle: this.vehicles.get(this.schedules.get(booking.scheduleId)!.vehicleId)!,
        driver: this.drivers.get(this.schedules.get(booking.scheduleId)!.driverId)!,
      },
      passenger: this.passengers.get(booking.passengerId)!,
      fromStop: this.stops.get(booking.fromStopId)!,
      toStop: this.stops.get(booking.toStopId)!,
    };
  }
  
  async getBookingsBySchedule(scheduleId: number): Promise<BookingWithDetails[]> {
    const bookings = await this.getBookings();
    return bookings.filter(booking => booking.scheduleId === scheduleId);
  }
  
  async getBookingsByPassenger(passengerId: number): Promise<BookingWithDetails[]> {
    const bookings = await this.getBookings();
    return bookings.filter(booking => booking.passengerId === passengerId);
  }
  
  async createBooking(booking: InsertBooking): Promise<Booking> {
    const id = this.currentId++;
    const newBooking: Booking = { 
      ...booking, 
      id, 
      qrCode: `QR_${id}_${Date.now()}`,
      createdAt: new Date() 
    };
    this.bookings.set(id, newBooking);
    return newBooking;
  }
  
  async updateBookingStatus(bookingId: number, status: string): Promise<void> {
    const booking = this.bookings.get(bookingId);
    if (booking) {
      booking.bookingStatus = status;
      this.bookings.set(bookingId, booking);
    }
  }
  
  async updateBookingPayment(bookingId: number, paymentMethod: string, paymentStatus: string): Promise<void> {
    const booking = this.bookings.get(bookingId);
    if (booking) {
      booking.paymentMethod = paymentMethod;
      booking.paymentStatus = paymentStatus;
      this.bookings.set(bookingId, booking);
    }
  }
  
  // Seat management
  async getSeatAvailability(scheduleId: number): Promise<SeatAvailability[]> {
    const schedule = this.schedules.get(scheduleId);
    if (!schedule) return [];
    
    const bookings = Array.from(this.bookings.values()).filter(b => b.scheduleId === scheduleId);
    const occupiedSeats = bookings.map(b => b.seatNumber);
    
    const seats: SeatAvailability[] = [];
    const totalSeats = schedule.totalSeats;
    
    for (let i = 1; i <= totalSeats; i++) {
      const seatNumber = `A${i}`;
      const isOccupied = occupiedSeats.includes(seatNumber);
      seats.push({
        seatNumber,
        isAvailable: !isOccupied,
        isOccupied,
      });
    }
    
    return seats;
  }
  
  // Live tracking
  async getLiveTracking(scheduleId: number): Promise<LiveTracking[]> {
    return Array.from(this.liveTracking.values()).filter(t => t.scheduleId === scheduleId);
  }
  
  async addLiveTracking(tracking: InsertLiveTracking): Promise<LiveTracking> {
    const id = this.currentId++;
    const newTracking: LiveTracking = { ...tracking, id, timestamp: new Date() };
    this.liveTracking.set(id, newTracking);
    return newTracking;
  }
  
  // Feedback
  async getFeedback(): Promise<Feedback[]> {
    return Array.from(this.feedback.values());
  }
  
  async createFeedback(feedback: InsertFeedback): Promise<Feedback> {
    const id = this.currentId++;
    const newFeedback: Feedback = { ...feedback, id, createdAt: new Date() };
    this.feedback.set(id, newFeedback);
    return newFeedback;
  }
  
  // SMS booking codes
  async getSmsBookingCodes(): Promise<SmsBookingCode[]> {
    return Array.from(this.smsBookingCodes.values());
  }
  
  async getSmsBookingCodeByCode(code: string): Promise<SmsBookingCode | undefined> {
    return Array.from(this.smsBookingCodes.values()).find(c => c.code === code);
  }
  
  async createSmsBookingCode(code: InsertSmsBookingCode): Promise<SmsBookingCode> {
    const id = this.currentId++;
    const newCode: SmsBookingCode = { ...code, id };
    this.smsBookingCodes.set(id, newCode);
    return newCode;
  }
  
  // Admin logs
  async getAdminLogs(): Promise<AdminLog[]> {
    return Array.from(this.adminLogs.values());
  }
  
  async addAdminLog(action: string, details?: any): Promise<AdminLog> {
    const id = this.currentId++;
    const newLog: AdminLog = { id, action, details, timestamp: new Date() };
    this.adminLogs.set(id, newLog);
    return newLog;
  }
  
  // Dashboard analytics
  async getDashboardStats(): Promise<{
    todayBookings: number;
    activeShuttles: number;
    todayRevenue: number;
    averageRating: number;
  }> {
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    const todayBookings = Array.from(this.bookings.values()).filter(
      b => b.createdAt >= todayStart
    ).length;
    
    const activeShuttles = Array.from(this.schedules.values()).filter(
      s => s.status === "active"
    ).length;
    
    const todayRevenue = Array.from(this.bookings.values())
      .filter(b => b.createdAt >= todayStart && b.paymentStatus === "completed")
      .reduce((sum, b) => sum + parseFloat(b.totalFare), 0);
    
    const feedbackItems = Array.from(this.feedback.values());
    const averageRating = feedbackItems.length > 0 
      ? feedbackItems.reduce((sum, f) => sum + f.rating, 0) / feedbackItems.length
      : 0;
    
    return {
      todayBookings,
      activeShuttles,
      todayRevenue,
      averageRating,
    };
  }
}

export const storage = new MemStorage();

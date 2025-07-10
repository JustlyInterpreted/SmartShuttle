import { pgTable, text, serial, integer, boolean, timestamp, varchar, jsonb, decimal, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Cities and Routes
export const cities = pgTable("cities", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  code: varchar("code", { length: 10 }).notNull().unique(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const routes = pgTable("routes", {
  id: serial("id").primaryKey(),
  fromCityId: integer("from_city_id").references(() => cities.id).notNull(),
  toCityId: integer("to_city_id").references(() => cities.id).notNull(),
  name: varchar("name", { length: 200 }).notNull(),
  code: varchar("code", { length: 20 }).notNull().unique(),
  distance: decimal("distance", { precision: 8, scale: 2 }).notNull(),
  estimatedDuration: integer("estimated_duration").notNull(), // in minutes
  baseFare: decimal("base_fare", { precision: 8, scale: 2 }).notNull(),
  distanceFare: decimal("distance_fare", { precision: 8, scale: 2 }).notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Stops along routes
export const stops = pgTable("stops", {
  id: serial("id").primaryKey(),
  routeId: integer("route_id").references(() => routes.id).notNull(),
  name: varchar("name", { length: 200 }).notNull(),
  code: varchar("code", { length: 20 }).notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  order: integer("order").notNull(),
  estimatedArrival: integer("estimated_arrival").notNull(), // minutes from start
  fareFromStart: decimal("fare_from_start", { precision: 8, scale: 2 }).notNull(),
  isActive: boolean("is_active").default(true),
});

// Vehicles
export const vehicles = pgTable("vehicles", {
  id: serial("id").primaryKey(),
  registrationNumber: varchar("registration_number", { length: 20 }).notNull().unique(),
  model: varchar("model", { length: 100 }).notNull(),
  capacity: integer("capacity").notNull(),
  amenities: jsonb("amenities").$type<string[]>().default([]),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Drivers
export const drivers = pgTable("drivers", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  phone: varchar("phone", { length: 15 }).notNull().unique(),
  licenseNumber: varchar("license_number", { length: 50 }).notNull().unique(),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0.00"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Schedules
export const schedules = pgTable("schedules", {
  id: serial("id").primaryKey(),
  routeId: integer("route_id").references(() => routes.id).notNull(),
  vehicleId: integer("vehicle_id").references(() => vehicles.id).notNull(),
  driverId: integer("driver_id").references(() => drivers.id).notNull(),
  departureTime: timestamp("departure_time").notNull(),
  arrivalTime: timestamp("arrival_time").notNull(),
  availableSeats: integer("available_seats").notNull(),
  totalSeats: integer("total_seats").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("scheduled"), // scheduled, active, completed, cancelled
  createdAt: timestamp("created_at").defaultNow(),
});

// Passengers
export const passengers = pgTable("passengers", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  phone: varchar("phone", { length: 15 }).notNull(),
  email: varchar("email", { length: 100 }),
  age: integer("age"),
  preferredLanguage: varchar("preferred_language", { length: 5 }).default("en"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Bookings
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  scheduleId: integer("schedule_id").references(() => schedules.id).notNull(),
  passengerId: integer("passenger_id").references(() => passengers.id).notNull(),
  fromStopId: integer("from_stop_id").references(() => stops.id).notNull(),
  toStopId: integer("to_stop_id").references(() => stops.id).notNull(),
  seatNumber: varchar("seat_number", { length: 10 }).notNull(),
  totalFare: decimal("total_fare", { precision: 8, scale: 2 }).notNull(),
  bookingType: varchar("booking_type", { length: 20 }).notNull(), // app, sms, walk-in
  paymentMethod: varchar("payment_method", { length: 20 }), // upi, card, wallet, cash
  paymentStatus: varchar("payment_status", { length: 20 }).notNull().default("pending"),
  bookingStatus: varchar("booking_status", { length: 20 }).notNull().default("confirmed"),
  qrCode: varchar("qr_code", { length: 100 }),
  smsCode: varchar("sms_code", { length: 20 }),
  passengerLocation: jsonb("passenger_location").$type<{ latitude: number; longitude: number }>(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Live tracking
export const liveTracking = pgTable("live_tracking", {
  id: serial("id").primaryKey(),
  scheduleId: integer("schedule_id").references(() => schedules.id).notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 8 }).notNull(),
  longitude: decimal("longitude", { precision: 11, scale: 8 }).notNull(),
  speed: decimal("speed", { precision: 5, scale: 2 }),
  heading: decimal("heading", { precision: 5, scale: 2 }),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Feedback
export const feedback = pgTable("feedback", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id").references(() => bookings.id).notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
});

// SMS booking codes
export const smsBookingCodes = pgTable("sms_booking_codes", {
  id: serial("id").primaryKey(),
  routeId: integer("route_id").references(() => routes.id).notNull(),
  code: varchar("code", { length: 10 }).notNull().unique(),
  description: text("description"),
  isActive: boolean("is_active").default(true),
});

// Admin logs
export const adminLogs = pgTable("admin_logs", {
  id: serial("id").primaryKey(),
  action: varchar("action", { length: 100 }).notNull(),
  details: jsonb("details"),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Insert schemas
export const insertCitySchema = createInsertSchema(cities).omit({
  id: true,
  createdAt: true,
});

export const insertRouteSchema = createInsertSchema(routes).omit({
  id: true,
  createdAt: true,
});

export const insertStopSchema = createInsertSchema(stops).omit({
  id: true,
});

export const insertVehicleSchema = createInsertSchema(vehicles).omit({
  id: true,
  createdAt: true,
});

export const insertDriverSchema = createInsertSchema(drivers).omit({
  id: true,
  createdAt: true,
});

export const insertScheduleSchema = createInsertSchema(schedules).omit({
  id: true,
  createdAt: true,
});

export const insertPassengerSchema = createInsertSchema(passengers).omit({
  id: true,
  createdAt: true,
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
});

export const insertLiveTrackingSchema = createInsertSchema(liveTracking).omit({
  id: true,
  timestamp: true,
});

export const insertFeedbackSchema = createInsertSchema(feedback).omit({
  id: true,
  createdAt: true,
});

export const insertSmsBookingCodeSchema = createInsertSchema(smsBookingCodes).omit({
  id: true,
});

// Types
export type City = typeof cities.$inferSelect;
export type Route = typeof routes.$inferSelect;
export type Stop = typeof stops.$inferSelect;
export type Vehicle = typeof vehicles.$inferSelect;
export type Driver = typeof drivers.$inferSelect;
export type Schedule = typeof schedules.$inferSelect;
export type Passenger = typeof passengers.$inferSelect;
export type Booking = typeof bookings.$inferSelect;
export type LiveTracking = typeof liveTracking.$inferSelect;
export type Feedback = typeof feedback.$inferSelect;
export type SmsBookingCode = typeof smsBookingCodes.$inferSelect;
export type AdminLog = typeof adminLogs.$inferSelect;

export type InsertCity = z.infer<typeof insertCitySchema>;
export type InsertRoute = z.infer<typeof insertRouteSchema>;
export type InsertStop = z.infer<typeof insertStopSchema>;
export type InsertVehicle = z.infer<typeof insertVehicleSchema>;
export type InsertDriver = z.infer<typeof insertDriverSchema>;
export type InsertSchedule = z.infer<typeof insertScheduleSchema>;
export type InsertPassenger = z.infer<typeof insertPassengerSchema>;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type InsertLiveTracking = z.infer<typeof insertLiveTrackingSchema>;
export type InsertFeedback = z.infer<typeof insertFeedbackSchema>;
export type InsertSmsBookingCode = z.infer<typeof insertSmsBookingCodeSchema>;

// Extended types for API responses
export type RouteWithCities = Route & {
  fromCity: City;
  toCity: City;
};

export type ScheduleWithDetails = Schedule & {
  route: RouteWithCities;
  vehicle: Vehicle;
  driver: Driver;
};

export type BookingWithDetails = Booking & {
  schedule: ScheduleWithDetails;
  passenger: Passenger;
  fromStop: Stop;
  toStop: Stop;
};

export type BookingSearchParams = {
  fromCityId: number;
  toCityId: number;
  date: string;
  passengers: number;
  timePreference?: 'morning' | 'afternoon' | 'evening' | 'any';
};

export type SeatAvailability = {
  seatNumber: string;
  isAvailable: boolean;
  isOccupied: boolean;
};

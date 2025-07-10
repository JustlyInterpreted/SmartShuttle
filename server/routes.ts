import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertPassengerSchema, insertBookingSchema, insertLiveTrackingSchema, insertFeedbackSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // WebSocket server for real-time updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  wss.on('connection', (ws) => {
    console.log('WebSocket client connected');
    
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        console.log('Received:', data);
        
        // Handle different message types
        switch (data.type) {
          case 'subscribe_tracking':
            // Subscribe to live tracking updates
            ws.send(JSON.stringify({
              type: 'tracking_update',
              scheduleId: data.scheduleId,
              location: { latitude: 23.3441, longitude: 85.3096 }
            }));
            break;
          
          case 'location_update':
            // Handle passenger location updates
            if (data.bookingId && data.location) {
              // Broadcast to drivers
              wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                  client.send(JSON.stringify({
                    type: 'passenger_location',
                    bookingId: data.bookingId,
                    location: data.location
                  }));
                }
              });
            }
            break;
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });
    
    ws.on('close', () => {
      console.log('WebSocket client disconnected');
    });
  });

  // Cities API
  app.get('/api/cities', async (req, res) => {
    try {
      const cities = await storage.getCities();
      res.json(cities);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch cities' });
    }
  });

  // Routes API
  app.get('/api/routes', async (req, res) => {
    try {
      const routes = await storage.getRoutes();
      res.json(routes);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch routes' });
    }
  });

  app.get('/api/routes/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const route = await storage.getRoute(id);
      if (!route) {
        return res.status(404).json({ message: 'Route not found' });
      }
      res.json(route);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch route' });
    }
  });

  // Stops API
  app.get('/api/routes/:id/stops', async (req, res) => {
    try {
      const routeId = parseInt(req.params.id);
      const stops = await storage.getStopsByRoute(routeId);
      res.json(stops);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch stops' });
    }
  });

  // Search schedules
  app.post('/api/schedules/search', async (req, res) => {
    try {
      const searchParams = req.body;
      const schedules = await storage.searchSchedules(searchParams);
      res.json(schedules);
    } catch (error) {
      res.status(500).json({ message: 'Failed to search schedules' });
    }
  });

  // Get schedule details
  app.get('/api/schedules/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const schedule = await storage.getSchedule(id);
      if (!schedule) {
        return res.status(404).json({ message: 'Schedule not found' });
      }
      res.json(schedule);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch schedule' });
    }
  });

  // Get seat availability
  app.get('/api/schedules/:id/seats', async (req, res) => {
    try {
      const scheduleId = parseInt(req.params.id);
      const seats = await storage.getSeatAvailability(scheduleId);
      res.json(seats);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch seat availability' });
    }
  });

  // Create passenger
  app.post('/api/passengers', async (req, res) => {
    try {
      const passengerData = insertPassengerSchema.parse(req.body);
      
      // Check if passenger already exists
      const existing = await storage.getPassengerByPhone(passengerData.phone);
      if (existing) {
        return res.json(existing);
      }
      
      const passenger = await storage.createPassenger(passengerData);
      res.json(passenger);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: 'Invalid passenger data', errors: error.errors });
      } else {
        res.status(500).json({ message: 'Failed to create passenger' });
      }
    }
  });

  // Create booking
  app.post('/api/bookings', async (req, res) => {
    try {
      const bookingData = insertBookingSchema.parse(req.body);
      
      // Check seat availability
      const seats = await storage.getSeatAvailability(bookingData.scheduleId);
      const selectedSeat = seats.find(s => s.seatNumber === bookingData.seatNumber);
      
      if (!selectedSeat || !selectedSeat.isAvailable) {
        return res.status(400).json({ message: 'Seat not available' });
      }
      
      const booking = await storage.createBooking(bookingData);
      
      // Update schedule seat count
      const schedule = await storage.getSchedule(bookingData.scheduleId);
      if (schedule) {
        await storage.updateScheduleSeats(bookingData.scheduleId, schedule.availableSeats - 1);
      }
      
      // Broadcast booking update via WebSocket
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: 'new_booking',
            booking: booking
          }));
        }
      });
      
      res.json(booking);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: 'Invalid booking data', errors: error.errors });
      } else {
        res.status(500).json({ message: 'Failed to create booking' });
      }
    }
  });

  // Get bookings by schedule (for drivers)
  app.get('/api/schedules/:id/bookings', async (req, res) => {
    try {
      const scheduleId = parseInt(req.params.id);
      const bookings = await storage.getBookingsBySchedule(scheduleId);
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch bookings' });
    }
  });

  // Get passenger bookings
  app.get('/api/passengers/:id/bookings', async (req, res) => {
    try {
      const passengerId = parseInt(req.params.id);
      const bookings = await storage.getBookingsByPassenger(passengerId);
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch passenger bookings' });
    }
  });

  // Update booking payment
  app.patch('/api/bookings/:id/payment', async (req, res) => {
    try {
      const bookingId = parseInt(req.params.id);
      const { paymentMethod, paymentStatus } = req.body;
      
      await storage.updateBookingPayment(bookingId, paymentMethod, paymentStatus);
      
      // Broadcast payment update
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: 'payment_update',
            bookingId,
            paymentMethod,
            paymentStatus
          }));
        }
      });
      
      res.json({ message: 'Payment updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to update payment' });
    }
  });

  // Live tracking
  app.post('/api/tracking', async (req, res) => {
    try {
      const trackingData = insertLiveTrackingSchema.parse(req.body);
      const tracking = await storage.addLiveTracking(trackingData);
      
      // Broadcast location update
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: 'tracking_update',
            scheduleId: tracking.scheduleId,
            location: {
              latitude: tracking.latitude,
              longitude: tracking.longitude
            }
          }));
        }
      });
      
      res.json(tracking);
    } catch (error) {
      res.status(500).json({ message: 'Failed to add tracking data' });
    }
  });

  app.get('/api/tracking/:scheduleId', async (req, res) => {
    try {
      const scheduleId = parseInt(req.params.scheduleId);
      const tracking = await storage.getLiveTracking(scheduleId);
      res.json(tracking);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch tracking data' });
    }
  });

  // Feedback
  app.post('/api/feedback', async (req, res) => {
    try {
      const feedbackData = insertFeedbackSchema.parse(req.body);
      const feedback = await storage.createFeedback(feedbackData);
      res.json(feedback);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: 'Invalid feedback data', errors: error.errors });
      } else {
        res.status(500).json({ message: 'Failed to create feedback' });
      }
    }
  });

  // SMS booking codes
  app.get('/api/sms-codes', async (req, res) => {
    try {
      const codes = await storage.getSmsBookingCodes();
      res.json(codes);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch SMS codes' });
    }
  });

  app.get('/api/sms-codes/:code', async (req, res) => {
    try {
      const code = req.params.code;
      const smsCode = await storage.getSmsBookingCodeByCode(code);
      if (!smsCode) {
        return res.status(404).json({ message: 'SMS code not found' });
      }
      res.json(smsCode);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch SMS code' });
    }
  });

  // Admin dashboard
  app.get('/api/admin/dashboard', async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch dashboard stats' });
    }
  });

  app.get('/api/admin/bookings', async (req, res) => {
    try {
      const bookings = await storage.getBookings();
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch bookings' });
    }
  });

  app.get('/api/admin/feedback', async (req, res) => {
    try {
      const feedback = await storage.getFeedback();
      res.json(feedback);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch feedback' });
    }
  });

  return httpServer;
}

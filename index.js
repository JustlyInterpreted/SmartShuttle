var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  bookings: () => bookings,
  bookingsRelations: () => bookingsRelations,
  cities: () => cities,
  citiesRelations: () => citiesRelations,
  insertBookingSchema: () => insertBookingSchema,
  insertCitySchema: () => insertCitySchema,
  insertRouteSchema: () => insertRouteSchema,
  insertRouteStopSchema: () => insertRouteStopSchema,
  insertShuttleSchema: () => insertShuttleSchema,
  insertUserSchema: () => insertUserSchema,
  routeStops: () => routeStops,
  routeStopsRelations: () => routeStopsRelations,
  routes: () => routes,
  routesRelations: () => routesRelations,
  sessions: () => sessions,
  shuttles: () => shuttles,
  shuttlesRelations: () => shuttlesRelations,
  users: () => users,
  usersRelations: () => usersRelations
});
import {
  pgTable,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  decimal,
  boolean,
  time
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
var sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull()
  },
  (table) => [index("IDX_session_expire").on(table.expire)]
);
var users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role", { enum: ["passenger", "driver", "admin"] }),
  city: varchar("city").default("Ranchi"),
  language: varchar("language", { enum: ["en", "hi"] }).default("en"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var cities = pgTable("cities", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  hindiName: varchar("hindi_name"),
  state: varchar("state").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});
var routes = pgTable("routes", {
  id: serial("id").primaryKey(),
  code: varchar("code").notNull().unique(),
  fromCityId: integer("from_city_id").references(() => cities.id),
  toCityId: integer("to_city_id").references(() => cities.id),
  distance: decimal("distance", { precision: 8, scale: 2 }),
  baseFare: decimal("base_fare", { precision: 8, scale: 2 }),
  duration: integer("duration"),
  // in minutes
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});
var routeStops = pgTable("route_stops", {
  id: serial("id").primaryKey(),
  routeId: integer("route_id").references(() => routes.id),
  stopName: varchar("stop_name").notNull(),
  stopNameHindi: varchar("stop_name_hindi"),
  stopOrder: integer("stop_order").notNull(),
  fare: decimal("fare", { precision: 8, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow()
});
var shuttles = pgTable("shuttles", {
  id: serial("id").primaryKey(),
  routeId: integer("route_id").references(() => routes.id),
  driverId: varchar("driver_id").references(() => users.id),
  vehicleNumber: varchar("vehicle_number").notNull(),
  capacity: integer("capacity").default(24),
  departureTime: time("departure_time").notNull(),
  arrivalTime: time("arrival_time").notNull(),
  status: varchar("status", { enum: ["active", "inactive", "maintenance"] }).default("active"),
  createdAt: timestamp("created_at").defaultNow()
});
var bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  shuttleId: integer("shuttle_id").references(() => shuttles.id),
  fromStopId: integer("from_stop_id").references(() => routeStops.id),
  toStopId: integer("to_stop_id").references(() => routeStops.id),
  seatNumber: varchar("seat_number"),
  fare: decimal("fare", { precision: 8, scale: 2 }),
  bookingDate: timestamp("booking_date").notNull(),
  travelDate: timestamp("travel_date").notNull(),
  status: varchar("status", { enum: ["confirmed", "cancelled", "completed"] }).default("confirmed"),
  paymentStatus: varchar("payment_status", { enum: ["pending", "paid", "refunded"] }).default("pending"),
  paymentMethod: varchar("payment_method", { enum: ["cash", "upi", "card"] }),
  createdAt: timestamp("created_at").defaultNow()
});
var usersRelations = relations(users, ({ many }) => ({
  bookings: many(bookings),
  shuttles: many(shuttles)
}));
var citiesRelations = relations(cities, ({ many }) => ({
  routesFrom: many(routes, { relationName: "fromCity" }),
  routesTo: many(routes, { relationName: "toCity" })
}));
var routesRelations = relations(routes, ({ one, many }) => ({
  fromCity: one(cities, {
    fields: [routes.fromCityId],
    references: [cities.id],
    relationName: "fromCity"
  }),
  toCity: one(cities, {
    fields: [routes.toCityId],
    references: [cities.id],
    relationName: "toCity"
  }),
  stops: many(routeStops),
  shuttles: many(shuttles)
}));
var routeStopsRelations = relations(routeStops, ({ one, many }) => ({
  route: one(routes, {
    fields: [routeStops.routeId],
    references: [routes.id]
  }),
  bookingsFrom: many(bookings, { relationName: "fromStop" }),
  bookingsTo: many(bookings, { relationName: "toStop" })
}));
var shuttlesRelations = relations(shuttles, ({ one, many }) => ({
  route: one(routes, {
    fields: [shuttles.routeId],
    references: [routes.id]
  }),
  driver: one(users, {
    fields: [shuttles.driverId],
    references: [users.id]
  }),
  bookings: many(bookings)
}));
var bookingsRelations = relations(bookings, ({ one }) => ({
  user: one(users, {
    fields: [bookings.userId],
    references: [users.id]
  }),
  shuttle: one(shuttles, {
    fields: [bookings.shuttleId],
    references: [shuttles.id]
  }),
  fromStop: one(routeStops, {
    fields: [bookings.fromStopId],
    references: [routeStops.id],
    relationName: "fromStop"
  }),
  toStop: one(routeStops, {
    fields: [bookings.toStopId],
    references: [routeStops.id],
    relationName: "toStop"
  })
}));
var insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertCitySchema = createInsertSchema(cities).omit({
  id: true,
  createdAt: true
});
var insertRouteSchema = createInsertSchema(routes).omit({
  id: true,
  createdAt: true
});
var insertRouteStopSchema = createInsertSchema(routeStops).omit({
  id: true,
  createdAt: true
});
var insertShuttleSchema = createInsertSchema(shuttles).omit({
  id: true,
  createdAt: true
});
var insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true
});

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/storage.ts
import { eq, and, desc, asc } from "drizzle-orm";
var DatabaseStorage = class {
  // User operations
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  async upsertUser(userData) {
    const [user] = await db.insert(users).values(userData).onConflictDoUpdate({
      target: users.id,
      set: {
        ...userData,
        updatedAt: /* @__PURE__ */ new Date()
      }
    }).returning();
    return user;
  }
  async updateUserRole(id, role) {
    const [user] = await db.update(users).set({ role, updatedAt: /* @__PURE__ */ new Date() }).where(eq(users.id, id)).returning();
    return user;
  }
  // City operations
  async getCities() {
    return await db.select().from(cities).where(eq(cities.isActive, true)).orderBy(asc(cities.name));
  }
  async createCity(cityData) {
    const [city] = await db.insert(cities).values(cityData).returning();
    return city;
  }
  // Route operations
  async getRoutes() {
    return await db.select().from(routes).where(eq(routes.isActive, true));
  }
  async getRouteWithStops(routeId) {
    const [route] = await db.select().from(routes).where(eq(routes.id, routeId));
    if (!route) return void 0;
    const stops = await db.select().from(routeStops).where(eq(routeStops.routeId, routeId)).orderBy(asc(routeStops.stopOrder));
    return { ...route, stops };
  }
  async createRoute(routeData) {
    const [route] = await db.insert(routes).values(routeData).returning();
    return route;
  }
  async createRouteStop(stopData) {
    const [stop] = await db.insert(routeStops).values(stopData).returning();
    return stop;
  }
  // Shuttle operations
  async getShuttles() {
    return await db.select().from(shuttles).where(eq(shuttles.status, "active"));
  }
  async getShuttlesByRoute(routeId) {
    return await db.select().from(shuttles).where(and(eq(shuttles.routeId, routeId), eq(shuttles.status, "active"))).orderBy(asc(shuttles.departureTime));
  }
  async createShuttle(shuttleData) {
    const [shuttle] = await db.insert(shuttles).values(shuttleData).returning();
    return shuttle;
  }
  // Booking operations
  async getBookings() {
    return await db.select().from(bookings).orderBy(desc(bookings.createdAt));
  }
  async getBookingsByUser(userId) {
    return await db.select().from(bookings).where(eq(bookings.userId, userId)).orderBy(desc(bookings.createdAt));
  }
  async getBookingsByShuttle(shuttleId) {
    return await db.select().from(bookings).where(eq(bookings.shuttleId, shuttleId)).orderBy(asc(bookings.seatNumber));
  }
  async createBooking(bookingData) {
    const [booking] = await db.insert(bookings).values(bookingData).returning();
    return booking;
  }
  async getAvailableSeats(shuttleId) {
    const [shuttle] = await db.select().from(shuttles).where(eq(shuttles.id, shuttleId));
    if (!shuttle || !shuttle.capacity) return 0;
    const bookedSeats = await db.select().from(bookings).where(and(eq(bookings.shuttleId, shuttleId), eq(bookings.status, "confirmed")));
    return shuttle.capacity - bookedSeats.length;
  }
};
var storage = new DatabaseStorage();

// server/replitAuth.ts
import * as client from "openid-client";
import { Strategy } from "openid-client/passport";
import passport from "passport";
import session from "express-session";
import memoize from "memoizee";
import connectPg from "connect-pg-simple";
if (!process.env.REPLIT_DOMAINS) {
  throw new Error("Environment variable REPLIT_DOMAINS not provided");
}
var getOidcConfig = memoize(
  async () => {
    return await client.discovery(
      new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"),
      process.env.REPL_ID
    );
  },
  { maxAge: 3600 * 1e3 }
);
function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1e3;
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions"
  });
  return session({
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: true,
      maxAge: sessionTtl
    }
  });
}
function updateUserSession(user, tokens) {
  user.claims = tokens.claims();
  user.access_token = tokens.access_token;
  user.refresh_token = tokens.refresh_token;
  user.expires_at = user.claims?.exp;
}
async function upsertUser(claims) {
  await storage.upsertUser({
    id: claims["sub"],
    email: claims["email"],
    firstName: claims["first_name"],
    lastName: claims["last_name"],
    profileImageUrl: claims["profile_image_url"]
  });
}
async function setupAuth(app2) {
  app2.set("trust proxy", 1);
  app2.use(getSession());
  app2.use(passport.initialize());
  app2.use(passport.session());
  const config = await getOidcConfig();
  const verify = async (tokens, verified) => {
    const user = {};
    updateUserSession(user, tokens);
    await upsertUser(tokens.claims());
    verified(null, user);
  };
  for (const domain of process.env.REPLIT_DOMAINS.split(",")) {
    const strategy = new Strategy(
      {
        name: `replitauth:${domain}`,
        config,
        scope: "openid email profile offline_access",
        callbackURL: `https://${domain}/api/callback`
      },
      verify
    );
    passport.use(strategy);
  }
  passport.serializeUser((user, cb) => cb(null, user));
  passport.deserializeUser((user, cb) => cb(null, user));
  app2.get("/api/login", (req, res, next) => {
    passport.authenticate(`replitauth:${req.hostname}`, {
      prompt: "login consent",
      scope: ["openid", "email", "profile", "offline_access"]
    })(req, res, next);
  });
  app2.get("/api/callback", (req, res, next) => {
    passport.authenticate(`replitauth:${req.hostname}`, {
      successReturnToOrRedirect: "/",
      failureRedirect: "/api/login"
    })(req, res, next);
  });
  app2.get("/api/logout", (req, res) => {
    req.logout(() => {
      res.redirect(
        client.buildEndSessionUrl(config, {
          client_id: process.env.REPL_ID,
          post_logout_redirect_uri: `${req.protocol}://${req.hostname}`
        }).href
      );
    });
  });
}
var isAuthenticated = async (req, res, next) => {
  const user = req.user;
  if (!req.isAuthenticated() || !user.expires_at) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const now = Math.floor(Date.now() / 1e3);
  if (now <= user.expires_at) {
    return next();
  }
  const refreshToken = user.refresh_token;
  if (!refreshToken) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  try {
    const config = await getOidcConfig();
    const tokenResponse = await client.refreshTokenGrant(config, refreshToken);
    updateUserSession(user, tokenResponse);
    return next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
};

// server/routes.ts
async function registerRoutes(app2) {
  await setupAuth(app2);
  app2.get("/api/auth/user", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  app2.post("/api/auth/role", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const { role } = req.body;
      if (!["passenger", "driver", "admin"].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }
      const user = await storage.updateUserRole(userId, role);
      res.json(user);
    } catch (error) {
      console.error("Error updating user role:", error);
      res.status(500).json({ message: "Failed to update role" });
    }
  });
  app2.get("/api/cities", async (req, res) => {
    try {
      const cities2 = await storage.getCities();
      res.json(cities2);
    } catch (error) {
      console.error("Error fetching cities:", error);
      res.status(500).json({ message: "Failed to fetch cities" });
    }
  });
  app2.post("/api/cities", isAuthenticated, async (req, res) => {
    try {
      const cityData = insertCitySchema.parse(req.body);
      const city = await storage.createCity(cityData);
      res.json(city);
    } catch (error) {
      console.error("Error creating city:", error);
      res.status(500).json({ message: "Failed to create city" });
    }
  });
  app2.get("/api/routes", async (req, res) => {
    try {
      const routes2 = await storage.getRoutes();
      res.json(routes2);
    } catch (error) {
      console.error("Error fetching routes:", error);
      res.status(500).json({ message: "Failed to fetch routes" });
    }
  });
  app2.get("/api/routes/:id", async (req, res) => {
    try {
      const routeId = parseInt(req.params.id);
      const route = await storage.getRouteWithStops(routeId);
      if (!route) {
        return res.status(404).json({ message: "Route not found" });
      }
      res.json(route);
    } catch (error) {
      console.error("Error fetching route:", error);
      res.status(500).json({ message: "Failed to fetch route" });
    }
  });
  app2.post("/api/routes", isAuthenticated, async (req, res) => {
    try {
      const routeData = insertRouteSchema.parse(req.body);
      const route = await storage.createRoute(routeData);
      res.json(route);
    } catch (error) {
      console.error("Error creating route:", error);
      res.status(500).json({ message: "Failed to create route" });
    }
  });
  app2.get("/api/shuttles", async (req, res) => {
    try {
      const { routeId } = req.query;
      let shuttles2;
      if (routeId) {
        shuttles2 = await storage.getShuttlesByRoute(parseInt(routeId));
      } else {
        shuttles2 = await storage.getShuttles();
      }
      res.json(shuttles2);
    } catch (error) {
      console.error("Error fetching shuttles:", error);
      res.status(500).json({ message: "Failed to fetch shuttles" });
    }
  });
  app2.post("/api/shuttles", isAuthenticated, async (req, res) => {
    try {
      const shuttleData = insertShuttleSchema.parse(req.body);
      const shuttle = await storage.createShuttle(shuttleData);
      res.json(shuttle);
    } catch (error) {
      console.error("Error creating shuttle:", error);
      res.status(500).json({ message: "Failed to create shuttle" });
    }
  });
  app2.get("/api/bookings", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const bookings2 = await storage.getBookingsByUser(userId);
      res.json(bookings2);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });
  app2.get("/api/bookings/shuttle/:shuttleId", isAuthenticated, async (req, res) => {
    try {
      const shuttleId = parseInt(req.params.shuttleId);
      const bookings2 = await storage.getBookingsByShuttle(shuttleId);
      res.json(bookings2);
    } catch (error) {
      console.error("Error fetching shuttle bookings:", error);
      res.status(500).json({ message: "Failed to fetch shuttle bookings" });
    }
  });
  app2.post("/api/bookings", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const bookingData = insertBookingSchema.parse({
        ...req.body,
        userId,
        bookingDate: /* @__PURE__ */ new Date()
      });
      const booking = await storage.createBooking(bookingData);
      res.json(booking);
    } catch (error) {
      console.error("Error creating booking:", error);
      res.status(500).json({ message: "Failed to create booking" });
    }
  });
  app2.get("/api/shuttles/:shuttleId/seats", async (req, res) => {
    try {
      const shuttleId = parseInt(req.params.shuttleId);
      const availableSeats = await storage.getAvailableSeats(shuttleId);
      res.json({ availableSeats });
    } catch (error) {
      console.error("Error fetching seat availability:", error);
      res.status(500).json({ message: "Failed to fetch seat availability" });
    }
  });
  app2.get("/api/admin/bookings", isAuthenticated, async (req, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (user?.role !== "admin") {
        return res.status(403).json({ message: "Access denied" });
      }
      const bookings2 = await storage.getBookings();
      res.json(bookings2);
    } catch (error) {
      console.error("Error fetching admin bookings:", error);
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();

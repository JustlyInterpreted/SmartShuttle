# Setu - Smart Shuttle Service

## Overview

Setu is a comprehensive shuttle service application built with a modern full-stack architecture. The application serves passengers, drivers, and administrators with distinct interfaces for booking rides, managing operations, and overseeing the entire shuttle service network. The system focuses on real-time tracking, efficient booking management, and seamless communication between all stakeholders.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management
- **UI Components**: Radix UI with shadcn/ui component library
- **Styling**: Tailwind CSS with custom design tokens
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **Real-time Communication**: WebSocket server for live updates
- **API Design**: RESTful endpoints with structured error handling
- **Request Logging**: Custom middleware for API request tracking

### Database Strategy
- **ORM**: Drizzle ORM with TypeScript-first approach
- **Database**: PostgreSQL (configured for Neon serverless)
- **Migrations**: Drizzle Kit for schema management
- **Connection**: Neon serverless driver for serverless-optimized connections

## Key Components

### Multi-Role User Interface
The application supports three distinct user roles:
- **Passengers**: Book rides, track shuttles, manage trips
- **Drivers**: View passenger lists, scan QR codes, manage routes
- **Administrators**: Oversee operations, manage routes, view analytics

### Real-time Features
- **Live Tracking**: WebSocket-based location updates for shuttles
- **Booking Updates**: Real-time notifications for booking status changes
- **Driver Communication**: Live passenger boarding notifications

### Booking System
- **Search & Filter**: Multi-criteria search with time preferences
- **Seat Selection**: Interactive seat grid with availability tracking
- **Payment Integration**: Multiple payment methods including UPI, cards, and cash
- **SMS Booking**: Alternative booking method via SMS codes

### Mobile-First Design
- **Responsive Layout**: Optimized for mobile devices with touch interactions
- **Progressive Web App**: Service worker ready for offline capabilities
- **Native-like Experience**: Bottom navigation and app bar patterns

## Data Flow

### Booking Process
1. **Search**: Passengers search for routes with date/time preferences
2. **Selection**: Available schedules are displayed with real-time seat availability
3. **Seat Assignment**: Interactive seat selection with visual feedback
4. **Payment**: Multiple payment options with secure processing
5. **Confirmation**: Booking confirmation with QR code generation

### Real-time Updates
1. **Location Tracking**: GPS coordinates broadcast via WebSocket
2. **Passenger Updates**: Boarding status and location sharing
3. **Driver Notifications**: Real-time passenger and route updates
4. **Administrative Monitoring**: Live dashboard with operational metrics

### Data Synchronization
- **Optimistic Updates**: Immediate UI feedback with server reconciliation
- **Conflict Resolution**: Last-write-wins strategy for concurrent updates
- **Offline Support**: Local storage for critical booking information

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL connection
- **@tanstack/react-query**: Server state management and caching
- **@radix-ui/react-***: Accessible UI component primitives
- **drizzle-orm**: Type-safe database operations
- **ws**: WebSocket server implementation
- **express**: Web application framework

### Development Tools
- **Vite**: Build tool with hot module replacement
- **TypeScript**: Static type checking
- **Tailwind CSS**: Utility-first styling
- **ESLint**: Code linting and formatting

### Authentication & Security
- **Session Management**: Connect-pg-simple for PostgreSQL session storage
- **Input Validation**: Zod for runtime type validation
- **SQL Injection Prevention**: Parameterized queries via Drizzle ORM

## Deployment Strategy

### Development Environment
- **Hot Reloading**: Vite dev server with Express middleware
- **Database**: Local PostgreSQL or Neon development database
- **WebSocket**: Development WebSocket server on same port

### Production Build
- **Frontend**: Static assets built with Vite
- **Backend**: Bundled with esbuild for Node.js runtime
- **Database**: Neon serverless PostgreSQL
- **Process Management**: Single Node.js process serving both API and static files

### Configuration Management
- **Environment Variables**: DATABASE_URL for database connection
- **Build Scripts**: Separate development and production configurations
- **Asset Optimization**: Automatic code splitting and minification

### Scalability Considerations
- **Database Connections**: Serverless-optimized connection pooling
- **WebSocket Scaling**: Single instance with potential for Redis pub/sub
- **Caching Strategy**: TanStack Query for client-side caching
- **CDN Ready**: Static assets optimized for content delivery networks

The architecture prioritizes developer experience with TypeScript throughout, real-time capabilities for enhanced user experience, and a mobile-first approach suitable for the target shuttle service use case.
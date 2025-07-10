import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  BarChart3, 
  Route, 
  Ticket, 
  Users, 
  IndianRupee, 
  Star, 
  Bell, 
  Shield,
  TrendingUp,
  TrendingDown,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import AppBar from "@/components/ui/app-bar";
import BottomNav from "@/components/ui/bottom-nav";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();

  const { data: dashboardStats, isLoading } = useQuery({
    queryKey: ['/api/admin/dashboard'],
  });

  const { data: recentFeedback } = useQuery({
    queryKey: ['/api/admin/feedback'],
  });

  // Mock data for demonstration
  const stats = dashboardStats || {
    todayBookings: 142,
    activeShuttles: 18,
    todayRevenue: 28500,
    averageRating: 4.8,
  };

  const liveRoutes = [
    {
      id: 1,
      name: "Ranchi → Bokaro",
      shuttles: 5,
      status: "normal",
      capacity: "85%",
      trend: "up",
    },
    {
      id: 2,
      name: "Ranchi → Dhanbad", 
      shuttles: 3,
      status: "high-demand",
      capacity: "95%",
      trend: "up",
    },
    {
      id: 3,
      name: "Ranchi → Tata",
      shuttles: 1,
      status: "delayed",
      capacity: "60%",
      trend: "down",
      delay: "15 min",
    },
  ];

  const feedbackItems = recentFeedback || [
    {
      id: 1,
      rating: 5,
      comment: "Excellent service! Clean shuttle, punctual driver. Great experience!",
      passenger: "Rahul K.",
      timeAgo: "2 hours ago",
    },
    {
      id: 2,
      rating: 4,
      comment: "Good but can improve. WiFi not working, but otherwise good service.",
      passenger: "Priya S.",
      timeAgo: "4 hours ago",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return 'bg-success text-white';
      case 'high-demand':
        return 'bg-warning text-white';
      case 'delayed':
        return 'bg-destructive text-white';
      default:
        return 'bg-gray-300 text-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'normal':
        return 'Normal';
      case 'high-demand':
        return 'High Demand';
      case 'delayed':
        return 'Delayed';
      default:
        return 'Unknown';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < rating ? 'fill-current text-warning' : 'text-gray-300'}`} 
      />
    ));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <AppBar title="Admin Dashboard" />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <AppBar 
        title="Admin Dashboard"
        actions={
          <div className="flex items-center space-x-4">
            <Bell className="w-6 h-6 text-primary-foreground" />
            <Shield className="w-6 h-6 text-primary-foreground" />
          </div>
        }
      />

      <div className="p-4 space-y-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="elevation-1">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-800">{stats.todayBookings}</p>
                  <p className="text-sm text-gray-600">Today's Bookings</p>
                </div>
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <Ticket className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="mt-2 flex items-center">
                <TrendingUp className="w-4 h-4 text-success mr-1" />
                <span className="text-success text-sm">+12% from yesterday</span>
              </div>
            </CardContent>
          </Card>

          <Card className="elevation-1">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-800">{stats.activeShuttles}</p>
                  <p className="text-sm text-gray-600">Active Shuttles</p>
                </div>
                <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
                  <i className="fas fa-bus text-white"></i>
                </div>
              </div>
              <div className="mt-2">
                <span className="text-success text-sm">All operational</span>
              </div>
            </CardContent>
          </Card>

          <Card className="elevation-1">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-800">₹{(stats.todayRevenue / 1000).toFixed(1)}K</p>
                  <p className="text-sm text-gray-600">Today's Revenue</p>
                </div>
                <div className="w-12 h-12 bg-success rounded-full flex items-center justify-center">
                  <IndianRupee className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="mt-2 flex items-center">
                <TrendingUp className="w-4 h-4 text-success mr-1" />
                <span className="text-success text-sm">+8% from yesterday</span>
              </div>
            </CardContent>
          </Card>

          <Card className="elevation-1">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-800">{stats.averageRating}</p>
                  <p className="text-sm text-gray-600">Avg Rating</p>
                </div>
                <div className="w-12 h-12 bg-warning rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="mt-2 flex items-center">
                <TrendingUp className="w-4 h-4 text-success mr-1" />
                <span className="text-success text-sm">+0.2 from last week</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="elevation-1">
          <CardHeader>
            <CardTitle className="text-lg font-medium text-gray-800">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="grid grid-cols-2 gap-3">
              <Button 
                onClick={() => setLocation('/manage-routes')}
                className="bg-primary text-white hover:bg-primary/90 flex flex-col items-center p-3 h-auto"
              >
                <Route className="w-6 h-6 mb-1" />
                <span className="text-sm">Manage Routes</span>
              </Button>
              <Button 
                onClick={() => setLocation('/manage-drivers')}
                className="bg-secondary text-white hover:bg-secondary/90 flex flex-col items-center p-3 h-auto"
              >
                <Users className="w-6 h-6 mb-1" />
                <span className="text-sm">Manage Drivers</span>
              </Button>
              <Button 
                onClick={() => setLocation('/bookings')}
                variant="outline"
                className="flex flex-col items-center p-3 h-auto text-success border-success hover:bg-success hover:text-white"
              >
                <Ticket className="w-6 h-6 mb-1" />
                <span className="text-sm">View Bookings</span>
              </Button>
              <Button 
                onClick={() => setLocation('/reports')}
                variant="outline"
                className="flex flex-col items-center p-3 h-auto text-warning border-warning hover:bg-warning hover:text-white"
              >
                <BarChart3 className="w-6 h-6 mb-1" />
                <span className="text-sm">Reports</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Live Route Status */}
        <Card className="elevation-1">
          <CardHeader>
            <CardTitle className="text-lg font-medium text-gray-800">Live Route Status</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="space-y-3">
              {liveRoutes.map((route) => (
                <div key={route.id} className={`p-3 rounded-lg ${
                  route.status === 'normal' ? 'bg-green-50' :
                  route.status === 'high-demand' ? 'bg-yellow-50' : 'bg-red-50'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-800">{route.name}</p>
                      <p className="text-sm text-gray-600">{route.shuttles} shuttles active</p>
                      {route.delay && (
                        <p className="text-sm text-destructive flex items-center">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          {route.delay} delay
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(route.status)}>
                        {getStatusText(route.status)}
                      </Badge>
                      <p className="text-xs text-gray-600 mt-1">{route.capacity} capacity</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Feedback */}
        <Card className="elevation-1">
          <CardHeader>
            <CardTitle className="text-lg font-medium text-gray-800">Recent Feedback</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="space-y-3">
              {feedbackItems.map((feedback) => (
                <div key={feedback.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-800">
                      {feedback.comment.length > 30 
                        ? feedback.comment.substring(0, 30) + '...' 
                        : feedback.comment}
                    </span>
                    <div className="flex">
                      {renderStars(feedback.rating)}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{feedback.comment}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    - {feedback.passenger} ({feedback.timeAgo})
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNav userRole="admin" />
    </div>
  );
}

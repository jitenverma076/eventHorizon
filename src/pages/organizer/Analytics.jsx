import { useEffect, useState } from "react"
import { Calendar, DollarSign, Users, TrendingUp, Eye, Share2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const Analytics = () => {
  const [analytics, setAnalytics] = useState({
    overview: {
      totalEvents: 0,
      totalBookings: 0,
      totalRevenue: 0,
      totalTicketsSold: 0,
      averageRevenuePerEvent: 0,
    },
    revenueByMonth: [],
    eventPerformance: [],
    bookingStatusStats: {
      confirmed: 0,
      cancelled: 0,
      refunded: 0,
    },
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data for now - replace with actual API call
    setTimeout(() => {
      setAnalytics({
        overview: {
          totalEvents: 12,
          totalBookings: 156,
          totalRevenue: 15420,
          totalTicketsSold: 234,
          averageRevenuePerEvent: 1285,
        },
        revenueByMonth: [
          { month: "Jan 2024", revenue: 2400, bookings: 24 },
          { month: "Feb 2024", revenue: 1398, bookings: 18 },
          { month: "Mar 2024", revenue: 9800, bookings: 45 },
          { month: "Apr 2024", revenue: 3908, bookings: 32 },
          { month: "May 2024", revenue: 4800, bookings: 28 },
          { month: "Jun 2024", revenue: 3800, bookings: 35 },
        ],
        eventPerformance: [
          {
            eventId: "1",
            title: "Summer Music Festival",
            revenue: 8500,
            ticketsSold: 120,
            bookings: 45,
            capacity: 150,
            occupancyRate: 80,
          },
          {
            eventId: "2",
            title: "Tech Conference 2024",
            revenue: 4200,
            ticketsSold: 85,
            bookings: 32,
            capacity: 100,
            occupancyRate: 85,
          },
          {
            eventId: "3",
            title: "Food & Wine Expo",
            revenue: 2720,
            ticketsSold: 68,
            bookings: 28,
            capacity: 80,
            occupancyRate: 85,
          },
        ],
        bookingStatusStats: {
          confirmed: 142,
          cancelled: 8,
          refunded: 6,
        },
      })
      setLoading(false)
    }, 1000)
  }, [])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="h-32 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-64 bg-gray-200 rounded-lg"></div>
                <div className="h-64 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-2">Track your event performance and revenue</p>
          </div>

          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Calendar className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Events</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.overview.totalEvents}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.overview.totalBookings}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <DollarSign className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(analytics.overview.totalRevenue)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <TrendingUp className="h-8 w-8 text-orange-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Avg Revenue/Event</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(analytics.overview.averageRevenuePerEvent)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Revenue by Month */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.revenueByMonth.map((month, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{month.month}</p>
                        <p className="text-sm text-gray-600">{month.bookings} bookings</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{formatCurrency(month.revenue)}</p>
                        <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(month.revenue / 10000) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Booking Status */}
            <Card>
              <CardHeader>
                <CardTitle>Booking Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-green-600 font-medium">Confirmed</span>
                    <span className="font-bold">{analytics.bookingStatusStats.confirmed}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-yellow-600 font-medium">Cancelled</span>
                    <span className="font-bold">{analytics.bookingStatusStats.cancelled}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-red-600 font-medium">Refunded</span>
                    <span className="font-bold">{analytics.bookingStatusStats.refunded}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Performing Events */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.eventPerformance.map((event, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{event.title}</h4>
                      <span className="text-lg font-bold text-green-600">{formatCurrency(event.revenue)}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                      <div>
                        <p>Tickets Sold</p>
                        <p className="font-medium">{event.ticketsSold} / {event.capacity}</p>
                      </div>
                      <div>
                        <p>Bookings</p>
                        <p className="font-medium">{event.bookings}</p>
                      </div>
                      <div>
                        <p>Occupancy Rate</p>
                        <p className="font-medium">{event.occupancyRate}%</p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${event.occupancyRate}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Analytics
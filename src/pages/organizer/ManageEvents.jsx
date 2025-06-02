import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Calendar, MapPin, Users, Edit, Trash2, Plus, Eye } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import eventService from "@/services/eventService"
import { formatDate, formatCurrency } from "@/lib/utils"

const ManageEvents = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await eventService.getMyEvents()
      setEvents(response.data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch events",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteEvent = async (eventId) => {
    if (!confirm("Are you sure you want to delete this event?")) {
      return
    }

    try {
      await eventService.deleteEvent(eventId)
      toast({
        title: "Event Deleted",
        description: "Event has been deleted successfully",
      })
      fetchEvents() // Refresh the list
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete event",
        variant: "destructive",
      })
    }
  }

  const getEventStatus = (event) => {
    const now = new Date()
    const startDate = new Date(event.dateTime.start)
    const endDate = new Date(event.dateTime.end)

    if (event.status === 'cancelled') return 'cancelled'
    if (now > endDate) return 'completed'
    if (now >= startDate && now <= endDate) return 'ongoing'
    if (now < startDate) return 'upcoming'
    return 'draft'
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800'
      case 'draft': return 'bg-yellow-100 text-yellow-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      case 'ongoing': return 'bg-blue-100 text-blue-800'
      case 'upcoming': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="h-64 bg-gray-200 rounded-lg"></div>
                ))}
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
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manage Events</h1>
              <p className="text-gray-600 mt-2">Create and manage your events</p>
            </div>
            <Button asChild>
              <Link to="/organizer/create-event">
                <Plus className="h-4 w-4 mr-2" />
                Create Event
              </Link>
            </Button>
          </div>

          {/* Events Grid */}
          {events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => {
                const eventStatus = getEventStatus(event)
                const totalSeats = event.ticketTiers?.reduce((sum, tier) => sum + tier.totalSeats, 0) || 0
                const availableSeats = event.ticketTiers?.reduce((sum, tier) => sum + tier.availableSeats, 0) || 0
                const soldSeats = totalSeats - availableSeats

                return (
                  <Card key={event._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <img
                        src={event.images?.[0]?.url || `/placeholder.svg?height=200&width=400`}
                        alt={event.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                          {event.status}
                        </span>
                      </div>
                      <div className="absolute top-4 right-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(eventStatus)}`}>
                          {eventStatus}
                        </span>
                      </div>
                    </div>

                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">{event.title}</h3>

                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>{formatDate(event.dateTime.start)}</span>
                        </div>

                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span className="truncate">{event.venue.name}, {event.venue.address.city}</span>
                        </div>

                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2" />
                          <span>{soldSeats} / {totalSeats} tickets sold</span>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button asChild variant="outline" size="sm" className="flex-1">
                          <Link to={`/events/${event._id}`}>
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDeleteEvent(event._id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No events yet</h3>
              <p className="text-gray-600 mb-6">Create your first event to get started</p>
              <Button asChild>
                <Link to="/organizer/create-event">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Event
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ManageEvents
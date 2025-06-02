import { useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { Calendar, MapPin, Users, Clock, Share2, Heart } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEvents } from "@/context/EventContext"
import { useAuth } from "@/context/AuthContext"
import { formatDate, formatDateTime, formatCurrency } from "@/lib/utils"

const EventDetail = () => {
  const { id } = useParams()
  const { currentEvent, fetchEvent, loading } = useEvents()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (id) {
      fetchEvent(id)
    }
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!currentEvent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Event not found</h2>
          <Link to="/events">
            <Button>Back to Events</Button>
          </Link>
        </div>
      </div>
    )
  }

  const getLowestPrice = () => {
    if (!currentEvent.ticketTiers || currentEvent.ticketTiers.length === 0) return 0
    return Math.min(...currentEvent.ticketTiers.map((tier) => tier.price.current || tier.price.base))
  }

  const getTotalCapacity = () => {
    if (!currentEvent.ticketTiers || currentEvent.ticketTiers.length === 0) return 0
    return currentEvent.ticketTiers.reduce((total, tier) => total + tier.totalSeats, 0)
  }

  const getAvailableSeats = () => {
    if (!currentEvent.ticketTiers || currentEvent.ticketTiers.length === 0) return 0
    return currentEvent.ticketTiers.reduce((total, tier) => total + tier.availableSeats, 0)
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-r from-blue-900 to-purple-900"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${currentEvent.images?.[0]?.url || '/placeholder.svg?height=400&width=800'})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="relative z-10 text-white py-20">
          <div className="container mx-auto">
            <div className="flex items-center space-x-2 mb-4">
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                {currentEvent.category}
              </span>
              {getAvailableSeats() === 0 && (
                <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">Sold Out</span>
              )}
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">{currentEvent.title}</h1>
            <div className="flex flex-wrap items-center text-white space-x-6">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                <span>{formatDateTime(currentEvent.dateTime.start)}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                <span>
                  {currentEvent.venue.name}, {currentEvent.venue.address.city}
                </span>
              </div>
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                <span>
                  {getAvailableSeats()} / {getTotalCapacity()} seats available
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>About This Event</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{currentEvent.description}</p>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="font-medium">Date & Time</p>
                    <p className="text-gray-600">
                      {formatDateTime(currentEvent.dateTime.start)} - {formatDateTime(currentEvent.dateTime.end)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="font-medium">Venue</p>
                    <p className="text-gray-600">
                      {currentEvent.venue.name}
                      <br />
                      {currentEvent.venue.address.street}, {currentEvent.venue.address.city},{" "}
                      {currentEvent.venue.address.state}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="font-medium">Organizer</p>
                    <p className="text-gray-600">{currentEvent.organizer?.name}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div>
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Tickets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentEvent.ticketTiers?.map((tier, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold">{tier.name}</h4>
                        <span className="text-lg font-bold text-blue-600">
                          {formatCurrency(tier.price.current || tier.price.base)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {tier.availableSeats} of {tier.totalSeats} available
                      </p>
                      {tier.perks && tier.perks.length > 0 && (
                        <ul className="text-sm text-gray-600 mb-3">
                          {tier.perks.map((perk, perkIndex) => (
                            <li key={perkIndex} className="flex items-center">
                              <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                              {perk}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}

                  <div className="pt-4 border-t">
                    <p className="text-sm text-gray-600 mb-4">
                      Starting from <span className="font-bold text-lg">{formatCurrency(getLowestPrice())}</span>
                    </p>

                    {getAvailableSeats() > 0 ? (
                      <Button asChild className="w-full" size="lg">
                        <Link to={isAuthenticated ? `/booking/${currentEvent._id}` : "/login"}>
                          {isAuthenticated ? "Book Now" : "Login to Book"}
                        </Link>
                      </Button>
                    ) : (
                      <Button className="w-full" size="lg" disabled>
                        Sold Out
                      </Button>
                    )}

                    <div className="flex space-x-2 mt-4">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Heart className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventDetail
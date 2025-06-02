import { Link } from "react-router-dom"
import { Calendar, MapPin, Users, DollarSign } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatDate, formatCurrency } from "@/lib/utils"

const EventCard = ({ event }) => {
  const getLowestPrice = () => {
    if (!event.ticketTiers || event.ticketTiers.length === 0) return 0
    return Math.min(...event.ticketTiers.map((tier) => tier.price.current || tier.price.base))
  }

  const getTotalCapacity = () => {
    if (!event.ticketTiers || event.ticketTiers.length === 0) return 0
    return event.ticketTiers.reduce((total, tier) => total + tier.totalSeats, 0)
  }

  const getAvailableSeats = () => {
    if (!event.ticketTiers || event.ticketTiers.length === 0) return 0
    return event.ticketTiers.reduce((total, tier) => total + tier.availableSeats, 0)
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100/60 bg-white/90 backdrop-blur-sm">
      <div className="relative">
        <img
          src={event.images?.[0]?.url || `/placeholder.svg?height=200&width=400`}
          alt={event.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-gradient-to-r from-blue-700 to-purple-700 text-white px-3 py-1 rounded-full text-xs font-medium shadow-sm">{event.category}</span>
        </div>
        {getAvailableSeats() === 0 && (
          <div className="absolute top-4 right-4">
            <span className="bg-red-600/90 text-white px-3 py-1 rounded-full text-xs font-medium shadow-sm backdrop-blur-sm">Sold Out</span>
          </div>
        )}
      </div>

      <CardContent className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-700 transition-colors">{event.title}</h3>

        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{formatDate(event.dateTime.start)}</span>
          </div>

          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2" />
            <span className="truncate">
              {event.venue.name}, {event.venue.address.city}
            </span>
          </div>

          <div className="flex items-center">
            <Users className="h-4 w-4 mr-2" />
            <span>
              {getAvailableSeats()} / {getTotalCapacity()} seats available
            </span>
          </div>

          <div className="flex items-center">
            <DollarSign className="h-4 w-4 mr-2" />
            <span className="font-medium text-blue-700">From {formatCurrency(getLowestPrice())}</span>
          </div>
        </div>

        <p className="text-gray-600 mt-3 text-sm line-clamp-2">{event.description}</p>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Button asChild className="w-full bg-gradient-to-r from-blue-700 to-purple-700 hover:from-blue-800 hover:to-purple-800 text-white transition-all duration-300 shadow-sm hover:shadow-md">
          <Link to={`/events/${event._id}`}>{getAvailableSeats() > 0 ? "View Details" : "Join Waitlist"}</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

export default EventCard

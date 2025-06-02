import { useEffect, useState } from "react"
import { Search, Filter, MapPin, CalendarIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { useEvents } from "@/context/EventContext"
import EventCard from "@/components/events/EventCard"

const Events = () => {
  const { events, fetchEvents, loading, filters, updateFilters, pagination } = useEvents()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedCity, setSelectedCity] = useState("")

  const categories = ["music", "sports", "technology", "business", "arts", "food", "education", "other"]

  useEffect(() => {
    fetchEvents(1, false)
  }, [filters])

  const handleSearch = () => {
    updateFilters({
      search: searchTerm,
      category: selectedCategory,
      city: selectedCity,
    })
  }

  const handleLoadMore = () => {
    if (pagination.hasNext) {
      fetchEvents(pagination.page + 1, true)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-0" />
        <div className="container mx-auto px-4 py-8 relative z-10">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-purple-700 mb-4">Discover Events</h1>
          <p className="text-lg text-gray-600 mb-6">Find amazing events happening around you</p>

          {/* Search and Filters */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-gray-100/50">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>

              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="City"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Button onClick={handleSearch} className="w-full bg-gradient-to-r from-blue-700 to-purple-700 hover:from-blue-800 hover:to-purple-800 text-white transition-all duration-300 shadow-sm hover:shadow-md">
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="container mx-auto px-4 py-8">
        {loading && events.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="animate-pulse">
                <div className="h-48 bg-gray-300 rounded-t-lg"></div>
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : events.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>

            {pagination.hasNext && (
              <div className="text-center mt-12">
                <Button 
                  onClick={handleLoadMore} 
                  disabled={loading} 
                  size="lg"
                  className="bg-gradient-to-r from-blue-700 to-purple-700 hover:from-blue-800 hover:to-purple-800 text-white transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  {loading ? "Loading..." : "Load More Events"}
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <CalendarIcon className="h-16 w-16 text-blue-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Events
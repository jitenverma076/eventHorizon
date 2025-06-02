import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Calendar, Star, ArrowRight, Search, Sparkles, Zap, TrendingUp, PartyPopper, Ticket } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useEvents } from "@/context/EventContext"
import EventCard from "@/components/events/EventCard"
import Hero from "@/components/home/Hero"
import Categories from "@/components/home/Categories"
import Stats from "@/components/home/Stats"

const Home = () => {
  const { events, fetchEvents, loading } = useEvents()
  const [featuredEvents, setFeaturedEvents] = useState([])

  useEffect(() => {
    // Fetch featured events (latest 6)
    fetchEvents(1, false)
  }, [])

  useEffect(() => {
    if (events.length > 0) {
      setFeaturedEvents(events.slice(0, 6))
    }
  }, [events])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Stats Section */}
      <Stats />

      {/* Categories Section */}
      <Categories />

      {/* Featured Events */}
      <section className="py-16 relative">
        <div className="absolute inset-0 -z-10 bg-white/80 backdrop-blur-sm" />
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-block mb-4 px-3 py-1 rounded-full bg-white/70 backdrop-blur-sm border border-purple-100 shadow-sm">
              <span className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                <Sparkles className="h-3 w-3 mr-1" />
                Trending Now
              </span>
            </div>
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent mb-4">Featured Events</h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Discover amazing events happening around you. From concerts to workshops, find your next adventure.
            </p>
          </div>

          {loading ? (
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
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredEvents.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Button 
              asChild 
              size="lg"
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 px-6 py-6 rounded-xl"
            >
              <Link to="/events" className="flex items-center">
                View All Events
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </section>



      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        {/* Background gradient and decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-30"></div>
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
        <div className="absolute bottom-20 left-10 w-64 h-64 bg-secondary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100/50 p-10 hover:shadow-2xl transition-all duration-500">
            <div className="text-center">
              <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 shadow-sm">
                <span className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Join 10,000+ Event Enthusiasts
                </span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent mb-4">
                Ready to Transform Your Event Experience?
              </h2>
              
              <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
                Discover exclusive events, connect with like-minded individuals, and create memories that last a lifetime. Your next unforgettable experience is just a click away.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  asChild 
                  size="lg" 
                  className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 px-8 py-6 rounded-xl"
                >
                  <Link to="/register" className="flex items-center">
                    <Ticket className="mr-2 h-5 w-5" />
                    Get Started Now
                  </Link>
                </Button>
                
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-primary/30 text-primary hover:bg-primary/5 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 px-8 py-6 rounded-xl"
                >
                  <Link to="/events" className="flex items-center">
                    <Calendar className="mr-2 h-5 w-5" />
                    Explore Events
                  </Link>
                </Button>
              </div>
              
              <div className="mt-8 text-gray-500 text-sm flex items-center justify-center">
                <Sparkles className="h-3 w-3 mr-1 text-primary" />
                <span>Join today and get access to exclusive member-only events</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home

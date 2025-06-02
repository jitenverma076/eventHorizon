import { Link } from "react-router-dom"
import { Search, MapPin, Calendar, Ticket, Music, Mic2, Film, Users, ArrowRight, Star, Sparkles, Zap, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"

const Hero = () => {
  const eventTypes = [
    { icon: <Music className="h-5 w-5" />, name: 'Concerts' },
    { icon: <Mic2 className="h-5 w-5" />, name: 'Conferences' },
    { icon: <Film className="h-5 w-5" />, name: 'Movies' },
    { icon: <Users className="h-5 w-5" />, name: 'Meetups' },
  ]

  // Decorative SVG elements
  const CirclePattern = () => (
    <svg className="absolute inset-0 w-full h-full overflow-visible opacity-40">
      <defs>
        <linearGradient id="circleGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(255, 70%, 60%)" />
          <stop offset="100%" stopColor="hsl(270, 70%, 60%)" />
        </linearGradient>
        <linearGradient id="circleGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsl(262, 83%, 58%)" />
          <stop offset="100%" stopColor="hsl(255, 70%, 60%)" />
        </linearGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      <circle cx="10%" cy="20%" r="8" fill="url(#circleGrad1)" opacity="0.8" filter="url(#glow)">
        <animate attributeName="r" from="8" to="14" dur="4s" begin="0s" repeatCount="indefinite" />
        <animate attributeName="opacity" from="0.8" to="0.4" dur="4s" begin="0s" repeatCount="indefinite" />
      </circle>
      <circle cx="20%" cy="60%" r="6" fill="url(#circleGrad2)" opacity="0.7" filter="url(#glow)">
        <animate attributeName="r" from="6" to="12" dur="5s" begin="1s" repeatCount="indefinite" />
        <animate attributeName="opacity" from="0.7" to="0.3" dur="5s" begin="1s" repeatCount="indefinite" />
      </circle>
      <circle cx="70%" cy="30%" r="10" fill="url(#circleGrad1)" opacity="0.7" filter="url(#glow)">
        <animate attributeName="r" from="10" to="18" dur="6s" begin="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" from="0.7" to="0.3" dur="6s" begin="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="80%" cy="70%" r="8" fill="url(#circleGrad2)" opacity="0.8" filter="url(#glow)">
        <animate attributeName="r" from="8" to="16" dur="5s" begin="0.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" from="0.8" to="0.4" dur="5s" begin="0.5s" repeatCount="indefinite" />
      </circle>
    </svg>
  )

  const [animationOffset, setAnimationOffset] = useState(0)
  useEffect(() => {
    const intervalId = setInterval(() => {
      setAnimationOffset(animationOffset + 1)
    }, 16)
    return () => clearInterval(intervalId)
  }, [animationOffset])

  return (
    <section className="relative bg-gradient-to-br from-white via-purple-50 to-blue-50 text-gray-900 pt-20 pb-32 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 top-[-200vh] h-[300vh] overflow-hidden">
        <CirclePattern />
        <div className="absolute inset-0 top-0 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px]"></div>
        
        {/* Decorative elements */}
        <CirclePattern />
        <div className="absolute top-40 left-10 w-64 h-64 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
        <div className="absolute top-20 right-10 w-72 h-72 bg-secondary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-40 right-20 w-60 h-60 bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>
        
        {/* Floating elements */}
        <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2 opacity-70">
          <Sparkles className="h-8 w-8 text-primary filter drop-shadow-lg" style={{ transform: `translateY(${Math.sin(animationOffset * 0.1) * 10}px)` }} />
        </div>
        <div className="absolute top-1/3 right-1/4 transform translate-x-1/2 -translate-y-1/2 opacity-70">
          <Zap className="h-8 w-8 text-secondary filter drop-shadow-lg" style={{ transform: `translateY(${Math.sin((animationOffset + 30) * 0.1) * 10}px)` }} />
        </div>
        <div className="absolute bottom-1/3 right-1/3 transform translate-x-1/2 translate-y-1/2 opacity-70">
          <TrendingUp className="h-8 w-8 text-accent filter drop-shadow-lg" style={{ transform: `translateY(${Math.sin((animationOffset + 60) * 0.1) * 10}px)` }} />
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 lg:pt-32 lg:pb-24">
        <div className="text-center">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-200 text-sm text-blue-700 mb-6 font-medium backdrop-blur-sm shadow-sm">
            <Sparkles className="h-4 w-4 text-blue-600 mr-2 animate-pulse" />
            Discover extraordinary events in your area
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight max-w-4xl mx-auto">
            Find Your Next
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-purple-700 mt-2">
              Unforgettable Experience
            </span>
          </h1>

          <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto text-gray-600">
            From electrifying concerts to inspiring workshops, discover and secure your spot at events that resonate with your passions. Join thousands of event enthusiasts creating memories that last a lifetime.
          </p>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto mb-16">
            <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-4 mb-8 border border-gray-100/50 hover:shadow-xl transition-all duration-300">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Search events..."
                    className="pl-10 w-full h-12 rounded-lg border-gray-200 focus:border-primary focus:ring-primary/30"
                  />
                </div>
                <Button className="h-12 px-6 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-md hover:shadow-lg transition-all duration-300">
                  Search
                </Button>
              </div>
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap justify-center gap-2">
              {eventTypes.map((type, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="rounded-full border-gray-200 bg-white/80 backdrop-blur-sm hover:bg-primary/5 hover:border-primary/30 hover:text-primary shadow-sm transition-all duration-300"
                >
                  {type.icon}
                  <span className="ml-2">{type.name}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-md border border-gray-100/50 hover:shadow-lg hover:bg-white/80 transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary mb-2">500+</div>
              <div className="text-gray-600">Events Every Month</div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-md border border-gray-100/50 hover:shadow-lg hover:bg-white/80 transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-secondary to-accent mb-2">10,000+</div>
              <div className="text-gray-600">Happy Attendees</div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-md border border-gray-100/50 hover:shadow-lg hover:bg-white/80 transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-accent to-primary mb-2">98%</div>
              <div className="text-gray-600">Satisfaction Rate</div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <Button 
              asChild 
              size="lg" 
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white px-8 py-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              <Link to="/events">Explore All Events</Link>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Add a style tag for the wave animation */}
      <style jsx>{`
        @keyframes wave {
          0% { background-position-x: 0; }
          100% { background-position-x: 1200px; }
        }
      `}</style>
    </section>
  )
}

export default Hero

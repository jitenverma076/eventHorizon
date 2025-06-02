import { Search, Calendar, Ticket, CreditCard, Sparkles, CheckCircle, ArrowRight, Zap, Star, PartyPopper, TrendingUp, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { useState, useEffect } from "react"

const steps = [
  {
    icon: <Search className="h-8 w-8 text-primary" />,
    title: "Find Your Event",
    description:
      "Browse through our extensive catalog of events or use our powerful search to find exactly what you're looking for.",
  },
  {
    icon: <Calendar className="h-8 w-8 text-secondary" />,
    title: "Choose Your Date",
    description:
      "Select the perfect date and time that fits your schedule. We offer flexible options for most events.",
  },
  {
    icon: <Ticket className="h-8 w-8 text-accent" />,
    title: "Select Your Seats",
    description:
      "Pick the best seats available. Our interactive seating charts make it easy to find the perfect spot.",
  },
  {
    icon: <CreditCard className="h-8 w-8 text-primary" />,
    title: "Secure Checkout",
    description:
      "Complete your purchase with our safe and secure checkout process. Receive your tickets instantly.",
  },
  {
    icon: <CheckCircle className="h-8 w-8 text-blue-700" />,
    title: "Get Your Tickets",
    description: "Receive your e-tickets via email or access them in your account. Show them at the event entrance for a smooth entry.",
  },
]

// Decorative background elements
const BackgroundElements = () => (
  <div className="absolute inset-0 overflow-hidden -z-10">
    {/* Gradient background */}
    <div className="absolute inset-0 bg-gradient-to-br from-white via-purple-50 to-blue-50"></div>
    
    {/* Radial dots pattern */}
    <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-70"></div>
    
    {/* Blurred circles */}
    <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
    <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-secondary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
    <div className="absolute top-1/3 left-1/4 w-1/3 h-1/3 bg-accent/10 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
  </div>
)

const HowItWorks = () => {
  const [animationOffset, setAnimationOffset] = useState(0)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationOffset(prev => (prev + 1) % 100)
    }, 50)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen">
      <BackgroundElements />
      
      {/* Hero Section */}
      <div className="relative pt-28 pb-20 px-4 md:px-8 overflow-hidden">
        {/* Floating elements */}
        <div className="absolute top-1/4 right-1/4 transform translate-x-1/2 -translate-y-1/2 opacity-70">
          <Sparkles className="h-10 w-10 text-primary filter drop-shadow-lg" style={{ transform: `translateY(${Math.sin(animationOffset * 0.1) * 10}px)` }} />
        </div>
        <div className="absolute bottom-1/4 left-1/4 transform -translate-x-1/2 translate-y-1/2 opacity-70">
          <Star className="h-8 w-8 text-secondary filter drop-shadow-lg" style={{ transform: `translateY(${Math.cos(animationOffset * 0.1) * 8}px)` }} />
        </div>
        <div className="absolute top-1/3 right-1/3 transform translate-x-1/2 -translate-y-1/2 opacity-70">
          <Zap className="h-6 w-6 text-accent filter drop-shadow-lg" style={{ transform: `translateY(${Math.sin(animationOffset * 0.15) * 12}px)` }} />
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full bg-white/70 backdrop-blur-sm border border-purple-100/50 shadow-md">
            <span className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
              <Award className="h-3.5 w-3.5 mr-1.5" />
              Premium Experience Guaranteed
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
            How It Works
          </h1>
          
          <p className="text-xl text-gray-700 mb-10 max-w-3xl mx-auto leading-relaxed">
            Booking your next event with EventHorizon is simple and hassle-free. Follow these easy steps to secure your
            tickets and create unforgettable memories.
          </p>
          
          <div className="flex justify-center space-x-4 mb-10">
            <div className="flex items-center bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
              <CheckCircle className="h-4 w-4 text-primary mr-2" />
              <span className="text-sm text-gray-700">Simple Process</span>
            </div>
            <div className="flex items-center bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
              <CheckCircle className="h-4 w-4 text-primary mr-2" />
              <span className="text-sm text-gray-700">Secure Checkout</span>
            </div>
            <div className="flex items-center bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
              <CheckCircle className="h-4 w-4 text-primary mr-2" />
              <span className="text-sm text-gray-700">Instant Delivery</span>
            </div>
          </div>
        </div>
      </div>

      {/* Steps Section */}
      <div className="py-20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="relative">
            {/* Timeline line */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1.5 bg-gradient-to-b from-primary via-secondary to-accent rounded-full transform -translate-x-1/2 opacity-80 shadow-lg"></div>
            
            <div className="space-y-20 md:space-y-32">
              {steps.map((step, index) => (
                <div 
                  key={index} 
                  className={`relative flex flex-col md:flex-row items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  {/* Step content */}
                  <div className={`md:w-5/12 bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg p-8 relative border border-gray-100/50 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 ${index % 2 === 0 ? "md:mr-auto" : "md:ml-auto"}`}>
                    <div className="relative mx-auto mb-6 inline-block">
                      <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-full blur opacity-70"></div>
                      <div className="relative bg-white w-16 h-16 rounded-full flex items-center justify-center shadow-md">
                        {step.icon}
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                      {step.title}
                    </h3>
                    
                    <p className="text-gray-600 leading-relaxed mb-6">
                      {step.description}
                    </p>
                    
                    <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full bg-primary/5 border border-primary/10">
                      <CheckCircle className="h-4 w-4 text-primary mr-2" />
                      <span className="text-sm font-medium text-primary">Quick & Easy</span>
                    </div>
                  </div>
                  
                  {/* Step number */}
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center justify-center z-20">
                    <div className="relative">
                      <div className="absolute -inset-3 bg-white rounded-full blur-sm"></div>
                      <div className="relative w-16 h-16 bg-gradient-to-br from-primary to-secondary text-white rounded-full flex items-center justify-center font-bold text-2xl shadow-lg">
                        {index + 1}
                      </div>
                    </div>
                  </div>
                  
                  {/* Mobile step number (only visible on small screens) */}
                  <div className="md:hidden absolute -top-8 left-1/2 -translate-x-1/2 w-10 h-10 bg-gradient-to-br from-primary to-secondary text-white rounded-full flex items-center justify-center font-bold text-lg shadow-md z-10">
                    {index + 1}
                  </div>
                  
                  {/* Empty div for spacing on the other side */}
                  <div className="w-5/12 hidden md:block"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-24 px-4 md:px-8 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 z-0"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-30"></div>
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
        <div className="absolute bottom-20 left-10 w-64 h-64 bg-secondary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
        
        {/* Floating elements */}
        <div className="absolute top-1/3 right-1/3 transform translate-x-1/2 -translate-y-1/2 opacity-70">
          <PartyPopper className="h-8 w-8 text-accent filter drop-shadow-lg" style={{ transform: `translateY(${Math.sin(animationOffset * 0.12) * 15}px)` }} />
        </div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-12 border border-gray-100/50 hover:shadow-[0_20px_50px_rgba(8,_112,_184,_0.2)] transition-all duration-500">
            <div className="inline-block mb-6 px-4 py-1.5 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 shadow-sm">
              <span className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                <TrendingUp className="h-3.5 w-3.5 mr-1.5" />
                Join 10,000+ Event Enthusiasts
              </span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent mb-6">
              Ready to Transform Your Event Experience?
            </h2>
            
            <p className="text-xl text-gray-700 mb-10 max-w-3xl mx-auto leading-relaxed">
              Join thousands of satisfied customers who have used EventHorizon to discover and book their favorite events. Your next unforgettable experience is just a click away.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
              <Button 
                asChild 
                size="lg" 
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 px-8 py-7 rounded-xl"
              >
                <Link to="/events" className="flex items-center text-lg">
                  <Ticket className="mr-2 h-5 w-5" />
                  Browse Events
                </Link>
              </Button>
              
              <Button 
                asChild 
                size="lg" 
                variant="outline" 
                className="border-primary/30 text-primary hover:bg-primary/5 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 px-8 py-7 rounded-xl"
              >
                <Link to="/register" className="flex items-center text-lg">
                  <ArrowRight className="mr-2 h-5 w-5" />
                  Create Account
                </Link>
              </Button>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <div className="flex items-center bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
                <CheckCircle className="h-4 w-4 text-primary mr-2" />
                <span className="text-sm text-gray-700">Premium Support</span>
              </div>
              <div className="flex items-center bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
                <CheckCircle className="h-4 w-4 text-primary mr-2" />
                <span className="text-sm text-gray-700">Exclusive Events</span>
              </div>
              <div className="flex items-center bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
                <CheckCircle className="h-4 w-4 text-primary mr-2" />
                <span className="text-sm text-gray-700">No Hidden Fees</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HowItWorks

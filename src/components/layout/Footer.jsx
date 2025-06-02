import { Link } from "react-router-dom"
import { Twitter, Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Shield, Ticket, ArrowRight, Clock } from "lucide-react"

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white relative overflow-hidden border-t border-blue-500/20">
      {/* Subtle dot pattern background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(59, 130, 246, 0.3) 1px, transparent 1px)`,
            backgroundSize: `20px 20px`,
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        {/* Main footer content with gradient border */}
        <div className="relative bg-gray-800/30 backdrop-blur-md rounded-lg overflow-hidden border border-gray-700/30 mb-4">
          {/* Gradient top border */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-blue-600/0 via-blue-400 to-purple-500/0"></div>

          {/* Main content with proper spacing */}
          <div className="p-5">
            <div className="grid grid-cols-12 gap-6">
              {/* Brand column */}
              <div className="col-span-12 md:col-span-4 flex flex-col">
                <div className="flex items-center mb-3">
                  <div className="relative mr-2">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-md opacity-70"></div>
                    <div className="relative bg-gray-800 rounded-full p-1.5">
                      <Ticket className="h-5 w-5 text-blue-400" />
                    </div>
                  </div>
                  <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                    EventHorizon
                  </h2>
                </div>

                <p className="text-gray-400 text-sm mb-3 leading-relaxed">
                  Your premier platform for discovering and creating extraordinary events. Join thousands of event enthusiasts today.
                </p>

                <div className="flex items-center mb-4">
                  <Shield className="h-4 w-4 text-blue-400 mr-2" />
                  <span className="text-blue-300 text-sm font-medium">Trusted by 10,000+ organizers</span>
                </div>

                <div className="flex space-x-3 mt-auto">
                  <a href="#" className="group">
                    <div className="p-1.5 rounded-full bg-gray-700/50 hover:bg-blue-500/20 transition-all duration-300">
                      <Twitter className="h-4 w-4 text-gray-400 group-hover:text-blue-400" />
                    </div>
                  </a>
                  <a href="#" className="group">
                    <div className="p-1.5 rounded-full bg-gray-700/50 hover:bg-blue-500/20 transition-all duration-300">
                      <Facebook className="h-4 w-4 text-gray-400 group-hover:text-blue-400" />
                    </div>
                  </a>
                  <a href="#" className="group">
                    <div className="p-1.5 rounded-full bg-gray-700/50 hover:bg-blue-500/20 transition-all duration-300">
                      <Instagram className="h-4 w-4 text-gray-400 group-hover:text-blue-400" />
                    </div>
                  </a>
                  <a href="#" className="group">
                    <div className="p-1.5 rounded-full bg-gray-700/50 hover:bg-blue-500/20 transition-all duration-300">
                      <Linkedin className="h-4 w-4 text-gray-400 group-hover:text-blue-400" />
                    </div>
                  </a>
                </div>
              </div>

              {/* Quick links column */}
              <div className="col-span-6 md:col-span-4">
                <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider text-gray-300">Explore</h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <Link to="/events" className="text-gray-400 hover:text-blue-400 text-sm transition-colors duration-300">
                    All Events
                  </Link>
                  <Link to="/events?category=music" className="text-gray-400 hover:text-blue-400 text-sm transition-colors duration-300">
                    Music Events
                  </Link>
                  <Link to="/events?category=tech" className="text-gray-400 hover:text-blue-400 text-sm transition-colors duration-300">
                    Tech Conferences
                  </Link>
                  <Link to="/events?category=sports" className="text-gray-400 hover:text-blue-400 text-sm transition-colors duration-300">
                    Sports Events
                  </Link>
                  <Link to="/how-it-works" className="text-gray-400 hover:text-blue-400 text-sm transition-colors duration-300">
                    How It Works
                  </Link>
                  <Link to="/help" className="text-gray-400 hover:text-blue-400 text-sm transition-colors duration-300">
                    Help Center
                  </Link>
                </div>
              </div>

              {/* Contact column */}
              <div className="col-span-6 md:col-span-4">
                <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider text-gray-300">Contact Us</h3>

                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="p-1.5 rounded-full bg-blue-500/10 mr-3">
                      <Mail className="h-4 w-4 text-blue-400" />
                    </div>
                    <span className="text-gray-400 text-sm">support@eventhorizon.com</span>
                  </div>

                  <div className="flex items-center">
                    <div className="p-1.5 rounded-full bg-blue-500/10 mr-3">
                      <Phone className="h-4 w-4 text-blue-400" />
                    </div>
                    <span className="text-gray-400 text-sm">+1 (555) 123-4567</span>
                  </div>

                  <Link to="/contact" className="inline-flex items-center mt-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-md hover:from-blue-500 hover:to-purple-500 transition-all duration-300">
                    <span>Get in touch</span>
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright section */}
        <div className="flex flex-col md:flex-row justify-between items-center py-3 border-t border-gray-800/50 text-gray-500 text-xs">
          <div className="mb-2 md:mb-0">
            © 2024 EventHorizon. All rights reserved.
          </div>

          <div className="flex space-x-6">
            <a href="#" className="hover:text-blue-400 transition-colors duration-300">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-blue-400 transition-colors duration-300">
              Terms of Service
            </a>
            <a href="#" className="hover:text-blue-400 transition-colors duration-300">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

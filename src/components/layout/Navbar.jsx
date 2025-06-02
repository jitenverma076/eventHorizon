import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Menu, X, Calendar, User, LogOut, Settings, Plus, Sparkles, Ticket, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 mx-auto px-4 py-4 w-full">
      <nav className="mx-auto max-w-5xl px-4 sm:px-6 bg-white/80 backdrop-blur-md border border-gray-100/50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full blur-sm opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative bg-white rounded-full p-1.5">
                  <Ticket className="h-5 w-5 text-blue-600 group-hover:text-blue-700 transition-colors duration-300" />
                </div>
              </div>
              <span className="text-lg font-bold text-blue-600 group-hover:text-blue-700 transition-colors duration-300">
                EventHorizon
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/events"
              className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-primary/5"
            >
              Events
            </Link>
            <Link
              to="/how-it-works"
              className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-primary/5"
            >
              How It Works
            </Link>
            <Link
              to="/contact"
              className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-primary/5"
            >
              <Mail className="h-4 w-4 inline mr-1" />
              Contact
            </Link>

            {!isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white px-5 py-2 rounded-lg hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5">
                    <Sparkles className="h-4 w-4 mr-1.5" />
                    Get Started
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link to="/login" className="w-full">Sign In</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/register" className="w-full font-medium text-primary">Create Account</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                {user?.role === "organizer" && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="border-primary/30 bg-white/40 text-gray-700 hover:bg-primary/10 hover:text-primary px-4 rounded-full flex items-center space-x-1 backdrop-blur-sm shadow-sm">
                        <User className="h-4 w-4 text-primary" />
                        <span className="ml-1">{user?.name?.split(" ")[0]}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Organizer Tools</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/organizer/create-event" className="flex items-center">
                          <Plus className="mr-2 h-4 w-4" />
                          Create Event
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/organizer/events" className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4" />
                          Manage Events
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2 hover:bg-gray-50 rounded-full px-3 py-1.5">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-100 to-cyan-50 flex items-center justify-center text-blue-600">
                        <User className="h-4 w-4" />
                      </div>
                      <span className="font-medium text-gray-800">{user?.name || 'Account'}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-full text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden bg-white/80 backdrop-blur-lg rounded-xl shadow-xl border border-gray-100/50 mt-3 mx-2">
            <div className="px-2 pt-2 space-y-1">
              <div className="space-y-1">
                <Link
                  to="/events"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-primary/5"
                  onClick={() => setIsOpen(false)}
                >
                  Events
                </Link>
                <Link
                  to="/how-it-works"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-primary/5"
                  onClick={() => setIsOpen(false)}
                >
                  How It Works
                </Link>
                <Link
                  to="/contact"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-primary/5"
                  onClick={() => setIsOpen(false)}
                >
                  <Mail className="h-4 w-4 inline mr-1" />
                  Contact
                </Link>
              </div>

              {!isAuthenticated ? (
                <div className="pt-2 space-y-2">
                  <Link
                    to="/login"
                    className="block w-full text-center px-6 py-3 bg-white border border-primary/30 text-primary rounded-xl hover:shadow-md transition-all duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="block w-full text-center px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 transition-all duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    Create Account
                  </Link>
                </div>
              ) : (
                <>
                  <Link
                    to="/dashboard"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-primary/5"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsOpen(false)
                    }}
                    className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </div>
  )
}

export default Navbar
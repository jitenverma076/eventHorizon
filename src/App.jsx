import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/context/AuthContext"
import { EventProvider } from "@/context/EventContext"
import ScrollToTop from "@/components/utils/ScrollToTop"
import { motion } from "framer-motion"

// Layout
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import PageBackground from "@/components/layout/PageBackground"

// Pages
import Home from "@/pages/Home"
import Events from "@/pages/Events"
import EventDetail from "@/pages/EventDetail"
import Booking from "@/pages/Booking"
import Profile from "@/pages/Profile"
import Dashboard from "@/pages/Dashboard"
import Login from "@/pages/auth/Login"
import Register from "@/pages/auth/Register"
import HowItWorks from "@/pages/HowItWorks"
import Contact from "@/pages/Contact"
import CreateEvent from "@/pages/organizer/CreateEvent"
import ManageEvents from "@/pages/organizer/ManageEvents"
import Analytics from "@/pages/organizer/Analytics"

// Protected Route component
import ProtectedRoute from "@/components/auth/ProtectedRoute"

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="eventhorizon-theme">
      <AuthProvider>
        <EventProvider>
          <Router>
            <ScrollToTop />
            <div className="min-h-screen bg-background relative overflow-hidden">
              <PageBackground />
              <Navbar />
              <motion.main 
                className="flex-1 pt-24"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/events" element={<Events />} />
                  <Route path="/events/:id" element={<EventDetail />} />
                  <Route path="/how-it-works" element={<HowItWorks />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  {/* Protected User Routes */}
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/booking/:eventId"
                    element={
                      <ProtectedRoute>
                        <Booking />
                      </ProtectedRoute>
                    }
                  />

                  {/* Protected Organizer Routes */}
                  <Route
                    path="/organizer/create-event"
                    element={
                      <ProtectedRoute roles={["organizer", "admin"]}>
                        <CreateEvent />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/organizer/events"
                    element={
                      <ProtectedRoute roles={["organizer", "admin"]}>
                        <ManageEvents />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/organizer/analytics"
                    element={
                      <ProtectedRoute roles={["organizer", "admin"]}>
                        <Analytics />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </motion.main>
              <Footer />
              <Toaster />
            </div>
          </Router>
        </EventProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
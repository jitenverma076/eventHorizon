import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Calendar, MapPin, CreditCard, User, Ticket, Sparkles } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEvents } from "@/context/EventContext"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/hooks/use-toast"
import bookingService from "@/services/bookingService"
import { formatDate, formatCurrency } from "@/lib/utils"

const Booking = () => {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const { currentEvent, fetchEvent, loading } = useEvents()
  const { user } = useAuth()
  const { toast } = useToast()

  const [selectedTickets, setSelectedTickets] = useState({})
  const [referralCode, setReferralCode] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    if (eventId) {
      fetchEvent(eventId)
    }
  }, [eventId])

  const handleTicketChange = (tierName, quantity) => {
    setSelectedTickets(prev => ({
      ...prev,
      [tierName]: Math.max(0, quantity)
    }))
  }

  const calculateTotal = () => {
    if (!currentEvent?.ticketTiers) return 0
    
    return Object.entries(selectedTickets).reduce((total, [tierName, quantity]) => {
      const tier = currentEvent.ticketTiers.find(t => t.name === tierName)
      if (tier && quantity > 0) {
        return total + (tier.price.current || tier.price.base) * quantity
      }
      return total
    }, 0)
  }

  const getTotalTickets = () => {
    return Object.values(selectedTickets).reduce((total, quantity) => total + quantity, 0)
  }

  const handleBooking = async () => {
    if (getTotalTickets() === 0) {
      toast({
        title: "No tickets selected",
        description: "Please select at least one ticket",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      const tickets = Object.entries(selectedTickets)
        .filter(([_, quantity]) => quantity > 0)
        .map(([tierName, quantity]) => ({
          tierName,
          quantity
        }))

      const bookingData = {
        eventId,
        tickets,
        referralCode: referralCode || undefined
      }

      const response = await bookingService.createBooking(bookingData)

      toast({
        title: "Booking Successful!",
        description: "Your tickets have been booked successfully.",
      })

      navigate("/dashboard")
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: error.message || "Failed to create booking",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!currentEvent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-md border border-gray-100/50">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Event not found</h2>
          <Button 
            onClick={() => navigate("/events")} 
            className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-md hover:shadow-lg transition-all duration-300"
          >
            Back to Events
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Event Details */}
            <div className="md:w-2/3">
              <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm p-6 mb-6 border border-gray-100/50">
                <div className="flex items-center gap-2 mb-4">
                  <div className="inline-block px-3 py-1 rounded-full bg-white/50 backdrop-blur-sm border border-purple-100 shadow-sm">
                    <span className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary flex items-center">
                      <Ticket className="h-3 w-3 mr-1" />
                      Secure Booking
                    </span>
                  </div>
                </div>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent mb-8">Book Your Tickets</h1>
                
                <div className="grid grid-cols-1 gap-8">
                  {/* Event Info */}
                  <div className="lg:col-span-2">
                    <Card className="mb-6 bg-white/90 backdrop-blur-sm border border-gray-100/50 shadow-md hover:shadow-lg transition-all duration-300">
                      <CardHeader>
                        <CardTitle className="flex items-center text-gray-800">
                          <Calendar className="h-5 w-5 mr-2 text-primary" />
                          Event Details
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-start space-x-4">
                          <img
                            src={currentEvent.images?.[0]?.url || `/placeholder.svg?height=100&width=100`}
                            alt={currentEvent.title}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          <div>
                            <h3 className="text-xl font-semibold mb-2">{currentEvent.title}</h3>
                            <div className="space-y-1 text-gray-600">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2" />
                                <span>{formatDate(currentEvent.dateTime.start)}</span>
                              </div>
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-2" />
                                <span>{currentEvent.venue.name}, {currentEvent.venue.address.city}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Ticket Selection */}
                    <Card className="mb-6 bg-white/90 backdrop-blur-sm border border-gray-100/50 shadow-md hover:shadow-lg transition-all duration-300">
                      <CardHeader>
                        <CardTitle className="flex items-center text-gray-800">
                          <Ticket className="h-5 w-5 mr-2 text-secondary" />
                          Select Tickets
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {currentEvent.ticketTiers?.map((tier, index) => (
                            <div key={index} className="border rounded-lg p-4">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h4 className="font-semibold">{tier.name}</h4>
                                  <p className="text-sm text-gray-600">
                                    {tier.availableSeats} available
                                  </p>
                                </div>
                                <span className="text-lg font-bold text-blue-600">
                                  {formatCurrency(tier.price.current || tier.price.base)}
                                </span>
                              </div>
                              
                              <div className="flex items-center space-x-2 mt-3">
                                <Button
                                  size="icon"
                                  variant="outline"
                                  className="h-8 w-8 rounded-full border-gray-200 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
                                  onClick={() => handleTicketChange(tier.name, selectedTickets[tier.name] - 1)}
                                  disabled={!selectedTickets[tier.name]}
                                >
                                  -
                                </Button>
                                <span className="mx-2 font-medium">{selectedTickets[tier.name] || 0}</span>
                                <Button
                                  size="icon"
                                  variant="outline"
                                  className="h-8 w-8 rounded-full border-gray-200 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
                                  onClick={() => handleTicketChange(tier.name, (selectedTickets[tier.name] || 0) + 1)}
                                  disabled={tier.availableSeats <= (selectedTickets[tier.name] || 0)}
                                >
                                  +
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Referral Code */}
                    <Card className="bg-white/90 backdrop-blur-sm border border-gray-100/50 shadow-md hover:shadow-lg transition-all duration-300">
                      <CardHeader>
                        <CardTitle className="flex items-center text-gray-800">
                          <Sparkles className="h-5 w-5 mr-2 text-accent" />
                          Referral Code (Optional)
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="referralCode">Enter referral code for discount</Label>
                            <Input
                              id="referralCode"
                              type="text"
                              placeholder="Enter referral code"
                              value={referralCode}
                              onChange={(e) => setReferralCode(e.target.value)}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Order Summary */}
                  <div className="lg:col-span-1">
                    <Card className="sticky top-8 bg-white/90 backdrop-blur-sm border border-gray-100/50 shadow-md hover:shadow-lg transition-all duration-300">
                      <CardHeader className="border-b border-gray-100">
                        <CardTitle className="flex items-center text-gray-800">
                          <CreditCard className="h-5 w-5 mr-2 text-primary" />
                          Order Summary
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {/* User Info */}
                          <div className="border-b pb-4">
                            <div className="flex items-center mb-2">
                              <User className="h-4 w-4 mr-2" />
                              <span className="font-medium">Booking for:</span>
                            </div>
                            <p className="text-gray-600">{user?.name}</p>
                            <p className="text-gray-600">{user?.email}</p>
                          </div>


                          {/* Selected Tickets */}
                          <div className="space-y-2">
                            {Object.entries(selectedTickets).map(([tierName, quantity]) => {
                              if (quantity <= 0) return null
                              const tier = currentEvent.ticketTiers?.find(t => t.name === tierName)
                              if (!tier) return null

                              return (
                                <div key={tierName} className="flex justify-between">
                                  <span className="font-medium">{quantity}x {tierName}</span>
                                  <span className="text-primary font-medium">{formatCurrency((tier.price.current || tier.price.base) * quantity)}</span>
                                </div>
                              )
                            })}
                          </div>


                          {getTotalTickets() > 0 && (
                            <>
                              <div className="border-t pt-4">
                                <div className="flex justify-between font-bold text-lg">
                                  <span>Total</span>
                                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">{formatCurrency(calculateTotal())}</span>
                                </div>
                              </div>

                              <Button 
                                onClick={handleBooking} 
                                className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-md hover:shadow-lg transition-all duration-300" 
                                size="lg"
                                disabled={isProcessing}
                              >
                                {isProcessing ? "Processing..." : `Book ${getTotalTickets()} Ticket${getTotalTickets() > 1 ? 's' : ''}`}
                              </Button>
                            </>
                          )}

                          {getTotalTickets() === 0 && (
                            <p className="text-gray-500 text-center py-4">
                              Select tickets to see total
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Booking
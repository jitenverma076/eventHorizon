import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Calendar, MapPin, DollarSign, Users, Plus, Minus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import eventService from "@/services/eventService"

const CreateEvent = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    venue: {
      name: "",
      address: {
        street: "",
        city: "",
        state: "",
        country: "",
        zipCode: "",
      },
    },
    dateTime: {
      start: "",
      end: "",
    },
    ticketTiers: [
      {
        name: "General Admission",
        price: { base: 0 },
        totalSeats: 100,
        perks: [],
      },
    ],
    tags: [],
  })

  const categories = ["music", "sports", "technology", "business", "arts", "food", "education", "other"]

  const handleChange = (e) => {
    const { name, value } = e.target
    
    if (name.includes('.')) {
      const keys = name.split('.')
      setFormData(prev => {
        const newData = { ...prev }
        let current = newData
        
        for (let i = 0; i < keys.length - 1; i++) {
          current = current[keys[i]]
        }
        
        current[keys[keys.length - 1]] = value
        return newData
      })
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleTicketTierChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      ticketTiers: prev.ticketTiers.map((tier, i) => 
        i === index 
          ? { ...tier, [field]: field === 'price' ? { base: parseFloat(value) || 0 } : value }
          : tier
      )
    }))
  }

  const addTicketTier = () => {
    setFormData(prev => ({
      ...prev,
      ticketTiers: [
        ...prev.ticketTiers,
        {
          name: "",
          price: { base: 0 },
          totalSeats: 0,
          perks: [],
        }
      ]
    }))
  }

  const removeTicketTier = (index) => {
    if (formData.ticketTiers.length > 1) {
      setFormData(prev => ({
        ...prev,
        ticketTiers: prev.ticketTiers.filter((_, i) => i !== index)
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validate required fields
      if (!formData.title || !formData.description || !formData.category) {
        throw new Error("Please fill in all required fields")
      }

      if (!formData.dateTime.start || !formData.dateTime.end) {
        throw new Error("Please set event start and end times")
      }

      if (new Date(formData.dateTime.start) >= new Date(formData.dateTime.end)) {
        throw new Error("End time must be after start time")
      }

      // Prepare data for submission
      const eventData = {
        ...formData,
        ticketTiers: formData.ticketTiers.map(tier => ({
          ...tier,
          availableSeats: tier.totalSeats,
          price: {
            base: tier.price.base,
            current: tier.price.base
          }
        }))
      }

      const response = await eventService.createEvent(eventData)

      toast({
        title: "Event Created!",
        description: "Your event has been created successfully.",
      })

      navigate("/organizer/events")
    } catch (error) {
      toast({
        title: "Error Creating Event",
        description: error.message || "Failed to create event",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Event</h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="title">Event Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    type="text"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter event title"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <textarea
                    id="description"
                    name="description"
                    required
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe your event..."
                    rows={4}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category *</Label>
                  <select
                    id="category"
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Date & Time */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Date & Time
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="start">Start Date & Time *</Label>
                    <Input
                      id="start"
                      name="dateTime.start"
                      type="datetime-local"
                      required
                      value={formData.dateTime.start}
                      onChange={handleChange}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="end">End Date & Time *</Label>
                    <Input
                      id="end"
                      name="dateTime.end"
                      type="datetime-local"
                      required
                      value={formData.dateTime.end}
                      onChange={handleChange}
                      className="mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Venue Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Venue Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="venueName">Venue Name *</Label>
                  <Input
                    id="venueName"
                    name="venue.name"
                    type="text"
                    required
                    value={formData.venue.name}
                    onChange={handleChange}
                    placeholder="Enter venue name"
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="street">Street Address</Label>
                    <Input
                      id="street"
                      name="venue.address.street"
                      type="text"
                      value={formData.venue.address.street}
                      onChange={handleChange}
                      placeholder="Street address"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      name="venue.address.city"
                      type="text"
                      required
                      value={formData.venue.address.city}
                      onChange={handleChange}
                      placeholder="City"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      name="venue.address.state"
                      type="text"
                      required
                      value={formData.venue.address.state}
                      onChange={handleChange}
                      placeholder="State"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Country *</Label>
                    <Input
                      id="country"
                      name="venue.address.country"
                      type="text"
                      required
                      value={formData.venue.address.country}
                      onChange={handleChange}
                      placeholder="Country"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="zipCode">Zip Code</Label>
                    <Input
                      id="zipCode"
                      name="venue.address.zipCode"
                      type="text"
                      value={formData.venue.address.zipCode}
                      onChange={handleChange}
                      placeholder="Zip code"
                      className="mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ticket Tiers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <DollarSign className="h-5 w-5 mr-2" />
                    Ticket Tiers
                  </div>
                  <Button type="button" onClick={addTicketTier} variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Tier
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {formData.ticketTiers.map((tier, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium">Tier {index + 1}</h4>
                      {formData.ticketTiers.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => removeTicketTier(index)}
                          variant="outline"
                          size="sm"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor={`tierName-${index}`}>Tier Name *</Label>
                        <Input
                          id={`tierName-${index}`}
                          type="text"
                          required
                          value={tier.name}
                          onChange={(e) => handleTicketTierChange(index, 'name', e.target.value)}
                          placeholder="e.g., VIP, General"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`tierPrice-${index}`}>Price ($) *</Label>
                        <Input
                          id={`tierPrice-${index}`}
                          type="number"
                          min="0"
                          step="0.01"
                          required
                          value={tier.price.base}
                          onChange={(e) => handleTicketTierChange(index, 'price', e.target.value)}
                          placeholder="0.00"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`tierSeats-${index}`}>Total Seats *</Label>
                        <Input
                          id={`tierSeats-${index}`}
                          type="number"
                          min="1"
                          required
                          value={tier.totalSeats}
                          onChange={(e) => handleTicketTierChange(index, 'totalSeats', parseInt(e.target.value) || 0)}
                          placeholder="100"
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => navigate("/organizer/events")}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Event"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateEvent
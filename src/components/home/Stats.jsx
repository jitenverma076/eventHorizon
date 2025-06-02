import { Users, Calendar, MapPin, Star } from "lucide-react"

const stats = [
  {
    icon: Users,
    value: "50K+",
    label: "Happy Users",
    description: "Active event-goers",
  },
  {
    icon: Calendar,
    value: "1000+",
    label: "Events",
    description: "Hosted monthly",
  },
  {
    icon: MapPin,
    value: "100+",
    label: "Cities",
    description: "Worldwide coverage",
  },
  {
    icon: Star,
    value: "4.9",
    label: "Rating",
    description: "User satisfaction",
  },
]

const Stats = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <div key={index} className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <IconComponent className="h-8 w-8 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-lg font-semibold text-gray-700 mb-1">{stat.label}</div>
                <div className="text-sm text-gray-500">{stat.description}</div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Stats

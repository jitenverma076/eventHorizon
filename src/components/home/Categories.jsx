import { Link } from "react-router-dom"
import { Music, Trophy, Laptop, Briefcase, Palette, UtensilsCrossed, GraduationCap, MoreHorizontal } from "lucide-react"

const categories = [
  { name: "Music", icon: Music, color: "bg-purple-100 text-purple-600", count: "150+ events" },
  { name: "Sports", icon: Trophy, color: "bg-green-100 text-green-600", count: "80+ events" },
  { name: "Technology", icon: Laptop, color: "bg-blue-100 text-blue-600", count: "120+ events" },
  { name: "Business", icon: Briefcase, color: "bg-gray-100 text-gray-600", count: "90+ events" },
  { name: "Arts", icon: Palette, color: "bg-pink-100 text-pink-600", count: "60+ events" },
  { name: "Food", icon: UtensilsCrossed, color: "bg-orange-100 text-orange-600", count: "45+ events" },
  { name: "Education", icon: GraduationCap, color: "bg-indigo-100 text-indigo-600", count: "70+ events" },
  { name: "Other", icon: MoreHorizontal, color: "bg-yellow-100 text-yellow-600", count: "30+ events" },
]

const Categories = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Browse by Category</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find events that match your interests. From music festivals to tech conferences, we have something for
            everyone.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => {
            const IconComponent = category.icon
            return (
              <Link
                key={category.name}
                to={`/events?category=${category.name.toLowerCase()}`}
                className="group p-6 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-300 text-center"
              >
                <div
                  className={`w-16 h-16 rounded-full ${category.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <IconComponent className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{category.name}</h3>
                <p className="text-sm text-gray-500">{category.count}</p>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Categories

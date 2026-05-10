import { Link } from 'react-router-dom'

export const TripDetailsPage: React.FC = () => {
  return (
    <div className="bg-white border border-brand-border rounded-[36px] overflow-hidden">
      <div
        className="h-[420px] bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=1600&auto=format&fit=crop')",
        }}
      />

      <div className="p-10">
        <h1 className="text-6xl font-black mb-6">Paris Escape</h1>

        <p className="text-brand-muted text-lg mb-8 max-w-3xl">
          Luxury travel experience inspired directly from your premium travel mockup.
        </p>

        <div className="flex gap-4">
          <Link
            to="/trip/1/itinerary"
            className="bg-brand-gold px-8 py-4 rounded-2xl font-black hover:scale-105 transition"
          >
            View Itinerary
          </Link>

          <Link
            to="/trip/1/budget"
            className="bg-brand-light px-8 py-4 rounded-2xl font-black hover:bg-brand-border transition"
          >
            View Budget
          </Link>
        </div>
      </div>
    </div>
  )
}

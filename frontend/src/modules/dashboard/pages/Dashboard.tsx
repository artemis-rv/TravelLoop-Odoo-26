import { Link } from 'react-router-dom'
import { useTripStore } from '@/store/trip.store'
import { EmptyState } from '@/components/common/EmptyState'

export const Dashboard: React.FC = () => {
  const trips = useTripStore((state) => state.trips)

  const trips_list = [
    {
      title: 'Bali Adventure',
      image:
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&auto=format&fit=crop',
    },
    {
      title: 'Tokyo Nights',
      image:
        'https://images.unsplash.com/photo-1549692520-acc6669e2f0c?q=80&w=1600&auto=format&fit=crop',
    },
    {
      title: 'Swiss Escape',
      image:
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1600&auto=format&fit=crop',
    },
  ]

  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <section
        className="rounded-[36px] overflow-hidden min-h-[450px] flex items-end p-12 text-white"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,.45), rgba(0,0,0,.6)), url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1600&auto=format&fit=crop')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="max-w-2xl">
          <h1 className="text-6xl font-black leading-tight mb-6">Explore The World Beautifully</h1>

          <p className="text-lg text-white/80 mb-8 leading-relaxed">
            Create luxurious travel experiences, manage itineraries, budgets, notes and community trips.
          </p>

          <div className="flex gap-4">
            <Link
              to="/trip/create"
              className="bg-brand-gold text-brand-dark px-8 py-4 rounded-2xl font-bold hover:scale-105 transition"
            >
              Create Trip
            </Link>

            <Link
              to="/community"
              className="bg-white/10 border border-white/20 px-8 py-4 rounded-2xl font-bold hover:bg-white/20 transition"
            >
              Explore Community
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {[
          ['Trips Planned', trips.length.toString()],
          ['Countries', '12'],
          ['Saved Budget', '$8.4K'],
          ['Flights', '4'],
        ].map((item) => (
          <div
            key={item[0]}
            className="bg-white border border-brand-border rounded-[30px] p-8"
          >
            <p className="text-brand-muted mb-4">{item[0]}</p>
            <h2 className="text-5xl font-black">{item[1]}</h2>
          </div>
        ))}
      </section>

      {/* Trips Section */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-4xl font-black">Upcoming Trips</h2>
          <Link
            to="/trip/create"
            className="bg-brand-gold px-6 py-3 rounded-2xl font-bold hover:scale-105 transition"
          >
            Create New
          </Link>
        </div>

        {trips.length === 0 ? (
          <div className="bg-white rounded-[30px] border border-brand-border p-8">
            <EmptyState
              icon="✈️"
              title="No trips yet"
              description="Start planning your next adventure"
              action={{
                label: 'Create Trip',
                onClick: () => window.location.href = '/trip/create',
              }}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {trips_list.map((trip) => (
              <div
                key={trip.title}
                className="bg-white rounded-[30px] overflow-hidden border border-brand-border"
              >
                <div
                  className="h-72 bg-cover bg-center"
                  style={{ backgroundImage: `url(${trip.image})` }}
                />

                <div className="p-6">
                  <h3 className="text-3xl font-black mb-4">{trip.title}</h3>

                  <div className="flex gap-3">
                    <Link
                      to="/trip/1"
                      className="flex-1 bg-brand-gold text-center py-3 rounded-2xl font-bold hover:scale-105 transition"
                    >
                      View
                    </Link>

                    <Link
                      to="/trip/1/budget"
                      className="bg-brand-light px-5 py-3 rounded-2xl font-bold hover:bg-brand-border transition"
                    >
                      Budget
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

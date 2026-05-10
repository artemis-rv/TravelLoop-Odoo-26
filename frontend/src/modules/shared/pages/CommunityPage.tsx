import { Link } from 'react-router-dom'

export const CommunityPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-5xl font-black mb-10">Travel Community</h1>

      <div className="space-y-6">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="bg-white border border-brand-border rounded-[30px] p-8"
          >
            <h2 className="text-3xl font-black mb-4">Backpacking Europe 🌍</h2>

            <p className="text-brand-muted mb-6">
              Discover routes, hotels, itineraries and shared experiences.
            </p>

            <div className="flex gap-4">
              <button className="bg-brand-light px-5 py-3 rounded-2xl font-bold hover:bg-brand-border transition">
                ❤️ 142
              </button>

              <button className="bg-brand-light px-5 py-3 rounded-2xl font-bold hover:bg-brand-border transition">
                💬 38
              </button>

              <Link
                to="/"
                className="bg-brand-gold px-5 py-3 rounded-2xl font-bold hover:scale-105 transition"
              >
                Back Home
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

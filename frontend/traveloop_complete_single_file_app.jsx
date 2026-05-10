import { BrowserRouter, Routes, Route, NavLink, Link, Outlet } from 'react-router-dom'

function Sidebar() {
  const items = [
    ['Dashboard', '/'],
    ['Create Trip', '/create-trip'],
    ['Itinerary', '/itinerary'],
    ['Budget', '/budget'],
    ['Checklist', '/checklist'],
    ['Notes', '/notes'],
    ['Community', '/community'],
  ]

  return (
    <aside className="w-72 min-h-screen bg-[#1A1209] border-r border-[#2A1D10] p-6 hidden lg:block">
      <h1 className="text-4xl font-black mb-10 text-[#D4A017] tracking-tight">
        TravelLoop
      </h1>

      <div className="space-y-3">
        {items.map(([label, path]) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `block px-5 py-4 rounded-2xl font-semibold transition-all duration-300 ${
                isActive
                  ? 'bg-[#D4A017] text-[#1A1209] shadow-lg shadow-[#D4A017]/30'
                  : 'bg-[#24180d] text-[#F5EDD6] hover:bg-[#332316]'
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </div>
    </aside>
  )
}

function Layout() {
  return (
    <div className="flex min-h-screen bg-[#FAF6EE] text-[#1A1209]">
      <Sidebar />

      <div className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-50 bg-[#FAF6EE]/90 backdrop-blur-xl border-b border-[#E8DEC8] px-8 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black">Travel Planner</h2>
            <p className="text-[#7B6A58] text-sm">
              Premium futuristic travel dashboard
            </p>
          </div>

          <div className="flex items-center gap-4">
            <input
              placeholder="Search destinations..."
              className="bg-white border border-[#E8DEC8] px-5 py-3 rounded-2xl outline-none w-72"
            />

            <div className="w-12 h-12 rounded-full bg-[#D4A017] flex items-center justify-center text-[#1A1209] font-bold">
              A
            </div>
          </div>
        </header>

        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

function Dashboard() {
  const trips = [
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
          <h1 className="text-6xl font-black leading-tight mb-6">
            Explore The World Beautifully
          </h1>

          <p className="text-lg text-white/80 mb-8 leading-relaxed">
            Create luxurious travel experiences, manage itineraries,
            budgets, notes and community trips.
          </p>

          <div className="flex gap-4">
            <Link
              to="/create-trip"
              className="bg-[#D4A017] text-[#1A1209] px-8 py-4 rounded-2xl font-bold hover:scale-105 transition"
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

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {[
          ['Trips Planned', '18'],
          ['Countries', '12'],
          ['Saved Budget', '$8.4K'],
          ['Flights', '4'],
        ].map((item) => (
          <div
            key={item[0]}
            className="bg-white border border-[#E8DEC8] rounded-[30px] p-8"
          >
            <p className="text-[#7B6A58] mb-4">{item[0]}</p>

            <h2 className="text-5xl font-black">{item[1]}</h2>
          </div>
        ))}
      </section>

      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-4xl font-black">Upcoming Trips</h2>

          <Link
            to="/itinerary"
            className="bg-[#D4A017] px-6 py-3 rounded-2xl font-bold hover:scale-105 transition"
          >
            Open Itinerary
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <div
              key={trip.title}
              className="bg-white rounded-[30px] overflow-hidden border border-[#E8DEC8]"
            >
              <div
                className="h-72 bg-cover bg-center"
                style={{ backgroundImage: `url(${trip.image})` }}
              />

              <div className="p-6">
                <h3 className="text-3xl font-black mb-4">
                  {trip.title}
                </h3>

                <div className="flex gap-3">
                  <Link
                    to="/budget"
                    className="flex-1 bg-[#D4A017] text-center py-3 rounded-2xl font-bold hover:scale-105 transition"
                  >
                    View Budget
                  </Link>

                  <Link
                    to="/trip/1"
                    className="bg-[#F5EDD6] px-5 py-3 rounded-2xl font-bold hover:bg-[#eadcb9] transition"
                  >
                    Open
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function CreateTrip() {
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-[36px] border border-[#E8DEC8] p-10">
      <h1 className="text-5xl font-black mb-10">Create New Trip</h1>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <input className="border border-[#E8DEC8] p-4 rounded-2xl" placeholder="Destination" />
        <input className="border border-[#E8DEC8] p-4 rounded-2xl" placeholder="Travelers" />
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <input type="date" className="border border-[#E8DEC8] p-4 rounded-2xl" />
        <input type="date" className="border border-[#E8DEC8] p-4 rounded-2xl" />
      </div>

      <textarea
        className="border border-[#E8DEC8] p-4 rounded-2xl w-full h-40 mb-8"
        placeholder="Describe your dream trip..."
      />

      <div className="flex gap-4">
        <button className="bg-[#D4A017] px-8 py-4 rounded-2xl font-black hover:scale-105 transition">
          Save Trip
        </button>

        <Link
          to="/"
          className="bg-[#F5EDD6] px-8 py-4 rounded-2xl font-black hover:bg-[#eadcb9] transition"
        >
          Cancel
        </Link>
      </div>
    </div>
  )
}

function TimelineView() {
  return (
    <div>
      <h1 className="text-5xl font-black mb-10">Travel Itinerary</h1>

      <div className="space-y-6">
        {[
          ['DAY 1', 'Flight to Paris'],
          ['DAY 2', 'Eiffel Tower Tour'],
          ['DAY 3', 'Train to Rome'],
          ['DAY 4', 'Beach Resort'],
        ].map((item) => (
          <div
            key={item[0]}
            className="bg-white border border-[#E8DEC8] rounded-[28px] p-8"
          >
            <div className="text-[#D4A017] font-black mb-3 text-lg">
              {item[0]}
            </div>

            <h2 className="text-3xl font-black">{item[1]}</h2>
          </div>
        ))}
      </div>
    </div>
  )
}

function BudgetPage() {
  return (
    <div>
      <h1 className="text-5xl font-black mb-10">Budget Planner</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        {[
          ['Hotels', '$1200'],
          ['Flights', '$950'],
          ['Food', '$450'],
          ['Activities', '$600'],
        ].map((item) => (
          <div
            key={item[0]}
            className="bg-white border border-[#E8DEC8] rounded-[28px] p-8"
          >
            <p className="text-[#7B6A58] mb-4">{item[0]}</p>
            <h2 className="text-5xl font-black">{item[1]}</h2>
          </div>
        ))}
      </div>

      <Link
        to="/checklist"
        className="bg-[#D4A017] px-8 py-4 rounded-2xl font-black inline-block hover:scale-105 transition"
      >
        Open Checklist
      </Link>
    </div>
  )
}

function ChecklistPage() {
  return (
    <div>
      <h1 className="text-5xl font-black mb-10">Packing Checklist</h1>

      <div className="space-y-5 mb-10">
        {['Passport', 'Camera', 'Power Bank', 'Jackets'].map((item) => (
          <div
            key={item}
            className="bg-white border border-[#E8DEC8] rounded-2xl p-5 flex items-center gap-4"
          >
            <input type="checkbox" className="w-5 h-5" />
            <span className="text-lg">{item}</span>
          </div>
        ))}
      </div>

      <Link
        to="/notes"
        className="bg-[#D4A017] px-8 py-4 rounded-2xl font-black inline-block hover:scale-105 transition"
      >
        Continue To Notes
      </Link>
    </div>
  )
}

function NotesPage() {
  return (
    <div>
      <h1 className="text-5xl font-black mb-10">Travel Notes</h1>

      <div className="bg-white border border-[#E8DEC8] rounded-[30px] p-8 mb-8">
        <textarea
          className="w-full h-72 border border-[#E8DEC8] rounded-2xl p-5"
          placeholder="Write memories, plans and notes..."
        />
      </div>

      <Link
        to="/community"
        className="bg-[#D4A017] px-8 py-4 rounded-2xl font-black inline-block hover:scale-105 transition"
      >
        Open Community
      </Link>
    </div>
  )
}

function CommunityPage() {
  return (
    <div>
      <h1 className="text-5xl font-black mb-10">Travel Community</h1>

      <div className="space-y-6">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="bg-white border border-[#E8DEC8] rounded-[30px] p-8"
          >
            <h2 className="text-3xl font-black mb-4">
              Backpacking Europe 🌍
            </h2>

            <p className="text-[#7B6A58] mb-6">
              Discover routes, hotels, itineraries and shared experiences.
            </p>

            <div className="flex gap-4">
              <button className="bg-[#F5EDD6] px-5 py-3 rounded-2xl font-bold hover:bg-[#eadcb9] transition">
                ❤️ 142
              </button>

              <button className="bg-[#F5EDD6] px-5 py-3 rounded-2xl font-bold hover:bg-[#eadcb9] transition">
                💬 38
              </button>

              <Link
                to="/"
                className="bg-[#D4A017] px-5 py-3 rounded-2xl font-bold hover:scale-105 transition"
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

function TripDetails() {
  return (
    <div className="bg-white border border-[#E8DEC8] rounded-[36px] overflow-hidden">
      <div
        className="h-[420px] bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=1600&auto=format&fit=crop')",
        }}
      />

      <div className="p-10">
        <h1 className="text-6xl font-black mb-6">Paris Escape</h1>

        <p className="text-[#7B6A58] text-lg mb-8 max-w-3xl">
          Luxury travel experience inspired directly from your premium travel
          mockup.
        </p>

        <div className="flex gap-4">
          <Link
            to="/itinerary"
            className="bg-[#D4A017] px-8 py-4 rounded-2xl font-black hover:scale-105 transition"
          >
            View Itinerary
          </Link>

          <Link
            to="/budget"
            className="bg-[#F5EDD6] px-8 py-4 rounded-2xl font-black hover:bg-[#eadcb9] transition"
          >
            View Budget
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="create-trip" element={<CreateTrip />} />
          <Route path="itinerary" element={<TimelineView />} />
          <Route path="budget" element={<BudgetPage />} />
          <Route path="checklist" element={<ChecklistPage />} />
          <Route path="notes" element={<NotesPage />} />
          <Route path="community" element={<CommunityPage />} />
          <Route path="trip/:id" element={<TripDetails />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

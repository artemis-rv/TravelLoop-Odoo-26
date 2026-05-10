export const ItineraryPage: React.FC = () => {
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
            className="bg-white border border-brand-border rounded-[28px] p-8"
          >
            <div className="text-brand-gold font-black mb-3 text-lg">{item[0]}</div>
            <h2 className="text-3xl font-black">{item[1]}</h2>
          </div>
        ))}
      </div>
    </div>
  )
}

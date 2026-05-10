import { Link } from 'react-router-dom'

export const BudgetPage: React.FC = () => {
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
            className="bg-white border border-brand-border rounded-[28px] p-8"
          >
            <p className="text-brand-muted mb-4">{item[0]}</p>
            <h2 className="text-5xl font-black">{item[1]}</h2>
          </div>
        ))}
      </div>

      <Link
        to="/trip/1/checklist"
        className="bg-brand-gold px-8 py-4 rounded-2xl font-black inline-block hover:scale-105 transition"
      >
        Open Checklist
      </Link>
    </div>
  )
}

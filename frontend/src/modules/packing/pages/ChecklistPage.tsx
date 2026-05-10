import { Link } from 'react-router-dom'

export const ChecklistPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-5xl font-black mb-10">Packing Checklist</h1>

      <div className="space-y-5 mb-10">
        {['Passport', 'Camera', 'Power Bank', 'Jackets'].map((item) => (
          <div
            key={item}
            className="bg-white border border-brand-border rounded-2xl p-5 flex items-center gap-4"
          >
            <input type="checkbox" className="w-5 h-5" />
            <span className="text-lg">{item}</span>
          </div>
        ))}
      </div>

      <Link
        to="/trip/1/notes"
        className="bg-brand-gold px-8 py-4 rounded-2xl font-black inline-block hover:scale-105 transition"
      >
        Continue To Notes
      </Link>
    </div>
  )
}

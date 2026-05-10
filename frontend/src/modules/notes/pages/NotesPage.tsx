import { Link } from 'react-router-dom'

export const NotesPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-5xl font-black mb-10">Travel Notes</h1>

      <div className="bg-white border border-brand-border rounded-[30px] p-8 mb-8">
        <textarea
          className="w-full h-72 border border-brand-border rounded-2xl p-5 outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition-all"
          placeholder="Write memories, plans and notes..."
        />
      </div>

      <Link
        to="/community"
        className="bg-brand-gold px-8 py-4 rounded-2xl font-black inline-block hover:scale-105 transition"
      >
        Open Community
      </Link>
    </div>
  )
}

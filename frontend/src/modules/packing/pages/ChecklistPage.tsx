import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTripStore } from '@/store/trip.store'
import { Loader } from '@/components/common/Loader'
import { EmptyState } from '@/components/common/EmptyState'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import api from '@/services/api'
import toast from 'react-hot-toast'
import { PackingItem } from '@/types'

export const ChecklistPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const selectedTrip = useTripStore((state) => state.selectedTrip)
  const setSelectedTrip = useTripStore((state) => state.setSelectedTrip)
  const isLoading = useTripStore((state) => state.isLoading)
  const setLoading = useTripStore((state) => state.setLoading)
  const [packingItems, setPackingItems] = useState<PackingItem[]>([])
  const [newItem, setNewItem] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (id) {
      if (!selectedTrip) {
        fetchTrip(id)
      } else {
        loadPackingItems(id)
      }
    }
  }, [id, selectedTrip])

  const fetchTrip = async (tripId: string) => {
    setLoading(true)
    try {
      const response = await api.get(`/trips/${tripId}`)
      setSelectedTrip(response.data.trip)
      setPackingItems(response.data.trip.packing || [])
    } catch (err: any) {
      console.error('Failed to fetch trip:', err)
      toast.error('Failed to load trip')
    } finally {
      setLoading(false)
    }
  }

  const loadPackingItems = async (tripId: string) => {
    try {
      const response = await api.get(`/trips/${tripId}`)
      setPackingItems(response.data.trip.packing || [])
    } catch (err: any) {
      console.error('Failed to fetch packing items:', err)
    }
  }

  const handleToggleItem = async (itemId: string) => {
    try {
      await api.patch(`/packing/${itemId}/toggle`)
      setPackingItems(
        packingItems.map((item) =>
          item.id === itemId ? { ...item, is_packed: !item.is_packed } : item
        )
      )
      toast.success('Item updated')
    } catch (err: any) {
      console.error('Failed to toggle item:', err)
      toast.error('Failed to update item')
    }
  }

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newItem.trim()) return

    setSubmitting(true)
    try {
      const response = await api.post(`/trips/${id}/packing`, {
        item_name: newItem,
      })
      setPackingItems([...packingItems, response.data])
      setNewItem('')
      toast.success('Item added')
    } catch (err: any) {
      console.error('Failed to add item:', err)
      toast.error('Failed to add item')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteItem = async (itemId: string) => {
    try {
      await api.delete(`/packing/${itemId}`)
      setPackingItems(packingItems.filter((item) => item.id !== itemId))
      toast.success('Item removed')
    } catch (err: any) {
      console.error('Failed to delete item:', err)
      toast.error('Failed to remove item')
    }
  }

  if (isLoading) {
    return <Loader fullScreen />
  }

  return (
    <div>
      <h1 className="text-5xl font-black mb-10">Packing Checklist</h1>

      <form onSubmit={handleAddItem} className="bg-white border border-brand-border rounded-[28px] p-6 mb-8">
        <div className="flex gap-3">
          <Input
            placeholder="Add new item..."
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
          />
          <Button type="submit" loading={submitting}>
            Add
          </Button>
        </div>
      </form>

      {packingItems.length === 0 ? (
        <EmptyState
          icon="🧳"
          title="No items yet"
          description="Add items to your packing list"
        />
      ) : (
        <div className="space-y-5 mb-10">
          {packingItems.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-brand-border rounded-2xl p-5 flex items-center gap-4"
            >
              <input
                type="checkbox"
                checked={item.is_packed || false}
                onChange={() => handleToggleItem(item.id)}
                className="w-5 h-5 cursor-pointer"
              />
              <span className={`text-lg flex-1 ${item.is_packed ? 'line-through text-gray-400' : ''}`}>
                {item.item_name}
              </span>
              <button
                onClick={() => handleDeleteItem(item.id)}
                className="text-red-500 hover:text-red-700 font-semibold"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      <Link
        to={`/trip/${id}/notes`}
        className="bg-brand-gold px-8 py-4 rounded-2xl font-black inline-block hover:scale-105 transition"
      >
        Continue To Notes
      </Link>
    </div>
  )
}

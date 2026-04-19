import { useEffect, useMemo, useState } from 'react'
import BuyerCard from '../components/BuyerCard'
import PageWrapper from '../components/PageWrapper'
import { useTheme } from '../components/ThemeContext'
import { getAgentDashboard } from '../api/api'

export default function InboxPage() {
  const { isDark } = useTheme()
  const [buyers, setBuyers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true)
        setError('')

        const data = await getAgentDashboard()
        setBuyers(Array.isArray(data.buyers) ? data.buyers : [])
      } catch (err) {
        console.error('Dashboard load failed:', err)
        setError(err.message || 'Failed to load dashboard')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [])

  const buyerCards = useMemo(() => {
    return buyers.map((buyer) => ({
      id: buyer.buyer_id,
      name: buyer.buyer_name,
      budget: buyer.top_fit_score ? `Top fit: ${buyer.top_fit_score}` : 'Not available',
      readiness: buyer.readiness || 'Unknown',
      urgency: buyer.urgency || 'Normal',
      primaryDriver: buyer.primary_driver || 'Not available',
      nextAction: buyer.next_best_action || 'Follow up',
    }))
  }, [buyers])

  if (loading) {
    return (
      <PageWrapper maxWidth="max-w-6xl">
        <div className="p-8 text-lg">Loading dashboard...</div>
      </PageWrapper>
    )
  }

  if (error) {
    return (
      <PageWrapper maxWidth="max-w-6xl">
        <div className="p-8 text-lg text-red-500">{error}</div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper maxWidth="max-w-6xl">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className={`text-sm font-medium uppercase tracking-[0.2em] ${isDark ? 'muted-dark' : 'muted-light'}`}>
            BuyerTwin AI
          </p>
          <h1 className="mt-2 text-3xl font-bold">Buyer Inbox</h1>
          <p className={`mt-2 text-sm ${isDark ? 'muted-dark' : 'muted-light'}`}>
            Active buyers, readiness stage, urgency, and next best action.
          </p>
        </div>

        <div className={`rounded-3xl px-4 py-3 ${isDark ? 'surface-dark' : 'surface-light'}`}>
          <p className={`text-xs uppercase tracking-wide ${isDark ? 'muted-dark' : 'muted-light'}`}>
            Active Buyers
          </p>
          <p className="mt-1 text-2xl font-semibold">{buyerCards.length}</p>
        </div>
      </div>

      {buyerCards.length === 0 ? (
        <div className="p-8 text-base">No buyers found.</div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {buyerCards.map((buyer) => (
            <BuyerCard key={buyer.id} buyer={buyer} />
          ))}
        </div>
      )}
    </PageWrapper>
  )
}
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import ListingCard from '../components/ListingCard'
import PageWrapper from '../components/PageWrapper'
import { useTheme } from '../components/ThemeContext'
import { getBuyerById, getBuyerRecommendations } from '../api/api'

export default function ListingsPage() {
  const { id } = useParams()
  const { isDark } = useTheme()

  const [buyer, setBuyer] = useState(null)
  const [rankedListings, setRankedListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError('')

        const [buyerData, recommendationsData] = await Promise.all([
          getBuyerById(id),
          getBuyerRecommendations(id),
        ])

        setBuyer(buyerData)

        const listings = Array.isArray(recommendationsData)
          ? recommendationsData
          : recommendationsData.recommendations || []

        setRankedListings(listings.slice(0, 5))
      } catch (err) {
        console.error('Listings page load failed:', err)
        setError(err.message || 'Failed to load listings')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  if (loading) {
    return (
      <PageWrapper maxWidth="max-w-6xl">
        <div className="p-10 text-xl">Loading listings...</div>
      </PageWrapper>
    )
  }

  if (error) {
    return (
      <PageWrapper maxWidth="max-w-6xl">
        <div className="p-10 text-xl text-red-500">{error}</div>
      </PageWrapper>
    )
  }

  if (!buyer) {
    return (
      <PageWrapper maxWidth="max-w-6xl">
        <div className="p-10 text-xl">Buyer not found.</div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper maxWidth="max-w-6xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Listings Match Page</h1>
          <p className={`mt-1 text-sm ${isDark ? 'muted-dark' : 'muted-light'}`}>
            Top recommended homes for {buyer.name}
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            to={`/buyer/${buyer.id}/recommendations-preview`}
            className={`rounded-2xl px-4 py-3 text-sm font-semibold ${
              isDark ? 'primary-btn-dark' : 'primary-btn-light'
            }`}
          >
            Open Buyer View
          </Link>

          <Link
            to={`/buyer/${buyer.id}`}
            className={`rounded-2xl px-4 py-3 text-sm font-semibold ${
              isDark ? 'secondary-btn-dark' : 'secondary-btn-light'
            }`}
          >
            Back to Buyer
          </Link>
        </div>
      </div>

      {rankedListings.length === 0 ? (
        <div className="p-8 text-base">No recommendations found.</div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {rankedListings.map((listing, index) => (
            <motion.div
              key={listing.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <ListingCard listing={listing} />
            </motion.div>
          ))}
        </div>
      )}
    </PageWrapper>
  )
}
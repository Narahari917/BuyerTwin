import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import StatCard from '../components/StatCard'
import TimelineItem from '../components/TimelineItem'
import ScoreBar from '../components/ScoreBar'
import { getBuyerById, apiRequest } from '../api/api'

function formatBudget(min, max) {
  if (min == null && max == null) return 'Budget not set'
  if (min == null) return `Up to $${Number(max).toLocaleString()}`
  if (max == null) return `From $${Number(min).toLocaleString()}`
  return `$${Number(min).toLocaleString()} - $${Number(max).toLocaleString()}`
}

function mapEventType(eventType) {
  const mapping = {
    listing_viewed: 'Viewed listing',
    listing_saved: 'Saved listing',
    listing_unsaved: 'Removed saved listing',
    listing_skipped: 'Skipped listing',
    tour_requested: 'Requested tour',
    message_clicked: 'Clicked message',
    message_replied: 'Replied to message',
  }
  return mapping[eventType] || eventType
}

async function getBuyerEvents(buyerId) {
  return apiRequest(`/buyers/${buyerId}/events`, {
    method: 'GET',
  })
}

async function getBuyerDashboard(buyerId) {
  return apiRequest(`/buyers/${buyerId}/dashboard`, {
    method: 'GET',
  })
}

export default function BuyerDetailPage() {
  const { id } = useParams()

  const [buyer, setBuyer] = useState(null)
  const [buyerEvents, setBuyerEvents] = useState([])
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError('')

        const [buyerData, eventsData, dashboardData] = await Promise.all([
          getBuyerById(id),
          getBuyerEvents(id),
          getBuyerDashboard(id),
        ])

        console.log('Buyer detail buyer:', buyerData)
        console.log('Buyer detail events:', eventsData)
        console.log('Buyer detail dashboard:', dashboardData)

        setBuyer(buyerData)
        setBuyerEvents(Array.isArray(eventsData) ? eventsData : [])
        setDashboard(dashboardData || null)
      } catch (err) {
        console.error('Buyer detail load failed:', err)
        setError(err.message || 'Failed to load buyer details')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  const timelineEvents = useMemo(() => {
    return buyerEvents.map((event) => ({
      id: event.id,
      type: mapEventType(event.event_type),
      text:
        event.metadata?.note ||
        `${mapEventType(event.event_type)}${event.listing_id ? ` - ${event.listing_id}` : ''}`,
      time: event.timestamp ? new Date(event.timestamp).toLocaleString() : 'Unknown time',
    }))
  }, [buyerEvents])

  if (loading) {
    return <div className="min-h-screen bg-slate-100 p-10 text-xl">Loading buyer details...</div>
  }

  if (error) {
    return <div className="min-h-screen bg-slate-100 p-10 text-xl text-red-500">{error}</div>
  }

  if (!buyer) {
    return <div className="min-h-screen bg-slate-100 p-10 text-xl">Buyer not found.</div>
  }

  const summary = dashboard?.summary || {}
  const twin = dashboard?.twin || {}
  const backendBuyer = dashboard?.buyer || {}
  const savedListings = dashboard?.saved_listings || []
  const savedCount = dashboard?.saved_count || savedListings.length || 0

  const readiness =
    summary.readiness ||
    twin.tour_readiness ||
    dashboard?.readiness ||
    'Unknown'

  const urgency =
    summary.urgency ||
    twin.urgency ||
    'Normal'

  const primaryDriver =
    summary.primary_driver ||
    twin.primary_driver ||
    'Not available'

  const confidence =
    twin.confidence_score ||
    summary.confidence_score ||
    0

  const twinSummary =
    twin.summary ||
    summary.twin_summary ||
    summary.explanation ||
    'Decision twin summary not available yet.'

  const nextAction =
    summary.next_best_action ||
    dashboard?.next_best_action ||
    'Share best-fit listings and continue follow-up.'

  return (
    <div className="min-h-screen bg-slate-100 p-6 md:p-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{buyer.name}</h1>
            <p className="mt-1 text-sm text-slate-500">
              Buyer profile, decision twin, timeline, and next action
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              to={`/buyer/${buyer.id}/listings`}
              className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
            >
              View Listings
            </Link>

            <Link
              to={`/buyer/${buyer.id}/outreach`}
              className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900"
            >
              Outreach Studio
            </Link>

            <Link
              to="/inbox"
              className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900"
            >
              Back to Inbox
            </Link>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Budget"
            value={formatBudget(buyer.budget_min, buyer.budget_max)}
          />
          <StatCard label="Timeline" value={buyer.timeline || backendBuyer.timeline || 'Not set'} />
          <StatCard label="Primary Driver" value={primaryDriver} />
          <StatCard label="Readiness" value={readiness} />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Inquiry Summary</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {buyer.inquiry_text || backendBuyer.inquiry_text || 'No inquiry summary available.'}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Must-Have Features</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {(buyer.must_have_features || backendBuyer.must_have_features || []).map((feature) => (
                  <span
                    key={feature}
                    className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Behavior Timeline</h2>
              <div className="mt-4 space-y-3">
                {timelineEvents.length === 0 ? (
                  <p className="text-sm text-slate-500">No events found.</p>
                ) : (
                  timelineEvents.map((event) => (
                    <TimelineItem key={event.id} {...event} />
                  ))
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">
                Saved Properties ({savedCount})
              </h2>

              {savedListings.length === 0 ? (
                <p className="mt-3 text-sm text-slate-500">No saved properties yet.</p>
              ) : (
                <div className="mt-4 space-y-4">
                  {savedListings.map((listing) => (
                    <div
                      key={listing.id}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-base font-semibold text-slate-900">
                            {listing.address_label}
                          </h3>
                          <p className="mt-1 text-sm text-slate-500">
                            {listing.city} • {listing.neighborhood}
                          </p>
                        </div>

                        <p className="text-sm font-semibold text-slate-900">
                          ${Number(listing.price).toLocaleString()}
                        </p>
                      </div>

                      {(Number(listing.bedrooms) > 0 || Number(listing.bathrooms) > 0 || Number(listing.sqft) > 0) ? (
                        <p className="mt-3 text-sm text-slate-600">
                          {Number(listing.bedrooms) > 0 ? `${listing.bedrooms} bd` : ''}
                          {Number(listing.bedrooms) > 0 && Number(listing.bathrooms) > 0 ? ' • ' : ''}
                          {Number(listing.bathrooms) > 0 ? `${listing.bathrooms} ba` : ''}
                          {(Number(listing.bedrooms) > 0 || Number(listing.bathrooms) > 0) && Number(listing.sqft) > 0 ? ' • ' : ''}
                          {Number(listing.sqft) > 0 ? `${listing.sqft} sqft` : ''}
                        </p>
                      ) : null}

                      <div className="mt-3 flex flex-wrap gap-2">
                        {(listing.tags || []).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {listing.description ? (
                        <p className="mt-3 text-sm leading-6 text-slate-600">
                          {listing.description}
                        </p>
                      ) : null}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Decision Twin</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{twinSummary}</p>
              <div className="mt-5">
                <ScoreBar value={confidence} />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Next Best Action</h2>
              <p className="mt-3 text-sm text-slate-600">{nextAction}</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Contact</h2>
              <p className="mt-3 text-sm text-slate-600">{buyer.email || backendBuyer.email || 'No email'}</p>
              <p className="mt-1 text-sm text-slate-600">{buyer.phone || backendBuyer.phone || 'No phone'}</p>
              <p className="mt-3 text-sm text-slate-500">
                Urgency: <span className="font-medium text-slate-800">{urgency}</span>
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Desired locations:{' '}
                <span className="font-medium text-slate-800">
                  {(buyer.desired_locations || backendBuyer.desired_locations || []).join(', ') || 'Not set'}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
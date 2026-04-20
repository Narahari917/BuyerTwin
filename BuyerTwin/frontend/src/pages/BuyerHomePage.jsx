import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Search,
  MapPin,
  SlidersHorizontal,
  Heart,
  CalendarDays,
  Sparkles,
  Bookmark,
  X,
} from 'lucide-react'
import PageWrapper from '../components/PageWrapper'
import { useTheme } from '../components/ThemeContext'
import { useAuth } from '../context/AuthContext'
import { arizonaHomes, arizonaCities, formatPrice } from '../data/arizonaHomes'
import { trackEvent } from '../api/events'
import BrandHeader from '../components/BrandHeader'
import AnimatedSection from '../components/AnimatedSection'
import AppFooter from '../components/AppFooter'

export default function BuyerHomePage() {
  const { id } = useParams()
  const { isDark } = useTheme()
  const { user, bootstrapping } = useAuth()

  const [search, setSearch] = useState('')
  const [city, setCity] = useState('All')
  const [maxPrice, setMaxPrice] = useState('Any')
  const [savedHomes, setSavedHomes] = useState([])
  const [showSavedPanel, setShowSavedPanel] = useState(false)

  if (bootstrapping) {
    return <div className="p-10 text-xl">Loading...</div>
  }

  const buyer = user && String(user.id) === String(id) ? user : null

  if (!buyer) {
    return <div className="p-10 text-xl">Buyer not found.</div>
  }

  const savedHomesStorageKey = `buyertwin-saved-homes-${buyer.id}`

  useEffect(() => {
    const raw = localStorage.getItem(savedHomesStorageKey)
    if (!raw) {
      setSavedHomes([])
      return
    }

    try {
      const parsed = JSON.parse(raw)
      setSavedHomes(Array.isArray(parsed) ? parsed : [])
    } catch {
      setSavedHomes([])
    }
  }, [savedHomesStorageKey])

  const persistSavedHomes = (homes) => {
    setSavedHomes(homes)
    localStorage.setItem(savedHomesStorageKey, JSON.stringify(homes))
  }

  const filteredHomes = useMemo(() => {
    return arizonaHomes.filter((home) => {
      const matchesSearch =
        home.title.toLowerCase().includes(search.toLowerCase()) ||
        home.city.toLowerCase().includes(search.toLowerCase()) ||
        home.neighborhood.toLowerCase().includes(search.toLowerCase()) ||
        home.tags.join(' ').toLowerCase().includes(search.toLowerCase())

      const matchesCity = city === 'All' ? true : home.city === city
      const matchesPrice = maxPrice === 'Any' ? true : home.price <= Number(maxPrice)

      return matchesSearch && matchesCity && matchesPrice
    })
  }, [search, city, maxPrice])

  const isSaved = (homeId) => savedHomes.some((home) => home.id === homeId)

  const handleSearchChange = async (value) => {
    setSearch(value)
    await trackEvent({
      userId: String(buyer.id),
      role: 'buyer',
      eventType: 'search_used',
      page: 'buyer_home',
      targetId: 'search_bar',
      metadata: { query: value },
    })
  }

  const handleCityChange = async (value) => {
    setCity(value)
    await trackEvent({
      userId: String(buyer.id),
      role: 'buyer',
      eventType: 'filter_clicked',
      page: 'buyer_home',
      targetId: 'city_filter',
      metadata: { city: value },
    })
  }

  const handlePriceChange = async (value) => {
    setMaxPrice(value)
    await trackEvent({
      userId: String(buyer.id),
      role: 'buyer',
      eventType: 'filter_clicked',
      page: 'buyer_home',
      targetId: 'price_filter',
      metadata: { max_price: value },
    })
  }

  const handleInterested = async (home) => {
    if (isSaved(home.id)) {
      alert(`${home.title} is already in your saved properties.`)
      return
    }

    const updatedHomes = [home, ...savedHomes]
    persistSavedHomes(updatedHomes)

    await trackEvent({
      userId: String(buyer.id),
      role: 'buyer',
      eventType: 'listing_saved',
      page: 'buyer_home',
      targetId: home.id,
      metadata: {
        title: home.title,
        city: home.city,
        price: home.price,
        neighborhood: home.neighborhood,
      },
    })

    alert(`Saved ${home.title}`)
  }

  const handleRemoveSavedHome = async (home) => {
    const updatedHomes = savedHomes.filter((savedHome) => savedHome.id !== home.id)
    persistSavedHomes(updatedHomes)

    await trackEvent({
      userId: String(buyer.id),
      role: 'buyer',
      eventType: 'listing_unsaved',
      page: 'buyer_home',
      targetId: home.id,
      metadata: {
        title: home.title,
        city: home.city,
        price: home.price,
        neighborhood: home.neighborhood,
      },
    })
  }

  const handleTour = async (home) => {
    await trackEvent({
      userId: String(buyer.id),
      role: 'buyer',
      eventType: 'tour_requested',
      page: 'buyer_home',
      targetId: home.id,
      metadata: {
        title: home.title,
        city: home.city,
        price: home.price,
      },
    })
    alert(`Tour requested for ${home.title}`)
  }

  const handleCardOpen = async (home) => {
    await trackEvent({
      userId: String(buyer.id),
      role: 'buyer',
      eventType: 'listing_viewed',
      page: 'buyer_home',
      targetId: home.id,
      metadata: {
        title: home.title,
        city: home.city,
        price: home.price,
      },
    })
  }

  return (
    <PageWrapper maxWidth="max-w-7xl">
      <BrandHeader
        title={`Welcome, ${buyer.name}`}
        subtitle="Start with exploration. As you search, filter, save, and request tours, the system can learn what matters to you and improve future recommendations."
      />

      <div className="mt-4 flex items-center justify-end">
        <button
          type="button"
          onClick={() => setShowSavedPanel((prev) => !prev)}
          className={`relative flex h-14 w-14 items-center justify-center rounded-full shadow-sm transition ${
            isDark ? 'surface-dark border border-white/10' : 'surface-light border border-slate-200'
          }`}
          aria-label="Open saved properties"
          title="Saved properties"
        >
          <Bookmark size={22} />
          {savedHomes.length > 0 ? (
            <span className="absolute -right-1 -top-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-slate-900 px-1 text-xs font-semibold text-white">
              {savedHomes.length}
            </span>
          ) : null}
        </button>
      </div>

      {showSavedPanel ? (
        <AnimatedSection delay={0.04}>
          <div className={`mt-4 rounded-[32px] p-6 md:p-8 ${isDark ? 'surface-dark' : 'surface-light'}`}>
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">Saved Properties</h2>
                <p className={`mt-1 text-sm ${isDark ? 'muted-dark' : 'muted-light'}`}>
                  Review homes you saved during browsing.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowSavedPanel(false)}
                className={`rounded-full p-2 ${isDark ? 'bg-white/5' : 'bg-slate-100'}`}
                aria-label="Close saved properties"
              >
                <X size={18} />
              </button>
            </div>

            {savedHomes.length === 0 ? (
              <p className={`text-sm ${isDark ? 'muted-dark' : 'muted-light'}`}>
                No saved properties yet.
              </p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {savedHomes.map((home) => (
                  <div
                    key={home.id}
                    className={`overflow-hidden rounded-[28px] ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}
                  >
                    <img
                      src={home.image}
                      alt={home.title}
                      className="h-44 w-full object-cover"
                    />

                    <div className="p-4">
                      <h3 className="text-lg font-semibold">{home.title}</h3>
                      <p className={`mt-1 text-sm ${isDark ? 'muted-dark' : 'muted-light'}`}>
                        {home.city} • {home.neighborhood}
                      </p>

                      <p className="mt-3 text-sm">
                        {home.bedrooms} bd • {home.bathrooms} ba • {home.sqft} sqft
                      </p>

                      <p className="mt-3 text-lg font-semibold">{formatPrice(home.price)}</p>

                      <div className="mt-4 flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleTour(home)}
                          className={`rounded-2xl px-4 py-3 text-sm font-semibold ${
                            isDark ? 'primary-btn-dark' : 'primary-btn-light'
                          }`}
                        >
                          Tour
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRemoveSavedHome(home)}
                          className={`rounded-2xl px-4 py-3 text-sm font-semibold ${
                            isDark ? 'secondary-btn-dark' : 'secondary-btn-light'
                          }`}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </AnimatedSection>
      ) : null}

      <AnimatedSection delay={0.06}>
        <div className={`mt-6 rounded-[32px] p-6 md:p-8 ${isDark ? 'surface-dark' : 'surface-light'}`}>
          <div className="grid gap-4 lg:grid-cols-[2fr_1fr_1fr]">
            <div className={`flex items-center gap-3 rounded-2xl px-4 py-4 ${isDark ? 'input-dark' : 'input-light'}`}>
              <Search size={18} />
              <input
                type="text"
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search by city, neighborhood, or feature"
                className="w-full bg-transparent outline-none"
              />
            </div>

            <div className={`flex items-center gap-3 rounded-2xl px-4 py-4 ${isDark ? 'input-dark' : 'input-light'}`}>
              <MapPin size={18} />
              <select
                value={city}
                onChange={(e) => handleCityChange(e.target.value)}
                className="w-full bg-transparent outline-none"
              >
                {arizonaCities.map((cityName) => (
                  <option key={cityName} value={cityName}>
                    {cityName}
                  </option>
                ))}
              </select>
            </div>

            <div className={`flex items-center gap-3 rounded-2xl px-4 py-4 ${isDark ? 'input-dark' : 'input-light'}`}>
              <SlidersHorizontal size={18} />
              <select
                value={maxPrice}
                onChange={(e) => handlePriceChange(e.target.value)}
                className="w-full bg-transparent outline-none"
              >
                <option value="Any">Any Price</option>
                <option value="350000">Up to $350k</option>
                <option value="450000">Up to $450k</option>
                <option value="550000">Up to $550k</option>
                <option value="700000">Up to $700k</option>
              </select>
            </div>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection delay={0.1}>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles size={18} />
              <h2 className="text-2xl font-bold">Arizona homes to explore</h2>
            </div>
            <p className={`mt-2 text-sm ${isDark ? 'muted-dark' : 'muted-light'}`}>
              Showing {filteredHomes.length} homes for first-time browsing.
            </p>
          </div>
        </div>
      </AnimatedSection>

      <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredHomes.map((home, index) => (
          <motion.div
            key={home.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
            whileHover={{ y: -6 }}
            onClick={() => handleCardOpen(home)}
            className={`overflow-hidden rounded-[30px] ${isDark ? 'surface-dark' : 'surface-light'}`}
          >
            <div className="relative">
              <img
                src={home.image}
                alt={home.title}
                className="h-60 w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/55 to-transparent" />
              <div className="absolute bottom-4 left-4 rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                {home.type}
              </div>
            </div>

            <div className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold">{home.title}</h3>
                  <p className={`mt-1 text-sm ${isDark ? 'muted-dark' : 'muted-light'}`}>
                    {home.city} • {home.neighborhood}
                  </p>
                </div>
              </div>

              <p className="mt-4 text-sm">
                {home.bedrooms} bd • {home.bathrooms} ba • {home.sqft} sqft
              </p>

              <p className={`mt-3 text-sm leading-6 ${isDark ? 'muted-dark' : 'muted-light'}`}>
                {home.description}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {home.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${isDark ? 'badge-dark' : 'badge-light'}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-5 flex items-center justify-between gap-4">
                <p className="text-lg font-semibold">{formatPrice(home.price)}</p>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleInterested(home)
                    }}
                    className={`rounded-2xl px-4 py-3 text-sm font-semibold ${
                      isDark ? 'secondary-btn-dark' : 'secondary-btn-light'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Heart size={16} />
                      {isSaved(home.id) ? 'Saved' : 'Save'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleTour(home)
                    }}
                    className={`rounded-2xl px-4 py-3 text-sm font-semibold ${
                      isDark ? 'primary-btn-dark' : 'primary-btn-light'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <CalendarDays size={16} />
                      Tour
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AppFooter />
    </PageWrapper>
  )
}
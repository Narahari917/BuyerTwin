const API_BASE = 'http://127.0.0.1:8000'

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem('buyertwin-token')

  try {
    const response = await fetch(`${API_BASE}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
      ...options,
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      console.error('API error response:', data)

      const detail =
        typeof data.detail === 'string'
          ? data.detail
          : JSON.stringify(data.detail || data.message || { status: response.status })

      throw new Error(detail)
    }

    return data
  } catch (error) {
    if (error.message === 'Failed to fetch') {
      throw new Error(
        'Cannot reach backend. Check if FastAPI is running and CORS allows http://localhost:5173'
      )
    }
    throw error
  }
}

export async function loginUser(payload) {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function registerUser(payload) {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function getCurrentUser() {
  return apiRequest('/auth/me', {
    method: 'GET',
  })
}

export async function postEvent(payload) {
  return apiRequest('/events', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function getBuyerRecommendations(buyerId) {
  return apiRequest(`/recommendations/${buyerId}`, {
    method: 'GET',
  })
}

export async function getAgentDashboard() {
  return apiRequest('/buyers/inbox', {
    method: 'GET',
  })
}

export async function getBuyerById(buyerId) {
  return apiRequest(`/buyers/${buyerId}`, {
    method: 'GET',
  })
}
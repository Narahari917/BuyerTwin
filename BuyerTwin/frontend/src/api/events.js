import { postEvent } from './api'

export async function trackEvent({
  userId,
  role,
  eventType,
  page,
  targetId,
  metadata = {},
}) {
  try {
    return await postEvent({
      user_id: userId,
      role,
      event_type: eventType,
      page,
      target_id: targetId,
      metadata,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Event tracking failed:', error.message)
    throw error
  }
}
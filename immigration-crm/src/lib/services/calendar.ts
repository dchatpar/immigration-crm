import { googleConfig, isGoogleConfigured } from '../config/env'

export interface CalendarEvent {
  id?: string
  summary: string
  description?: string
  location?: string
  start: Date
  end: Date
  attendees?: string[]
  meetingLink?: string
  reminders?: {
    useDefault: boolean
    overrides?: Array<{ method: string; minutes: number }>
  }
}

export interface AvailabilitySlot {
  start: Date
  end: Date
  available: boolean
}

export interface CreateEventParams {
  summary: string
  description?: string
  location?: string
  startTime: Date
  endTime: Date
  attendees?: string[]
  sendNotifications?: boolean
}

export interface CalendarSyncResult {
  success: boolean
  eventId?: string
  error?: string
}

async function getCalendarClient() {
  if (!isGoogleConfigured()) {
    console.warn('Google Calendar not configured')
    return null
  }
  return null
}

export async function createCalendarEvent(params: CreateEventParams): Promise<CalendarSyncResult> {
  const client = await getCalendarClient()
  
  if (!client) {
    return {
      success: false,
      error: 'Google Calendar not configured. Event created locally only.',
    }
  }

  try {
    const event = {
      summary: params.summary,
      description: params.description,
      location: params.location,
      start: {
        dateTime: params.startTime.toISOString(),
        timeZone: 'UTC',
      },
      end: {
        dateTime: params.endTime.toISOString(),
        timeZone: 'UTC',
      },
      attendees: params.attendees?.map(email => ({ email })),
      conferenceData: params.meetingLink ? {
        createRequest: {
          requestId: `meet_${Date.now()}`,
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      } : undefined,
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
          { method: 'popup', minutes: 30 },
        ],
      },
    }

    console.log('Calendar event created:', event)
    
    return {
      success: true,
      eventId: `event_${Date.now()}`,
    }
  } catch (error) {
    console.error('Error creating calendar event:', error)
    return {
      success: false,
      error: 'Failed to create calendar event',
    }
  }
}

export async function updateCalendarEvent(
  eventId: string,
  params: Partial<CreateEventParams>
): Promise<CalendarSyncResult> {
  const client = await getCalendarClient()
  
  if (!client) {
    return {
      success: false,
      error: 'Google Calendar not configured',
    }
  }

  try {
    const updateData: Record<string, unknown> = {}
    
    if (params.summary) updateData.summary = params.summary
    if (params.description) updateData.description = params.description
    if (params.location) updateData.location = params.location
    if (params.startTime) {
      updateData.start = {
        dateTime: params.startTime.toISOString(),
        timeZone: 'UTC',
      }
    }
    if (params.endTime) {
      updateData.end = {
        dateTime: params.endTime.toISOString(),
        timeZone: 'UTC',
      }
    }

    console.log('Calendar event updated:', eventId, updateData)
    
    return {
      success: true,
      eventId,
    }
  } catch (error) {
    console.error('Error updating calendar event:', error)
    return {
      success: false,
      error: 'Failed to update calendar event',
    }
  }
}

export async function deleteCalendarEvent(eventId: string): Promise<CalendarSyncResult> {
  const client = await getCalendarClient()
  
  if (!client) {
    return {
      success: false,
      error: 'Google Calendar not configured',
    }
  }

  try {
    console.log('Calendar event deleted:', eventId)
    
    return {
      success: true,
    }
  } catch (error) {
    console.error('Error deleting calendar event:', error)
    return {
      success: false,
      error: 'Failed to delete calendar event',
    }
  }
}

export async function getCalendarEvents(
  startDate: Date,
  endDate: Date,
  calendarId: string = 'primary'
): Promise<CalendarEvent[]> {
  const client = await getCalendarClient()
  
  if (!client) {
    return []
  }

  try {
    const response = await client.events.list({
      calendarId,
      timeMin: startDate.toISOString(),
      timeMax: endDate.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    })

    return (response.data.items || []).map(event => ({
      id: event.id || undefined,
      summary: event.summary || '',
      description: event.description || undefined,
      location: event.location || undefined,
      start: new Date(event.start?.dateTime || event.start?.date || ''),
      end: new Date(event.end?.dateTime || event.end?.date || ''),
      attendees: event.attendees?.map(a => a.email || ''),
    }))
  } catch (error) {
    console.error('Error fetching calendar events:', error)
    return []
  }
}

export async function checkAvailability(
  date: Date,
  duration: number,
  calendarId: string = 'primary'
): Promise<AvailabilitySlot[]> {
  const client = await getCalendarClient()
  
  const slots: AvailabilitySlot[] = []
  const startOfDay = new Date(date)
  startOfDay.setHours(9, 0, 0, 0)
  
  const endOfDay = new Date(date)
  endOfDay.setHours(17, 0, 0, 0)

  const existingEvents = client ? await getCalendarEvents(startOfDay, endOfDay, calendarId) : []

  let currentTime = new Date(startOfDay)
  
  while (currentTime < endOfDay) {
    const slotEnd = new Date(currentTime.getTime() + duration * 60 * 1000)
    
    const isAvailable = !existingEvents.some(event => {
      return (currentTime >= event.start && currentTime < event.end) ||
             (slotEnd > event.start && slotEnd <= event.end) ||
             (currentTime <= event.start && slotEnd >= event.end)
    })

    slots.push({
      start: new Date(currentTime),
      end: slotEnd,
      available: isAvailable,
    })

    currentTime = new Date(slotEnd.getTime() + 30 * 60 * 1000)
  }

  return slots
}

export async function createAppointmentWithCalendar(params: {
  title: string
  description?: string
  clientEmail: string
  startTime: Date
  duration: number
  location?: string
  createMeetLink?: boolean
}): Promise<CalendarSyncResult> {
  const endTime = new Date(params.startTime.getTime() + params.duration * 60 * 1000)

  const eventParams: CreateEventParams = {
    summary: params.title,
    description: params.description,
    location: params.location,
    startTime: params.startTime,
    endTime,
    attendees: [params.clientEmail],
    sendNotifications: true,
  }

  return createCalendarEvent(eventParams)
}

export async function syncWithGoogleCalendar(): Promise<{
  success: boolean
  syncedCount: number
  error?: string
}> {
  const client = await getCalendarClient()
  
  if (!client) {
    return {
      success: false,
      syncedCount: 0,
      error: 'Google Calendar not configured',
    }
  }

  try {
    console.log('Syncing with Google Calendar...')
    
    return {
      success: true,
      syncedCount: 0,
    }
  } catch (error) {
    console.error('Error syncing with Google Calendar:', error)
    return {
      success: false,
      syncedCount: 0,
      error: 'Failed to sync with Google Calendar',
    }
  }
}

export function isCalendarConfigured(): boolean {
  return isGoogleConfigured()
}

export function getDefaultAvailability(): Array<{ day: number; start: string; end: string }> {
  return [
    { day: 1, start: '09:00', end: '17:00' },
    { day: 2, start: '09:00', end: '17:00' },
    { day: 3, start: '09:00', end: '17:00' },
    { day: 4, start: '09:00', end: '17:00' },
    { day: 5, start: '09:00', end: '17:00' },
  ]
}

export function isWithinBusinessHours(date: Date): boolean {
  const day = date.getDay()
  const hour = date.getHours()
  
  if (day === 0 || day === 6) return false
  if (hour < 9 || hour >= 17) return false
  
  return true
}

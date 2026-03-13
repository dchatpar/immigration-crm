import { NextResponse } from 'next/server'

// In-memory storage for settings (in production, use database)
let settingsStore: Record<string, { key: string; value: string; category: string; description: string }[]> = {
  general: [
    { key: 'company_name', value: 'Immigration Law Office', category: 'general', description: 'Company name displayed in the system' },
    { key: 'company_email', value: 'contact@immigrationcrm.com', category: 'general', description: 'Company contact email' },
    { key: 'company_phone', value: '+1 (555) 123-4567', category: 'general', description: 'Company contact phone' },
    { key: 'timezone', value: 'America/New_York', category: 'general', description: 'System timezone' },
    { key: 'date_format', value: 'MM/DD/YYYY', category: 'general', description: 'Date format for display' },
  ],
  notifications: [
    { key: 'email_notifications', value: 'true', category: 'notifications', description: 'Enable email notifications' },
    { key: 'sms_notifications', value: 'false', category: 'notifications', description: 'Enable SMS notifications' },
    { key: 'appointment_reminders', value: '24', category: 'notifications', description: 'Appointment reminder hours before' },
    { key: 'document_expiry_alerts', value: '30', category: 'notifications', description: 'Days before document expiry to alert' },
  ],
  billing: [
    { key: 'currency', value: 'USD', category: 'billing', description: 'Default currency for billing' },
    { key: 'tax_rate', value: '0', category: 'billing', description: 'Tax rate percentage' },
    { key: 'invoice_prefix', value: 'INV-', category: 'billing', description: 'Invoice number prefix' },
  ],
  integrations: [
    { key: 'sendgrid_api_key', value: '', category: 'integrations', description: 'SendGrid API key for emails' },
    { key: 'twilio_sid', value: '', category: 'integrations', description: 'Twilio Account SID' },
    { key: 'twilio_token', value: '', category: 'integrations', description: 'Twilio Auth Token' },
    { key: 'google_calendar', value: 'false', category: 'integrations', description: 'Enable Google Calendar sync' },
    { key: 'stripe_enabled', value: 'false', category: 'integrations', description: 'Enable Stripe payments' },
  ]
}

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: settingsStore
    })
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { key, value, category, description } = body

    if (!key || !category) {
      return NextResponse.json(
        { success: false, error: 'Key and category are required' },
        { status: 400 }
      )
    }

    // Initialize category if not exists
    if (!settingsStore[category]) {
      settingsStore[category] = []
    }

    // Update or add setting
    const existingIndex = settingsStore[category].findIndex(s => s.key === key)
    
    if (existingIndex >= 0) {
      settingsStore[category][existingIndex] = { key, value, category, description: description || settingsStore[category][existingIndex].description }
    } else {
      settingsStore[category].push({ key, value, category, description: description || '' })
    }

    return NextResponse.json({
      success: true,
      message: 'Setting saved successfully'
    })
  } catch (error) {
    console.error('Error saving setting:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to save setting' },
      { status: 500 }
    )
  }
}

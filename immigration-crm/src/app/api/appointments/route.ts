import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const caseId = searchParams.get('caseId')
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')

    const appointments = [
      { _id: '1', title: 'Short Consultation', appointmentType: 'SHORT_CONSULTATION', status: 'SCHEDULED', scheduledAt: Date.now() + 86400000, duration: 15, location: 'Video Call', meetingLink: 'https://meet.example.com/123', case: { id: '1', caseNumber: 'IMM-2026-001', clientFirstName: 'John', clientLastName: 'Smith' } },
      { _id: '2', title: 'Document Review', appointmentType: 'DOCUMENT_REVIEW', status: 'SCHEDULED', scheduledAt: Date.now() + 172800000, duration: 45, location: 'Office - Room 2', case: { id: '2', caseNumber: 'IMM-2026-002', clientFirstName: 'Maria', clientLastName: 'Garcia' } },
    ]

    let filteredAppointments = appointments

    if (status && status !== 'all') {
      filteredAppointments = filteredAppointments.filter(apt => apt.status === status)
    }

    if (caseId) {
      filteredAppointments = filteredAppointments.filter(apt => apt.case?.id === caseId)
    }

    if (dateFrom) {
      const from = parseInt(dateFrom)
      filteredAppointments = filteredAppointments.filter(apt => apt.scheduledAt >= from)
    }

    if (dateTo) {
      const to = parseInt(dateTo)
      filteredAppointments = filteredAppointments.filter(apt => apt.scheduledAt <= to)
    }

    return NextResponse.json({ appointments: filteredAppointments, total: filteredAppointments.length })
  } catch (error) {
    console.error('Error fetching appointments:', error)
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, appointmentType, scheduledAt, duration, location, meetingLink, caseId } = body

    if (!title || !appointmentType || !scheduledAt) {
      return NextResponse.json(
        { error: 'Title, appointment type, and scheduled date are required' },
        { status: 400 }
      )
    }

    const newAppointment = {
      _id: `apt_${Date.now()}`,
      title,
      description: description || '',
      appointmentType,
      status: 'SCHEDULED',
      scheduledAt,
      duration: duration || 30,
      location: location || '',
      meetingLink: meetingLink || '',
      case: caseId ? { id: caseId, caseNumber: 'IMM-2026-001', clientFirstName: 'John', clientLastName: 'Smith' } : null,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }

    return NextResponse.json({ appointment: newAppointment }, { status: 201 })
  } catch (error) {
    console.error('Error creating appointment:', error)
    return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 })
  }
}

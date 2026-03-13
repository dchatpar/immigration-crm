import { NextResponse } from 'next/server'

// In-memory storage for appointments (in production, use database)
let appointmentsStore = [
  { _id: '1', title: 'Initial Consultation', appointmentType: 'consultation', status: 'SCHEDULED', scheduledAt: Date.now() + 86400000, duration: 60, location: 'Video Call', caseId: '1', caseNumber: 'IMM-2026-001', clientFirstName: 'John', clientLastName: 'Smith', fee: 85, feeType: 'standard' },
  { _id: '2', title: 'Document Review', appointmentType: 'document_review', status: 'SCHEDULED', scheduledAt: Date.now() + 172800000, duration: 45, location: 'Office - Room 2', caseId: '2', caseNumber: 'IMM-2026-002', clientFirstName: 'Maria', clientLastName: 'Garcia', fee: 85, feeType: 'standard' },
  { _id: '3', title: 'Interview Prep', appointmentType: 'interview_prep', status: 'SCHEDULED', scheduledAt: Date.now() + 259200000, duration: 90, location: 'Video Call', caseId: '3', caseNumber: 'IMM-2026-003', clientFirstName: 'Ahmed', clientLastName: 'Hassan', fee: 185, feeType: 'premium' },
  { _id: '4', title: 'Follow-up Call', appointmentType: 'follow_up', status: 'COMPLETED', scheduledAt: Date.now() - 86400000, duration: 30, location: 'Phone', caseId: '4', caseNumber: 'IMM-2026-004', clientFirstName: 'Sarah', clientLastName: 'Johnson', fee: 85, feeType: 'standard' },
  { _id: '5', title: 'Green Card Submission', appointmentType: 'submission', status: 'SCHEDULED', scheduledAt: Date.now() + 345600000, duration: 120, location: 'Office - Room 1', caseId: '5', caseNumber: 'IMM-2026-005', clientFirstName: 'Carlos', clientLastName: 'Rodriguez', fee: 185, feeType: 'premium' },
]

let nextApptId = 6

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const caseId = searchParams.get('caseId')

  let filteredAppts = [...appointmentsStore]

  if (status && status !== 'all') {
    filteredAppts = filteredAppts.filter(appt => appt.status === status)
  }

  if (caseId) {
    filteredAppts = filteredAppts.filter(appt => appt.caseId === caseId)
  }

  return NextResponse.json({
    success: true,
    data: filteredAppts,
    total: filteredAppts.length
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, appointmentType, scheduledAt, duration, location, caseId, caseNumber, clientFirstName, clientLastName, fee, feeType } = body

    if (!title || !appointmentType || !scheduledAt) {
      return NextResponse.json(
        { success: false, error: 'Title, appointment type, and scheduled date are required' },
        { status: 400 }
      )
    }

    const newAppt = {
      _id: String(nextApptId++),
      title,
      appointmentType,
      status: 'SCHEDULED',
      scheduledAt: new Date(scheduledAt).getTime(),
      duration: duration || 60,
      location: location || 'Video Call',
      caseId: caseId || null,
      caseNumber: caseNumber || '',
      clientFirstName: clientFirstName || '',
      clientLastName: clientLastName || '',
      fee: fee || 85,
      feeType: feeType || 'standard'
    }

    appointmentsStore.push(newAppt)

    return NextResponse.json({
      success: true,
      data: newAppt,
      message: 'Appointment created successfully'
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating appointment:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create appointment' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, status } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Appointment ID is required' },
        { status: 400 }
      )
    }

    const apptIndex = appointmentsStore.findIndex(appt => appt._id === id)
    
    if (apptIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Appointment not found' },
        { status: 404 }
      )
    }

    if (status) {
      appointmentsStore[apptIndex].status = status
    }

    return NextResponse.json({
      success: true,
      data: appointmentsStore[apptIndex],
      message: 'Appointment updated successfully'
    })
  } catch (error) {
    console.error('Error updating appointment:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update appointment' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Appointment ID is required' },
        { status: 400 }
      )
    }

    const index = appointmentsStore.findIndex(appt => appt._id === id)
    
    if (index === -1) {
      return NextResponse.json(
        { success: false, error: 'Appointment not found' },
        { status: 404 }
      )
    }

    appointmentsStore.splice(index, 1)

    return NextResponse.json({
      success: true,
      message: 'Appointment deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting appointment:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete appointment' },
      { status: 500 }
    )
  }
}

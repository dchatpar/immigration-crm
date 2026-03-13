import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    const appointment = {
      _id: id,
      title: 'Short Consultation',
      description: 'Initial consultation meeting',
      appointmentType: 'SHORT_CONSULTATION',
      status: 'SCHEDULED',
      scheduledAt: Date.now() + 86400000,
      duration: 15,
      location: 'Video Call',
      meetingLink: 'https://meet.example.com/123',
      case: { id: '1', caseNumber: 'IMM-2026-001', clientFirstName: 'John', clientLastName: 'Smith' },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }

    return NextResponse.json({ appointment })
  } catch (error) {
    console.error('Error fetching appointment:', error)
    return NextResponse.json({ error: 'Failed to fetch appointment' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    
    const updatedAppointment = {
      _id: id,
      ...body,
      updatedAt: Date.now(),
    }

    return NextResponse.json({ appointment: updatedAppointment })
  } catch (error) {
    console.error('Error updating appointment:', error)
    return NextResponse.json({ error: 'Failed to update appointment' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    return NextResponse.json({ message: `Appointment ${id} deleted successfully` })
  } catch (error) {
    console.error('Error deleting appointment:', error)
    return NextResponse.json({ error: 'Failed to delete appointment' }, { status: 500 })
  }
}

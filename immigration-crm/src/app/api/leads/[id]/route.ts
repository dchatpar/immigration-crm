import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    const lead = {
      _id: id,
      firstName: 'John',
      lastName: 'Smith',
      email: 'john@example.com',
      phone: '555-0101',
      source: 'Website',
      status: 'NEW',
      priority: 'HIGH',
      capturedAt: Date.now(),
      updatedAt: Date.now(),
      createdAt: Date.now(),
      assignedTo: { id: '1', name: 'Admin', email: 'admin@example.com', role: 'admin' },
      _count: { notes: 2, activities: 3 },
    }

    return NextResponse.json({ lead })
  } catch (error) {
    console.error('Error fetching lead:', error)
    return NextResponse.json({ error: 'Failed to fetch lead' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    
    const updatedLead = {
      _id: id,
      ...body,
      updatedAt: Date.now(),
    }

    return NextResponse.json({ lead: updatedLead })
  } catch (error) {
    console.error('Error updating lead:', error)
    return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    return NextResponse.json({ message: `Lead ${id} deleted successfully` })
  } catch (error) {
    console.error('Error deleting lead:', error)
    return NextResponse.json({ error: 'Failed to delete lead' }, { status: 500 })
  }
}

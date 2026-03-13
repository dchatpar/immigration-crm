import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    const caseItem = {
      _id: id,
      caseNumber: 'IMM-2026-001',
      clientFirstName: 'John',
      clientLastName: 'Smith',
      clientEmail: 'john@example.com',
      clientPhone: '555-0101',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      serviceType: 'WORK_PERMIT',
      tier: 'premium',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      assignedTo: { id: '1', name: 'Admin' },
      _count: { documents: 5, appointments: 2, communications: 3 },
    }

    return NextResponse.json({ case: caseItem })
  } catch (error) {
    console.error('Error fetching case:', error)
    return NextResponse.json({ error: 'Failed to fetch case' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    
    const updatedCase = {
      _id: id,
      ...body,
      updatedAt: Date.now(),
    }

    return NextResponse.json({ case: updatedCase })
  } catch (error) {
    console.error('Error updating case:', error)
    return NextResponse.json({ error: 'Failed to update case' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    return NextResponse.json({ message: `Case ${id} deleted successfully` })
  } catch (error) {
    console.error('Error deleting case:', error)
    return NextResponse.json({ error: 'Failed to delete case' }, { status: 500 })
  }
}

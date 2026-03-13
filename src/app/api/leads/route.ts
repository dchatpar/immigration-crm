import { NextResponse } from 'next/server'

// In-memory storage for leads (in production, use database)
let leadsStore = [
  { _id: '1', firstName: 'John', lastName: 'Smith', email: 'john@example.com', phone: '555-0101', source: 'Website', status: 'NEW', priority: 'high', capturedAt: Date.now(), updatedAt: Date.now(), createdAt: Date.now(), assignedTo: { id: '1', name: 'Admin', email: 'admin@example.com', role: 'admin' }, _count: { notes: 2, activities: 3 } },
  { _id: '2', firstName: 'Maria', lastName: 'Garcia', email: 'maria@example.com', phone: '555-0102', source: 'Referral', status: 'CONTACTED', priority: 'medium', capturedAt: Date.now(), updatedAt: Date.now(), createdAt: Date.now(), assignedTo: null, _count: { notes: 1, activities: 2 } },
  { _id: '3', firstName: 'Ahmed', lastName: 'Hassan', email: 'ahmed@example.com', phone: '555-0103', source: 'Website', status: 'QUALIFIED', priority: 'high', capturedAt: Date.now(), updatedAt: Date.now(), createdAt: Date.now(), assignedTo: { id: '1', name: 'Admin', email: 'admin@example.com', role: 'admin' }, _count: { notes: 3, activities: 5 } },
  { _id: '4', firstName: 'Sarah', lastName: 'Johnson', email: 'sarah@example.com', phone: '555-0104', source: 'LinkedIn', status: 'APPOINTMENT_SCHEDULED', priority: 'low', capturedAt: Date.now(), updatedAt: Date.now(), createdAt: Date.now(), assignedTo: null, _count: { notes: 1, activities: 2 } },
  { _id: '5', firstName: 'Carlos', lastName: 'Rodriguez', email: 'carlos@example.com', phone: '555-0105', source: 'Referral', status: 'CONVERTED', priority: 'medium', capturedAt: Date.now(), updatedAt: Date.now(), createdAt: Date.now(), assignedTo: { id: '1', name: 'Admin', email: 'admin@example.com', role: 'admin' }, _count: { notes: 4, activities: 6 } },
]

let nextId = 6

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const priority = searchParams.get('priority')
  const search = searchParams.get('search')

  let filteredLeads = [...leadsStore]

  if (status && status !== 'all') {
    filteredLeads = filteredLeads.filter(lead => lead.status === status)
  }

  if (priority && priority !== 'all') {
    filteredLeads = filteredLeads.filter(lead => lead.priority === priority)
  }

  if (search) {
    const searchLower = search.toLowerCase()
    filteredLeads = filteredLeads.filter(lead => 
      lead.firstName.toLowerCase().includes(searchLower) ||
      lead.lastName.toLowerCase().includes(searchLower) ||
      lead.email?.toLowerCase().includes(searchLower) ||
      lead.phone.includes(search)
    )
  }

  return NextResponse.json({
    success: true,
    data: filteredLeads,
    total: filteredLeads.length
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, phone, source, priority, status, assignedTo } = body

    if (!firstName || !lastName) {
      return NextResponse.json(
        { success: false, error: 'First name and last name are required' },
        { status: 400 }
      )
    }

    const newLead = {
      _id: String(nextId++),
      firstName,
      lastName,
      email: email || '',
      phone: phone || '',
      source: source || 'Website',
      status: status || 'NEW',
      priority: priority || 'MEDIUM',
      capturedAt: Date.now(),
      updatedAt: Date.now(),
      createdAt: Date.now(),
      assignedTo: assignedTo || null,
      _count: { notes: 0, activities: 0 }
    }

    leadsStore.push(newLead)

    return NextResponse.json({
      success: true,
      data: newLead,
      message: 'Lead created successfully'
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating lead:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create lead' },
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
        { success: false, error: 'Lead ID is required' },
        { status: 400 }
      )
    }

    const index = leadsStore.findIndex(lead => lead._id === id)
    
    if (index === -1) {
      return NextResponse.json(
        { success: false, error: 'Lead not found' },
        { status: 404 }
      )
    }

    leadsStore.splice(index, 1)

    return NextResponse.json({
      success: true,
      message: 'Lead deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting lead:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete lead' },
      { status: 500 }
    )
  }
}

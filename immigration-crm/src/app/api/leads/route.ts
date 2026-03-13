import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')
    const search = searchParams.get('search')

    const leads = [
      { _id: '1', firstName: 'John', lastName: 'Smith', email: 'john@example.com', phone: '555-0101', source: 'Website', status: 'NEW', priority: 'HIGH', capturedAt: Date.now(), updatedAt: Date.now(), createdAt: Date.now(), assignedTo: { id: '1', name: 'Admin', email: 'admin@example.com', role: 'admin' }, _count: { notes: 2, activities: 3 } },
      { _id: '2', firstName: 'Maria', lastName: 'Garcia', email: 'maria@example.com', phone: '555-0102', source: 'Referral', status: 'CONTACTED', priority: 'MEDIUM', capturedAt: Date.now(), updatedAt: Date.now(), createdAt: Date.now(), assignedTo: null, _count: { notes: 1, activities: 2 } },
    ]

    let filteredLeads = leads

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

    return NextResponse.json({ leads: filteredLeads, total: filteredLeads.length })
  } catch (error) {
    console.error('Error fetching leads:', error)
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, phone, source, priority, notes } = body

    if (!firstName || !lastName || !phone) {
      return NextResponse.json(
        { error: 'First name, last name, and phone are required' },
        { status: 400 }
      )
    }

    const newLead = {
      _id: `lead_${Date.now()}`,
      firstName,
      lastName,
      email: email || '',
      phone,
      source: source || 'Website',
      status: 'NEW',
      priority: priority || 'MEDIUM',
      notes: notes || [],
      capturedAt: Date.now(),
      updatedAt: Date.now(),
      createdAt: Date.now(),
      assignedTo: null,
      _count: { notes: 0, activities: 0 },
    }

    return NextResponse.json({ lead: newLead }, { status: 201 })
  } catch (error) {
    console.error('Error creating lead:', error)
    return NextResponse.json({ error: 'Failed to create lead' }, { status: 500 })
  }
}

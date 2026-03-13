import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const serviceType = searchParams.get('serviceType')
    const search = searchParams.get('search')

    const cases = [
      { _id: '1', caseNumber: 'IMM-2026-001', clientFirstName: 'John', clientLastName: 'Smith', clientEmail: 'john@example.com', clientPhone: '555-0101', status: 'IN_PROGRESS', priority: 'HIGH', serviceType: 'WORK_PERMIT', tier: 'premium', createdAt: Date.now(), updatedAt: Date.now(), assignedTo: { id: '1', name: 'Admin' }, _count: { documents: 5, appointments: 2, communications: 3 } },
      { _id: '2', caseNumber: 'IMM-2026-002', clientFirstName: 'Maria', clientLastName: 'Garcia', clientEmail: 'maria@example.com', clientPhone: '555-0102', status: 'INITIATED', priority: 'MEDIUM', serviceType: 'VISA_APPLICATION', tier: 'standard', createdAt: Date.now(), updatedAt: Date.now(), assignedTo: null, _count: { documents: 3, appointments: 1, communications: 1 } },
    ]

    let filteredCases = cases

    if (status && status !== 'all') {
      filteredCases = filteredCases.filter(c => c.status === status)
    }

    if (serviceType && serviceType !== 'all') {
      filteredCases = filteredCases.filter(c => c.serviceType === serviceType)
    }

    if (search) {
      const searchLower = search.toLowerCase()
      filteredCases = filteredCases.filter(c =>
        c.caseNumber.toLowerCase().includes(searchLower) ||
        c.clientFirstName.toLowerCase().includes(searchLower) ||
        c.clientLastName.toLowerCase().includes(searchLower) ||
        c.clientEmail.toLowerCase().includes(searchLower)
      )
    }

    return NextResponse.json({ cases: filteredCases, total: filteredCases.length })
  } catch (error) {
    console.error('Error fetching cases:', error)
    return NextResponse.json({ error: 'Failed to fetch cases' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { clientFirstName, clientLastName, clientEmail, clientPhone, serviceType, tier, priority } = body

    if (!clientFirstName || !clientLastName || !clientEmail || !serviceType) {
      return NextResponse.json(
        { error: 'Client name, email, and service type are required' },
        { status: 400 }
      )
    }

    const caseNumber = `IMM-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`

    const newCase = {
      _id: `case_${Date.now()}`,
      caseNumber,
      clientFirstName,
      clientLastName,
      clientEmail,
      clientPhone: clientPhone || '',
      status: 'INITIATED',
      priority: priority || 'MEDIUM',
      serviceType,
      tier: tier || 'standard',
      assignedTo: null,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      _count: { documents: 0, appointments: 0, communications: 0 },
    }

    return NextResponse.json({ case: newCase }, { status: 201 })
  } catch (error) {
    console.error('Error creating case:', error)
    return NextResponse.json({ error: 'Failed to create case' }, { status: 500 })
  }
}

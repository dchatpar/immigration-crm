import { NextResponse } from 'next/server'

// In-memory storage for cases (in production, use database)
let casesStore = [
  { _id: '1', caseNumber: 'IMM-2026-001', clientFirstName: 'John', clientLastName: 'Smith', clientEmail: 'john@example.com', clientPhone: '555-0101', status: 'IN_PROGRESS', priority: 'high', serviceType: 'WORK_PERMIT', tier: 'premium', createdAt: Date.now(), updatedAt: Date.now(), _count: { documents: 5, appointments: 2, communications: 3 } },
  { _id: '2', caseNumber: 'IMM-2026-002', clientFirstName: 'Maria', clientLastName: 'Garcia', clientEmail: 'maria@example.com', clientPhone: '555-0102', status: 'INITIATED', priority: 'medium', serviceType: 'VISA_APPLICATION', tier: 'standard', createdAt: Date.now(), updatedAt: Date.now(), _count: { documents: 3, appointments: 1, communications: 1 } },
  { _id: '3', caseNumber: 'IMM-2026-003', clientFirstName: 'Ahmed', clientLastName: 'Hassan', clientEmail: 'ahmed@example.com', clientPhone: '555-0103', status: 'APPROVED', priority: 'low', serviceType: 'CITIZENSHIP', tier: 'premium', createdAt: Date.now(), updatedAt: Date.now(), _count: { documents: 8, appointments: 4, communications: 6 } },
  { _id: '4', caseNumber: 'IMM-2026-004', clientFirstName: 'Sarah', clientLastName: 'Johnson', clientEmail: 'sarah@example.com', clientPhone: '555-0104', status: 'UNDER_REVIEW', priority: 'high', serviceType: 'GREEN_CARD', tier: 'standard', createdAt: Date.now(), updatedAt: Date.now(), _count: { documents: 6, appointments: 3, communications: 4 } },
  { _id: '5', caseNumber: 'IMM-2026-005', clientFirstName: 'Carlos', clientLastName: 'Rodriguez', clientEmail: 'carlos@example.com', clientPhone: '555-0105', status: 'DOCUMENTS_PENDING', priority: 'medium', serviceType: 'WORK_PERMIT', tier: 'basic', createdAt: Date.now(), updatedAt: Date.now(), _count: { documents: 2, appointments: 1, communications: 2 } },
]

let nextCaseId = 6

function generateCaseNumber(): string {
  const year = new Date().getFullYear()
  const random = Math.floor(10000 + Math.random() * 90000)
  return `IMM-${year}-${random}`
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const priority = searchParams.get('priority')
  const search = searchParams.get('search')

  let filteredCases = [...casesStore]

  if (status && status !== 'all') {
    filteredCases = filteredCases.filter(caseItem => caseItem.status === status)
  }

  if (priority && priority !== 'all') {
    filteredCases = filteredCases.filter(caseItem => caseItem.priority === priority)
  }

  if (search) {
    const searchLower = search.toLowerCase()
    filteredCases = filteredCases.filter(caseItem => 
      caseItem.caseNumber.toLowerCase().includes(searchLower) ||
      caseItem.clientFirstName.toLowerCase().includes(searchLower) ||
      caseItem.clientLastName.toLowerCase().includes(searchLower) ||
      caseItem.clientEmail?.toLowerCase().includes(searchLower)
    )
  }

  return NextResponse.json({
    success: true,
    data: filteredCases,
    total: filteredCases.length
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, phone, serviceType, priority, notes } = body

    if (!firstName || !lastName || !serviceType) {
      return NextResponse.json(
        { success: false, error: 'First name, last name, and service type are required' },
        { status: 400 }
      )
    }

    const newCase = {
      _id: String(nextCaseId++),
      caseNumber: generateCaseNumber(),
      clientFirstName: firstName,
      clientLastName: lastName,
      clientEmail: email || '',
      clientPhone: phone || '',
      status: 'INITIATED',
      priority: priority || 'MEDIUM',
      serviceType,
      tier: 'standard',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      _count: { documents: 0, appointments: 0, communications: 0 }
    }

    casesStore.push(newCase)

    return NextResponse.json({
      success: true,
      data: newCase,
      message: 'Case created successfully'
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating case:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create case' },
      { status: 500 }
    )
  }
}

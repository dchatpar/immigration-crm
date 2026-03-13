import { NextResponse } from 'next/server'

// In-memory storage for documents (in production, use database)
let documentsStore: { _id: string; fileName: string; documentType: string; category: string; status: string; fileSize: number; uploadedAt: number; caseId: string | null; caseNumber: string; clientFirstName: string; clientLastName: string; comments: { id: string; comment: string; user: { name: string }; createdAt: string }[] }[] = [
  { _id: '1', fileName: 'Passport_Smith.pdf', documentType: 'PASSPORT', category: 'Identity', status: 'APPROVED', fileSize: 1024000, uploadedAt: Date.now() - 86400000, caseId: '1', caseNumber: 'IMM-2026-001', clientFirstName: 'John', clientLastName: 'Smith', comments: [] },
  { _id: '2', fileName: 'Employment_Letter.pdf', documentType: 'EMPLOYMENT_LETTER', category: 'Employment', status: 'PENDING', fileSize: 512000, uploadedAt: Date.now() - 43200000, caseId: '1', caseNumber: 'IMM-2026-001', clientFirstName: 'John', clientLastName: 'Smith', comments: [] },
  { _id: '3', fileName: 'Tax_Returns_2024.pdf', documentType: 'TAX_RETURN', category: 'Financial', status: 'APPROVED', fileSize: 2048000, uploadedAt: Date.now() - 172800000, caseId: '2', caseNumber: 'IMM-2026-002', clientFirstName: 'Maria', clientLastName: 'Garcia', comments: [] },
  { _id: '4', fileName: 'Birth_Certificate.pdf', documentType: 'BIRTH_CERTIFICATE', category: 'Identity', status: 'REJECTED', fileSize: 768000, uploadedAt: Date.now() - 259200000, caseId: '3', caseNumber: 'IMM-2026-003', clientFirstName: 'Ahmed', clientLastName: 'Hassan', comments: [] },
  { _id: '5', fileName: 'Marriage_Certificate.pdf', documentType: 'MARRIAGE_CERTIFICATE', category: 'Personal', status: 'PENDING', fileSize: 896000, uploadedAt: Date.now() - 345600000, caseId: '4', caseNumber: 'IMM-2026-004', clientFirstName: 'Sarah', clientLastName: 'Johnson', comments: [] },
]

let nextDocId = 6

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const caseId = searchParams.get('caseId')

  let filteredDocs = [...documentsStore]

  if (status && status !== 'all') {
    filteredDocs = filteredDocs.filter(doc => doc.status === status)
  }

  if (caseId) {
    filteredDocs = filteredDocs.filter(doc => doc.caseId === caseId)
  }

  return NextResponse.json({
    success: true,
    data: filteredDocs,
    total: filteredDocs.length
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { fileName, documentType, category, caseId, status } = body

    if (!fileName || !documentType || !category) {
      return NextResponse.json(
        { success: false, error: 'File name, document type, and category are required' },
        { status: 400 }
      )
    }

    const newDoc = {
      _id: String(nextDocId++),
      fileName,
      documentType,
      category,
      status: status || 'PENDING',
      fileSize: body.fileSize || 0,
      uploadedAt: Date.now(),
      caseId: caseId || null,
      caseNumber: body.caseNumber || '',
      clientFirstName: body.clientFirstName || '',
      clientLastName: body.clientLastName || '',
      comments: []
    }

    documentsStore.push(newDoc)

    return NextResponse.json({
      success: true,
      data: newDoc,
      message: 'Document created successfully'
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating document:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create document' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, status, comment } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Document ID is required' },
        { status: 400 }
      )
    }

    const docIndex = documentsStore.findIndex(doc => doc._id === id)
    
    if (docIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Document not found' },
        { status: 404 }
      )
    }

    if (status) {
      documentsStore[docIndex].status = status
    }

    if (comment) {
      documentsStore[docIndex].comments.push({
        id: String(Date.now()),
        comment,
        user: { name: 'Admin' },
        createdAt: new Date().toISOString()
      })
    }

    return NextResponse.json({
      success: true,
      data: documentsStore[docIndex],
      message: 'Document updated successfully'
    })
  } catch (error) {
    console.error('Error updating document:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update document' },
      { status: 500 }
    )
  }
}

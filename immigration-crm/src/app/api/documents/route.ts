import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const category = searchParams.get('category')
    const caseId = searchParams.get('caseId')

    const documents = [
      { _id: '1', fileName: 'Passport_Smith.pdf', documentType: 'PASSPORT', category: 'Identity', status: 'APPROVED', fileSize: 1024000, uploadedAt: Date.now() - 86400000, case: { id: '1', caseNumber: 'IMM-2026-001', clientFirstName: 'John', clientLastName: 'Smith' } },
      { _id: '2', fileName: 'Employment_Letter.pdf', documentType: 'EMPLOYMENT_LETTER', category: 'Employment', status: 'PENDING', fileSize: 512000, uploadedAt: Date.now() - 43200000, case: { id: '1', caseNumber: 'IMM-2026-001', clientFirstName: 'John', clientLastName: 'Smith' } },
      { _id: '3', fileName: 'Tax_Returns_2024.pdf', documentType: 'TAX_RETURN', category: 'Financial', status: 'APPROVED', fileSize: 2048000, uploadedAt: Date.now() - 172800000, case: { id: '2', caseNumber: 'IMM-2026-002', clientFirstName: 'Maria', clientLastName: 'Garcia' } },
    ]

    let filteredDocuments = documents

    if (status && status !== 'all') {
      filteredDocuments = filteredDocuments.filter(doc => doc.status === status)
    }

    if (category && category !== 'all') {
      filteredDocuments = filteredDocuments.filter(doc => doc.category === category)
    }

    if (caseId) {
      filteredDocuments = filteredDocuments.filter(doc => doc.case?.id === caseId)
    }

    return NextResponse.json({ documents: filteredDocuments, total: filteredDocuments.length })
  } catch (error) {
    console.error('Error fetching documents:', error)
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { fileName, documentType, category, fileSize, caseId, expiryDate } = body

    if (!fileName || !documentType || !category) {
      return NextResponse.json(
        { error: 'File name, document type, and category are required' },
        { status: 400 }
      )
    }

    const newDocument = {
      _id: `doc_${Date.now()}`,
      fileName,
      documentType,
      category,
      status: 'PENDING',
      fileSize: fileSize || 0,
      expiryDate: expiryDate || null,
      uploadedAt: Date.now(),
      case: caseId ? { id: caseId, caseNumber: 'IMM-2026-001', clientFirstName: 'John', clientLastName: 'Smith' } : null,
    }

    return NextResponse.json({ document: newDocument }, { status: 201 })
  } catch (error) {
    console.error('Error creating document:', error)
    return NextResponse.json({ error: 'Failed to create document' }, { status: 500 })
  }
}

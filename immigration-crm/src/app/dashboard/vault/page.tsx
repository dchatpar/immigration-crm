'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { 
  FileText, 
  Upload, 
  Download, 
  Trash2, 
  Search, 
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Folder,
  File,
  Image,
  FileSpreadsheet,
  FilePlus
} from 'lucide-react'

interface Document {
  id: string
  fileName: string
  documentType: string
  category: string
  status: string
  fileSize: number
  uploadedAt: number
  expiryDate?: number
  caseInfo?: {
    caseNumber: string
    clientName: string
  }
}

const CATEGORIES = [
  'All',
  'Identity',
  'Employment',
  'Financial',
  'Legal',
  'Medical',
  'Education',
  'Travel',
  'Personal',
]

const STATUS_OPTIONS = ['PENDING', 'APPROVED', 'REJECTED', 'EXPIRED']

export default function VaultPage() {
  const [documents] = useState<Document[]>([
    { id: '1', fileName: 'Passport_Smith.pdf', documentType: 'PASSPORT', category: 'Identity', status: 'APPROVED', fileSize: 1024000, uploadedAt: Date.now() - 86400000, caseInfo: { caseNumber: 'IMM-2026-001', clientName: 'John Smith' } },
    { id: '2', fileName: 'Employment_Letter.pdf', documentType: 'EMPLOYMENT_LETTER', category: 'Employment', status: 'PENDING', fileSize: 512000, uploadedAt: Date.now() - 43200000, caseInfo: { caseNumber: 'IMM-2026-001', clientName: 'John Smith' } },
    { id: '3', fileName: 'Tax_Returns_2024.pdf', documentType: 'TAX_RETURN', category: 'Financial', status: 'APPROVED', fileSize: 2048000, uploadedAt: Date.now() - 172800000, expiryDate: Date.now() + 90 * 86400000, caseInfo: { caseNumber: 'IMM-2026-002', clientName: 'Maria Garcia' } },
    { id: '4', fileName: 'Birth_Certificate.pdf', documentType: 'BIRTH_CERTIFICATE', category: 'Identity', status: 'REJECTED', fileSize: 768000, uploadedAt: Date.now() - 259200000, caseInfo: { caseNumber: 'IMM-2026-003', clientName: 'Ahmed Hassan' } },
    { id: '5', fileName: 'Marriage_Certificate.pdf', documentType: 'MARRIAGE_CERTIFICATE', category: 'Personal', status: 'PENDING', fileSize: 896000, uploadedAt: Date.now() - 345600000, caseInfo: { caseNumber: 'IMM-2026-004', clientName: 'Sarah Johnson' } },
    { id: '6', fileName: 'Driver_License.pdf', documentType: 'DRIVERS_LICENSE', category: 'Identity', status: 'APPROVED', fileSize: 512000, uploadedAt: Date.now() - 432000000, expiryDate: Date.now() + 180 * 86400000, caseInfo: { caseNumber: 'IMM-2026-005', clientName: 'Carlos Rodriguez' } },
    { id: '7', fileName: 'Diploma.pdf', documentType: 'EDUCATION_DOCUMENT', category: 'Education', status: 'APPROVED', fileSize: 1536000, uploadedAt: Date.now() - 518400000, caseInfo: { caseNumber: 'IMM-2026-001', clientName: 'John Smith' } },
    { id: '8', fileName: 'Medical_Exam.pdf', documentType: 'MEDICAL_EXAM', category: 'Medical', status: 'EXPIRED', fileSize: 256000, uploadedAt: Date.now() - 400 * 86400000, expiryDate: Date.now() - 30 * 86400000, caseInfo: { caseNumber: 'IMM-2026-002', clientName: 'Maria Garcia' } },
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [uploading, setUploading] = useState(false)

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.caseInfo?.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.caseInfo?.clientName.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = categoryFilter === 'All' || doc.category === categoryFilter
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter

    return matchesSearch && matchesCategory && matchesStatus
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <Clock className="h-5 w-5 text-yellow-600" />
      case 'APPROVED': return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'REJECTED': return <XCircle className="h-5 w-5 text-red-600" />
      case 'EXPIRED': return <AlertTriangle className="h-5 w-5 text-orange-600" />
      default: return <FileText className="h-5 w-5 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'APPROVED': return 'bg-green-100 text-green-800'
      case 'REJECTED': return 'bg-red-100 text-red-800'
      case 'EXPIRED': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase()
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) return <Image alt="" className="h-8 w-8 text-purple-500" />
    if (['xlsx', 'xls', 'csv'].includes(ext || '')) return <FileSpreadsheet className="h-8 w-8 text-green-500" />
    if (ext === 'pdf') return <FileText className="h-8 w-8 text-red-500" />
    return <File className="h-8 w-8 text-gray-500" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const isExpiringSoon = (expiryDate?: number) => {
    if (!expiryDate) return false
    const thirtyDays = 30 * 24 * 60 * 60 * 1000
    return expiryDate - Date.now() < thirtyDays && expiryDate > Date.now()
  }

  const handleUpload = () => {
    setUploading(true)
    setTimeout(() => setUploading(false), 2000)
  }

  const handleDownload = (doc: Document) => {
    console.log('Download:', doc.fileName)
  }

  const handleDelete = (doc: Document) => {
    if (confirm(`Are you sure you want to delete ${doc.fileName}?`)) {
      console.log('Delete:', doc.id)
    }
  }

  const stats = {
    total: documents.length,
    pending: documents.filter(d => d.status === 'PENDING').length,
    approved: documents.filter(d => d.status === 'APPROVED').length,
    expiringSoon: documents.filter(d => isExpiringSoon(d.expiryDate)).length,
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Document Vault</h1>
          <p className="mt-2 text-gray-600">Manage and organize all your immigration documents</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Documents</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <Folder className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending Review</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Expiring Soon</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.expiringSoon}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search documents by name, case number, or client..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <select
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={categoryFilter}
                  onChange={e => setCategoryFilter(e.target.value)}
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>
                  ))}
                </select>
                <select
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  {STATUS_OPTIONS.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
                <div className="flex border border-gray-300 rounded-md">
                  <button
                    className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-blue-100' : ''}`}
                    onClick={() => setViewMode('grid')}
                  >
                    <Folder className="h-5 w-5" />
                  </button>
                  <button
                    className={`px-3 py-2 ${viewMode === 'list' ? 'bg-blue-100' : ''}`}
                    onClick={() => setViewMode('list')}
                  >
                    <FileText className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end mb-6">
          <Button onClick={handleUpload} disabled={uploading}>
            {uploading ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload Document
              </>
            )}
          </Button>
        </div>

        {filteredDocuments.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FilePlus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No documents found</h3>
              <p className="text-gray-600 mt-2">Try adjusting your search or filters</p>
            </CardContent>
          </Card>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredDocuments.map(doc => (
              <Card key={doc.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    {getFileIcon(doc.fileName)}
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(doc.status)}`}>
                      {doc.status}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 truncate mb-1" title={doc.fileName}>
                    {doc.fileName}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">{doc.category}</p>
                  {doc.caseInfo && (
                    <p className="text-xs text-gray-500 mb-2">
                      {doc.caseInfo.caseNumber} - {doc.caseInfo.clientName}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span>{formatFileSize(doc.fileSize)}</span>
                    <span>{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                  </div>
                  {doc.expiryDate && (
                    <div className={`text-xs px-2 py-1 rounded mb-4 ${isExpiringSoon(doc.expiryDate) ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-600'}`}>
                      Expires: {new Date(doc.expiryDate).toLocaleDateString()}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => handleDownload(doc)}>
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 text-red-600 hover:text-red-700" onClick={() => handleDelete(doc)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Document</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Case</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Uploaded</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expiry</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredDocuments.map(doc => (
                    <tr key={doc.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {getFileIcon(doc.fileName)}
                          <span className="font-medium text-gray-900">{doc.fileName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{doc.category}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {doc.caseInfo ? (
                          <div>
                            <div className="font-medium">{doc.caseInfo.caseNumber}</div>
                            <div className="text-gray-500">{doc.caseInfo.clientName}</div>
                          </div>
                        ) : '-'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(doc.status)}`}>
                          {doc.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{formatFileSize(doc.fileSize)}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{new Date(doc.uploadedAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-sm">
                        {doc.expiryDate ? (
                          <span className={isExpiringSoon(doc.expiryDate) ? 'text-orange-600 font-medium' : 'text-gray-600'}>
                            {new Date(doc.expiryDate).toLocaleDateString()}
                          </span>
                        ) : '-'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleDownload(doc)}>
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" onClick={() => handleDelete(doc)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

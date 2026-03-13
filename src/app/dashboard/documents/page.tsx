'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import {
    FileText,
    Upload,
    CheckCircle,
    XCircle,
    Clock,
    Download,
    Eye
} from 'lucide-react'

interface Document {
    _id: string
    id?: string
    fileName: string
    documentType: string
    category: string
    status: string
    fileSize: number
    uploadedAt: number
    case: {
        id: string
        caseNumber: string
        clientFirstName: string
        clientLastName: string
    } | null
    comments: Array<{
        id: string
        comment: string
        user: {
            name: string
        }
        createdAt: string
    }>
}

export default function DocumentsPage() {
    const documents = [
        { _id: '1', fileName: 'Passport_Smith.pdf', documentType: 'PASSPORT', category: 'Identity', status: 'APPROVED', fileSize: 1024000, uploadedAt: Date.now() - 86400000, case: { id: '1', caseNumber: 'IMM-2026-001', clientFirstName: 'John', clientLastName: 'Smith' }, comments: [] },
        { _id: '2', fileName: 'Employment_Letter.pdf', documentType: 'EMPLOYMENT_LETTER', category: 'Employment', status: 'PENDING', fileSize: 512000, uploadedAt: Date.now() - 43200000, case: { id: '1', caseNumber: 'IMM-2026-001', clientFirstName: 'John', clientLastName: 'Smith' }, comments: [] },
        { _id: '3', fileName: 'Tax_Returns_2024.pdf', documentType: 'TAX_RETURN', category: 'Financial', status: 'APPROVED', fileSize: 2048000, uploadedAt: Date.now() - 172800000, case: { id: '2', caseNumber: 'IMM-2026-002', clientFirstName: 'Maria', clientLastName: 'Garcia' }, comments: [] },
        { _id: '4', fileName: 'Birth_Certificate.pdf', documentType: 'BIRTH_CERTIFICATE', category: 'Identity', status: 'REJECTED', fileSize: 768000, uploadedAt: Date.now() - 259200000, case: { id: '3', caseNumber: 'IMM-2026-003', clientFirstName: 'Ahmed', clientLastName: 'Hassan' }, comments: [] },
        { _id: '5', fileName: 'Marriage_Certificate.pdf', documentType: 'MARRIAGE_CERTIFICATE', category: 'Personal', status: 'PENDING', fileSize: 896000, uploadedAt: Date.now() - 345600000, case: { id: '4', caseNumber: 'IMM-2026-004', clientFirstName: 'Sarah', clientLastName: 'Johnson' }, comments: [] },
    ]
    const loading = false

    const [statusFilter, setStatusFilter] = useState('all')
    const [uploading, setUploading] = useState(false)

    const handleApprove = async (documentId: string) => {
        console.log("Approve clicked", documentId);
    }

    const handleReject = async (documentId: string) => {
        const reason = prompt('Please provide a reason for rejection:')
        if (!reason) return

        console.log("Reject clicked", documentId, reason);
    }

    const filteredDocuments = documents.filter(doc => {
        if (statusFilter === 'all') return true
        return doc.status === statusFilter
    })

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'PENDING':
                return <Clock className="h-5 w-5 text-yellow-600" />
            case 'APPROVED':
                return <CheckCircle className="h-5 w-5 text-green-600" />
            case 'REJECTED':
                return <XCircle className="h-5 w-5 text-red-600" />
            default:
                return <FileText className="h-5 w-5 text-gray-600" />
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800'
            case 'APPROVED':
                return 'bg-green-100 text-green-800'
            case 'REJECTED':
                return 'bg-red-100 text-red-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B'
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
    }

    return (
        <DashboardLayout>
            {/* Page Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Documents</h1>
                        <p className="mt-2 text-gray-600">
                            Manage and review client documents
                        </p>
                    </div>
                    <Button className="flex items-center gap-2">
                        <Upload className="h-4 w-4" />
                        Upload Document
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <Card className="mb-8">
                <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                        <label className="text-sm font-medium text-gray-700">Filter by Status:</label>
                        <select
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All Documents</option>
                            <option value="PENDING">Pending Review</option>
                            <option value="APPROVED">Approved</option>
                            <option value="REJECTED">Rejected</option>
                        </select>
                    </div>
                </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Documents</p>
                                <p className="text-2xl font-bold">{documents.length}</p>
                            </div>
                            <FileText className="h-8 w-8 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Pending Review</p>
                                <p className="text-2xl font-bold">
                                    {documents.filter(d => d.status === 'PENDING').length}
                                </p>
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
                                <p className="text-2xl font-bold">
                                    {documents.filter(d => d.status === 'APPROVED').length}
                                </p>
                            </div>
                            <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Rejected</p>
                                <p className="text-2xl font-bold">
                                    {documents.filter(d => d.status === 'REJECTED').length}
                                </p>
                            </div>
                            <XCircle className="h-8 w-8 text-red-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Documents List */}
            <Card>
                <CardHeader>
                    <CardTitle>All Documents</CardTitle>
                    <CardDescription>
                        Showing {filteredDocuments.length} of {documents.length} documents
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                            <p className="mt-4 text-gray-600">Loading documents...</p>
                        </div>
                    ) : filteredDocuments.length === 0 ? (
                        <div className="text-center py-12">
                            <FileText className="h-12 w-12 text-gray-400 mx-auto" />
                            <h3 className="mt-4 text-lg font-medium text-gray-900">No documents found</h3>
                            <p className="mt-2 text-gray-600">
                                {statusFilter !== 'all'
                                    ? 'Try adjusting your filters'
                                    : 'Documents will appear here once uploaded'}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Document
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Case
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Type
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Size
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Uploaded
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredDocuments.map((doc) => (
                                        <tr key={doc._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    {getStatusIcon(doc.status)}
                                                    <div className="ml-3">
                                                        <div className="text-sm font-medium text-gray-900">{doc.fileName}</div>
                                                        <div className="text-sm text-gray-500">{doc.category}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{doc.case?.caseNumber || 'N/A'}</div>
                                                <div className="text-sm text-gray-500">
                                                    {doc.case ? `${doc.case.clientFirstName} ${doc.case.clientLastName}` : ''}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {doc.documentType.replace(/_/g, ' ')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(doc.status)}`}>
                                                    {doc.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatFileSize(doc.fileSize)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(doc.uploadedAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex items-center gap-2">
                                                    {doc.status === 'PENDING' && (
                                                        <>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleApprove(doc._id)}
                                                                className="text-green-600 hover:text-green-700"
                                                            >
                                                                <CheckCircle className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleReject(doc._id)}
                                                                className="text-red-600 hover:text-red-700"
                                                            >
                                                                <XCircle className="h-4 w-4" />
                                                            </Button>
                                                        </>
                                                    )}
                                                    <Button variant="outline" size="sm">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </DashboardLayout>
    )
}

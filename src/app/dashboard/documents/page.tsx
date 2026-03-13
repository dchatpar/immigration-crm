'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Modal } from '@/components/ui/Modal'
import { useToast } from '@/components/ui/Toast'
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
    const [documents, setDocuments] = useState<Document[]>([])
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [statusFilter, setStatusFilter] = useState('all')
    const [rejectModal, setRejectModal] = useState<{ open: boolean; docId: string }>({ open: false, docId: '' })
    const [rejectReason, setRejectReason] = useState('')
    const { addToast } = useToast()

    const fetchDocuments = useCallback(async () => {
        try {
            setLoading(true)
            const statusParam = statusFilter !== 'all' ? `?status=${statusFilter}` : ''
            const response = await fetch(`/api/documents${statusParam}`)
            const result = await response.json()
            if (result.success) {
                setDocuments(result.data.map((doc: any) => ({
                    ...doc,
                    case: doc.caseId ? {
                        id: doc.caseId,
                        caseNumber: doc.caseNumber,
                        clientFirstName: doc.clientFirstName,
                        clientLastName: doc.clientLastName
                    } : null
                })))
            }
        } catch (error) {
            console.error('Error fetching documents:', error)
            addToast({ type: 'error', message: 'Failed to load documents' })
        } finally {
            setLoading(false)
        }
    }, [statusFilter, addToast])

    useEffect(() => {
        fetchDocuments()
    }, [fetchDocuments])

    const handleApprove = async (documentId: string) => {
        try {
            const response = await fetch('/api/documents', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: documentId, status: 'APPROVED' })
            })
            const result = await response.json()
            if (result.success) {
                setDocuments(prev => prev.map(doc => 
                    doc._id === documentId ? { ...doc, status: 'APPROVED' } : doc
                ))
                addToast({ type: 'success', message: 'Document approved successfully' })
            }
        } catch (error) {
            addToast({ type: 'error', message: 'Failed to approve document' })
        }
    }

    const handleRejectConfirm = async () => {
        if (!rejectReason.trim()) {
            addToast({ type: 'warning', message: 'Please provide a rejection reason' })
            return
        }
        try {
            const response = await fetch('/api/documents', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: rejectModal.docId, status: 'REJECTED', comment: rejectReason })
            })
            const result = await response.json()
            if (result.success) {
                setDocuments(prev => prev.map(doc => 
                    doc._id === rejectModal.docId ? { ...doc, status: 'REJECTED' } : doc
                ))
                addToast({ type: 'success', message: 'Document rejected' })
            }
        } catch (error) {
            addToast({ type: 'error', message: 'Failed to reject document' })
        } finally {
            setRejectModal({ open: false, docId: '' })
            setRejectReason('')
        }
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
        <>
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
                                                                onClick={() => setRejectModal({ open: true, docId: doc._id })}
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

            <Modal
                isOpen={rejectModal.open}
                onClose={() => setRejectModal({ open: false, docId: '' })}
                title="Reject Document"
                size="md"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Rejection Reason
                        </label>
                        <textarea
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={4}
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="Please provide a reason for rejection..."
                        />
                    </div>
                    <div className="flex justify-end gap-3">
                        <Button
                            variant="outline"
                            onClick={() => setRejectModal({ open: false, docId: '' })}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleRejectConfirm}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Confirm Rejection
                        </Button>
                    </div>
                </div>
            </Modal>
            </>
    )
}

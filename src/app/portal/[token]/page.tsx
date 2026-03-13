'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import {
    FileText,
    Upload,
    CheckCircle,
    XCircle,
    Clock,
    AlertCircle,
    Lock
} from 'lucide-react'

export default function CustomerPortalPage() {
    const params = useParams()
    const token = params.token as string

    const [documentType, setDocumentType] = useState('')
    const [category, setCategory] = useState('')
    const [uploading, setUploading] = useState(false)
    const [uploadedDocs, setUploadedDocs] = useState<any[]>([])
    const [selectedFile, setSelectedFile] = useState<File | null>(null)

    const handleFileUpload = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedFile || !documentType || !category) {
            alert('Please fill in all fields')
            return
        }
        setUploading(true)
        setTimeout(() => {
            setUploadedDocs([...uploadedDocs, {
                _id: Date.now().toString(),
                fileName: selectedFile.name,
                documentType,
                category,
                status: 'PENDING',
                uploadedAt: new Date().toISOString()
            }])
            setSelectedFile(null)
            setDocumentType('')
            setCategory('')
            setUploading(false)
            alert('Document uploaded successfully!')
        }, 1000)
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'PENDING': return <Clock className="h-5 w-5 text-yellow-600" />
            case 'APPROVED': return <CheckCircle className="h-5 w-5 text-green-600" />
            case 'REJECTED': return <XCircle className="h-5 w-5 text-red-600" />
            default: return <FileText className="h-5 w-5 text-gray-600" />
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return 'bg-yellow-100 text-yellow-800'
            case 'APPROVED': return 'bg-green-100 text-green-800'
            case 'REJECTED': return 'bg-red-100 text-red-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    if (!token) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <Card className="max-w-md w-full">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <AlertCircle className="h-8 w-8 text-red-600" />
                            <div>
                                <CardTitle>Invalid Link</CardTitle>
                                <CardDescription>This portal link is invalid</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-600">Please contact our office for a new link.</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Secure Document Portal</h1>
                    <p className="mt-2 text-gray-600">Please contact our office to access your case information.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle>Contact Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-600">Email</p>
                                    <p className="font-medium">contact@immigrationlaw.example</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Phone</p>
                                    <p className="font-medium">(555) 123-4567</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Office Hours</p>
                                    <p className="font-medium">Mon-Fri, 9AM-5PM</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="mt-6">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Lock className="h-4 w-4" />
                                    Secure Upload
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-600">
                                    Upload your documents securely. We accept PDF, JPG, and PNG files up to 10MB.
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Upload Document</CardTitle>
                                <CardDescription>Upload required documents for your case</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleFileUpload} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Document Type</label>
                                        <select
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={documentType}
                                            onChange={(e) => setDocumentType(e.target.value)}
                                            required
                                        >
                                            <option value="">Select type...</option>
                                            <option value="PASSPORT">Passport</option>
                                            <option value="BIRTH_CERTIFICATE">Birth Certificate</option>
                                            <option value="EDUCATION">Education Documents</option>
                                            <option value="EMPLOYMENT">Employment Documents</option>
                                            <option value="FINANCIAL">Financial Documents</option>
                                            <option value="OTHER">Other</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                        <select
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            required
                                        >
                                            <option value="">Select category...</option>
                                            <option value="IDENTITY">Identity</option>
                                            <option value="QUALIFICATION">Qualification</option>
                                            <option value="FINANCIAL">Financial</option>
                                            <option value="SUPPORTING">Supporting</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Select File</label>
                                        <input
                                            type="file"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                            required
                                        />
                                    </div>

                                    <Button type="submit" className="w-full" disabled={uploading}>
                                        {uploading ? (
                                            <>
                                                <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-r-transparent mr-2"></div>
                                                Uploading...
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="h-4 w-4 mr-2" />
                                                Upload Document
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Your Documents</CardTitle>
                                <CardDescription>{uploadedDocs.length} document(s) uploaded</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {uploadedDocs.length === 0 ? (
                                    <div className="text-center py-8">
                                        <FileText className="h-12 w-12 text-gray-400 mx-auto" />
                                        <p className="mt-4 text-gray-600">No documents uploaded yet</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {uploadedDocs.map((doc) => (
                                            <div key={doc._id} className="border border-gray-200 rounded-lg p-4">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-start gap-3">
                                                        {getStatusIcon(doc.status)}
                                                        <div>
                                                            <p className="font-medium">{doc.fileName}</p>
                                                            <p className="text-sm text-gray-600">
                                                                {doc.documentType.replace(/_/g, ' ')} - {doc.category}
                                                            </p>
                                                            <p className="text-xs text-gray-500 mt-1">
                                                                Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(doc.status)}`}>
                                                        {doc.status}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

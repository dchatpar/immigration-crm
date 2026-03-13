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
    AlertCircle
} from 'lucide-react'
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

export default function CustomerPortalPage() {
    const params = useParams()
    const token = params.token as string

    // 1. Verify Token and get Case ID
    const portalAuth = useQuery(api.portal.verifyToken, { token });
    const caseId = portalAuth?.isValid ? portalAuth.caseId : undefined;

    // 2. Fetch Case Data (dependent queries)
    const caseInfo = useQuery(api.cases.get, caseId ? { id: caseId } : "skip");
    const documents = useQuery(api.documents.list, caseId ? { caseId } : "skip");
    const statusUpdates = useQuery(api.statusUpdates.list, caseId ? { caseId } : "skip");

    // Mutations
    const generateUploadUrl = useMutation(api.documents.generateUploadUrl);
    const saveDocument = useMutation(api.documents.save);

    const [uploading, setUploading] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [documentType, setDocumentType] = useState('')
    const [category, setCategory] = useState('')

    const loading = portalAuth === undefined || (portalAuth?.isValid && (caseInfo === undefined || documents === undefined));
    const error = portalAuth === null ? "Invalid or expired portal link" : null;

    const handleFileUpload = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!selectedFile || !documentType || !category || !caseId) {
            alert('Please fill in all fields')
            return
        }

        try {
            setUploading(true)

            // 1. Get Upload URL
            const postUrl = await generateUploadUrl();

            // 2. Upload File to Convex Storage
            const result = await fetch(postUrl, {
                method: "POST",
                headers: { "Content-Type": selectedFile.type },
                body: selectedFile,
            });

            if (!result.ok) throw new Error("Upload failed");
            const { storageId } = await result.json();

            // 3. Save Document Metadata
            await saveDocument({
                caseId,
                storageId,
                fileName: selectedFile.name,
                fileSize: selectedFile.size,
                mimeType: selectedFile.type,
                documentType,
                category,
            });

            alert('Document uploaded successfully!')
            setSelectedFile(null)
            setDocumentType('')
            setCategory('')
            // Queries auto-update
        } catch (err) {
            console.error(err);
            alert('Failed to upload document')
        } finally {
            setUploading(false)
        }
    }

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

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                    <p className="mt-4 text-gray-600">Loading your case information...</p>
                </div>
            </div>
        )
    }

    if (error || !caseInfo) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <Card className="max-w-md w-full">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <AlertCircle className="h-8 w-8 text-red-600" />
                            <div>
                                <CardTitle>Access Error</CardTitle>
                                <CardDescription>{error || "Case details not found"}</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-600">
                            Please contact our office if you believe this is an error.
                        </p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Secure Document Portal</h1>
                    <p className="mt-2 text-gray-600">
                        Case: {caseInfo.caseNumber} - {caseInfo.clientFirstName} {caseInfo.clientLastName}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Case Status */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle>Case Status</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Service Type</p>
                                        <p className="font-medium">{caseInfo.serviceType.replace(/_/g, ' ')}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Current Status</p>
                                        <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${getStatusColor(caseInfo.status)}`}>
                                            {caseInfo.status.replace(/_/g, ' ')}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Case Opened</p>
                                        <p className="font-medium">{new Date(caseInfo.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent Updates */}
                        {statusUpdates && statusUpdates.length > 0 && (
                            <Card className="mt-6">
                                <CardHeader>
                                    <CardTitle>Recent Updates</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {statusUpdates.slice(0, 3).map((update, index) => (
                                            <div key={index} className="border-l-2 border-blue-500 pl-3">
                                                <p className="text-sm font-medium">{update.summary}</p>
                                                {update.details && (
                                                    <p className="text-sm text-gray-600 mt-1">{update.details}</p>
                                                )}
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {new Date(update.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Upload Form & Documents */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Upload Form */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Upload Document</CardTitle>
                                <CardDescription>
                                    Upload required documents for your case
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleFileUpload} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Document Type
                                        </label>
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
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Category
                                        </label>
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
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Select File
                                        </label>
                                        <input
                                            type="file"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                            required
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={uploading}
                                    >
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

                        {/* Uploaded Documents */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Your Documents</CardTitle>
                                <CardDescription>
                                    {documents?.length || 0} document(s) uploaded
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {!documents || documents.length === 0 ? (
                                    <div className="text-center py-8">
                                        <FileText className="h-12 w-12 text-gray-400 mx-auto" />
                                        <p className="mt-4 text-gray-600">No documents uploaded yet</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {documents.map((doc) => (
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
                                                {/* Comments section would need separate query or joined data */}
                                                {(doc as any).comments?.length > 0 && (
                                                    <div className="mt-3 pl-8 border-l-2 border-gray-200">
                                                        {(doc as any).comments.map((comment: any, idx: number) => (
                                                            <div key={idx} className="text-sm text-gray-600 mb-2">
                                                                {comment.comment}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
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

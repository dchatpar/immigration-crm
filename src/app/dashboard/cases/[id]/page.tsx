'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, User, Mail, Phone, Calendar, FileText, Clock } from 'lucide-react'

export default function CaseDetailPage() {
    const params = useParams()
    const router = useRouter()
    const caseId = params.id as string

    const caseData = {
        _id: caseId,
        caseNumber: 'IMM-2026-001',
        clientFirstName: 'John',
        clientLastName: 'Smith',
        clientEmail: 'john@example.com',
        clientPhone: '555-0101',
        status: 'IN_PROGRESS',
        priority: 'high',
        serviceType: 'WORK_PERMIT',
        createdAt: Date.now(),
        updatedAt: Date.now(),
    }

    const documents = [
        { _id: '1', fileName: 'Passport.pdf', documentType: 'PASSPORT', status: 'APPROVED' },
        { _id: '2', fileName: 'Employment Letter.pdf', documentType: 'EMPLOYMENT_LETTER', status: 'PENDING' },
    ]

    const activities = [
        { _id: '1', type: 'NOTE', description: 'Initial consultation completed', createdAt: Date.now() },
        { _id: '2', type: 'STATUS_CHANGE', description: 'Case status changed to In Progress', createdAt: Date.now() },
    ]

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>
                    <h1 className="text-2xl font-bold text-gray-900">Case Details</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Client Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <User className="h-5 w-5 text-gray-400" />
                                    <span>{caseData.clientFirstName} {caseData.clientLastName}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                    <span>{caseData.clientEmail}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone className="h-5 w-5 text-gray-400" />
                                    <span>{caseData.clientPhone}</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Documents</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {documents.map(doc => (
                                        <div key={doc._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <FileText className="h-5 w-5 text-gray-400" />
                                                <span>{doc.fileName}</span>
                                            </div>
                                            <span className={`px-2 py-1 rounded text-xs ${doc.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                {doc.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Case Status</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-4">
                                    <p className="text-3xl font-bold text-blue-600">{caseData.status}</p>
                                    <p className="text-sm text-gray-500 mt-2">Priority: {caseData.priority}</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Activity</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {activities.map(act => (
                                        <div key={act._id} className="flex items-start gap-3">
                                            <Clock className="h-4 w-4 text-gray-400 mt-1" />
                                            <div>
                                                <p className="text-sm">{act.description}</p>
                                                <p className="text-xs text-gray-500">{new Date(act.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}

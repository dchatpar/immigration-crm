'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import {
    Briefcase,
    Search,
    Plus,
    Filter,
    Calendar,
    FileText,
    TrendingUp,
    Clock
} from 'lucide-react'
import Link from 'next/link'

interface Case {
    _id: string
    id?: string
    caseNumber: string
    clientFirstName: string
    clientLastName: string
    clientEmail: string
    clientPhone: string
    status: string
    priority: string
    serviceType: string
    tier: string
    assignedTo?: {
        id: string
        name: string
    }
    createdAt: number
    updatedAt: number
    _count: {
        documents: number
        appointments: number
        communications: number
    }
}

export default function CasesPage() {
    const mockCases = [
        { _id: '1', caseNumber: 'IMM-2026-001', clientFirstName: 'John', clientLastName: 'Smith', clientEmail: 'john@example.com', clientPhone: '555-0101', status: 'IN_PROGRESS', priority: 'high', serviceType: 'WORK_PERMIT', tier: 'premium', createdAt: Date.now(), updatedAt: Date.now(), _count: { documents: 5, appointments: 2, communications: 3 } },
        { _id: '2', caseNumber: 'IMM-2026-002', clientFirstName: 'Maria', clientLastName: 'Garcia', clientEmail: 'maria@example.com', clientPhone: '555-0102', status: 'INITIATED', priority: 'medium', serviceType: 'VISA_APPLICATION', tier: 'standard', createdAt: Date.now(), updatedAt: Date.now(), _count: { documents: 3, appointments: 1, communications: 1 } },
        { _id: '3', caseNumber: 'IMM-2026-003', clientFirstName: 'Ahmed', clientLastName: 'Hassan', clientEmail: 'ahmed@example.com', clientPhone: '555-0103', status: 'APPROVED', priority: 'low', serviceType: 'CITIZENSHIP', tier: 'premium', createdAt: Date.now(), updatedAt: Date.now(), _count: { documents: 8, appointments: 4, communications: 6 } },
        { _id: '4', caseNumber: 'IMM-2026-004', clientFirstName: 'Sarah', clientLastName: 'Johnson', clientEmail: 'sarah@example.com', clientPhone: '555-0104', status: 'UNDER_REVIEW', priority: 'high', serviceType: 'GREEN_CARD', tier: 'standard', createdAt: Date.now(), updatedAt: Date.now(), _count: { documents: 6, appointments: 3, communications: 4 } },
        { _id: '5', caseNumber: 'IMM-2026-005', clientFirstName: 'Carlos', clientLastName: 'Rodriguez', clientEmail: 'carlos@example.com', clientPhone: '555-0105', status: 'DOCUMENTS_PENDING', priority: 'medium', serviceType: 'WORK_PERMIT', tier: 'basic', createdAt: Date.now(), updatedAt: Date.now(), _count: { documents: 2, appointments: 1, communications: 2 } },
    ]
    const cases = mockCases
    const loading = false

    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')

    const filteredCases = cases.filter(c => {
        const matchesSearch = searchTerm === '' ||
            c.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.clientFirstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.clientLastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.clientEmail.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus = statusFilter === 'all' || c.status === statusFilter

        return matchesSearch && matchesStatus
    })

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            INITIATED: 'bg-blue-100 text-blue-800',
            DOCUMENTS_PENDING: 'bg-yellow-100 text-yellow-800',
            UNDER_REVIEW: 'bg-purple-100 text-purple-800',
            DOCUMENTS_APPROVED: 'bg-green-100 text-green-800',
            APPLICATION_SUBMITTED: 'bg-indigo-100 text-indigo-800',
            IN_PROGRESS: 'bg-orange-100 text-orange-800',
            APPROVED: 'bg-green-100 text-green-800',
            COMPLETED: 'bg-gray-100 text-gray-800',
        }
        return colors[status] || 'bg-gray-100 text-gray-800'
    }

    return (
        <DashboardLayout>
            {/* Page Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Cases</h1>
                        <p className="mt-2 text-gray-600">
                            Manage immigration cases and track progress
                        </p>
                    </div>
                    <Link href="/dashboard/cases/new">
                        <Button className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            New Case
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Filters */}
            <Card className="mb-8">
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <Input
                                    type="text"
                                    placeholder="Search by case number, client name, or email..."
                                    className="pl-10"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <select
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="all">All Statuses</option>
                                <option value="INITIATED">Initiated</option>
                                <option value="DOCUMENTS_PENDING">Documents Pending</option>
                                <option value="UNDER_REVIEW">Under Review</option>
                                <option value="APPLICATION_SUBMITTED">Application Submitted</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="APPROVED">Approved</option>
                                <option value="COMPLETED">Completed</option>
                            </select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Cases</p>
                                <p className="text-2xl font-bold">{cases.length}</p>
                            </div>
                            <Briefcase className="h-8 w-8 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Active Cases</p>
                                <p className="text-2xl font-bold">
                                    {cases.filter(c => ['INITIATED', 'DOCUMENTS_PENDING', 'UNDER_REVIEW', 'IN_PROGRESS'].includes(c.status)).length}
                                </p>
                            </div>
                            <Clock className="h-8 w-8 text-orange-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Completed</p>
                                <p className="text-2xl font-bold">
                                    {cases.filter(c => c.status === 'COMPLETED').length}
                                </p>
                            </div>
                            <TrendingUp className="h-8 w-8 text-green-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">This Month</p>
                                <p className="text-2xl font-bold">
                                    {cases.filter(c => new Date(c.createdAt).getMonth() === new Date().getMonth()).length}
                                </p>
                            </div>
                            <Calendar className="h-8 w-8 text-purple-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Cases List */}
            <Card>
                <CardHeader>
                    <CardTitle>All Cases</CardTitle>
                    <CardDescription>
                        Showing {filteredCases.length} of {cases.length} cases
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                            <p className="mt-4 text-gray-600">Loading cases...</p>
                        </div>
                    ) : filteredCases.length === 0 ? (
                        <div className="text-center py-12">
                            <Briefcase className="h-12 w-12 text-gray-400 mx-auto" />
                            <h3 className="mt-4 text-lg font-medium text-gray-900">No cases found</h3>
                            <p className="mt-2 text-gray-600">
                                {searchTerm || statusFilter !== 'all'
                                    ? 'Try adjusting your filters'
                                    : 'Get started by creating a new case'}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredCases.map((caseItem) => (
                                <Link key={caseItem._id} href={`/dashboard/cases/${caseItem._id}`}>
                                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                                        <CardHeader>
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <CardTitle className="text-lg">{caseItem.caseNumber}</CardTitle>
                                                    <CardDescription>
                                                        {caseItem.clientFirstName} {caseItem.clientLastName}
                                                    </CardDescription>
                                                </div>
                                                <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(caseItem.status)}`}>
                                                    {caseItem.status.replace(/_/g, ' ')}
                                                </span>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-2">
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <FileText className="h-4 w-4 mr-2" />
                                                    <span>{caseItem.serviceType.replace(/_/g, ' ')}</span>
                                                </div>
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <span className="font-medium mr-2">Tier:</span>
                                                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">
                                                        {caseItem.tier}
                                                    </span>
                                                </div>
                                                <div className="pt-3 border-t border-gray-200 grid grid-cols-3 gap-2 text-center">
                                                    <div>
                                                        <p className="text-xs text-gray-500">Docs</p>
                                                        <p className="text-sm font-semibold">{caseItem._count.documents}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500">Appts</p>
                                                        <p className="text-sm font-semibold">{caseItem._count.appointments}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500">Comms</p>
                                                        <p className="text-sm font-semibold">{caseItem._count.communications}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </DashboardLayout>
    )
}

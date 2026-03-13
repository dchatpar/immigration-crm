'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
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
    Clock,
    Loader2,
    AlertCircle,
    MoreVertical
} from 'lucide-react'
import Link from 'next/link'

interface Case {
    _id: string
    caseNumber: string
    clientFirstName: string
    clientLastName: string
    clientEmail: string
    clientPhone: string
    status: string
    priority: string
    serviceType: string
    tier: string
    createdAt: number
    updatedAt: number
    _count: {
        documents: number
        appointments: number
        communications: number
    }
}

export default function CasesPage() {
    const [cases, setCases] = useState<Case[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [debouncedSearch, setDebouncedSearch] = useState('')

    const fetchCases = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)
            
            const params = new URLSearchParams()
            if (statusFilter !== 'all') params.set('status', statusFilter)
            if (debouncedSearch) params.set('search', debouncedSearch)
            
            const response = await fetch(`/api/cases?${params}`)
            const data = await response.json()
            
            if (data.success) {
                setCases(data.data)
            } else {
                setError(data.error || 'Failed to load cases')
            }
        } catch (err) {
            setError('Failed to connect to server')
            console.error('Error fetching cases:', err)
        } finally {
            setLoading(false)
        }
    }, [statusFilter, debouncedSearch])

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm)
        }, 300)
        return () => clearTimeout(timer)
    }, [searchTerm])

    useEffect(() => {
        fetchCases()
    }, [fetchCases])

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

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'HIGH': return 'text-red-600'
            case 'MEDIUM': return 'text-yellow-600'
            case 'LOW': return 'text-green-600'
            default: return 'text-gray-600'
        }
    }

    const filteredCases = cases.filter(c => {
        const matchesSearch = !debouncedSearch ||
            c.caseNumber.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
            c.clientFirstName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
            c.clientLastName.toLowerCase().includes(debouncedSearch.toLowerCase())

        const matchesStatus = statusFilter === 'all' || c.status === statusFilter

        return matchesSearch && matchesStatus
    })

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Cases</h2>
                <p className="text-gray-600 mb-4">{error}</p>
                <Button onClick={fetchCases}>
                    <Loader2 className="h-4 w-4 mr-2" />
                    Try Again
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Cases</h1>
                    <p className="mt-2 text-gray-600">Manage immigration cases and track progress</p>
                </div>
                <Link href="/dashboard/cases/new">
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        New Case
                    </Button>
                </Link>
            </div>

            <Card>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search cases..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <select
                            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All Statuses</option>
                            <option value="INITIATED">Initiated</option>
                            <option value="DOCUMENTS_PENDING">Documents Pending</option>
                            <option value="UNDER_REVIEW">Under Review</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="APPROVED">Approved</option>
                            <option value="COMPLETED">Completed</option>
                        </select>
                    </div>
                </CardContent>
            </Card>

            {loading ? (
                <div className="flex items-center justify-center min-h-[300px]">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
            ) : filteredCases.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[300px]">
                    <Briefcase className="h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No Cases Found</h3>
                    <p className="text-gray-500 mt-1">Try adjusting your filters or create a new case.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredCases.map((caseItem) => (
                        <Link key={caseItem._id} href={`/dashboard/cases/${caseItem._id}`}>
                            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                                <CardHeader className="pb-2">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <CardTitle className="text-lg">{caseItem.caseNumber}</CardTitle>
                                            <p className="text-sm text-gray-500">
                                                {caseItem.clientFirstName} {caseItem.clientLastName}
                                            </p>
                                        </div>
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(caseItem.status)}`}>
                                            {caseItem.status.replace(/_/g, ' ')}
                                        </span>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-500">Service</span>
                                            <span className="font-medium">{caseItem.serviceType.replace(/_/g, ' ')}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-500">Priority</span>
                                            <span className={`font-medium ${getPriorityColor(caseItem.priority)}`}>
                                                {caseItem.priority}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-500">Documents</span>
                                            <span className="font-medium">{caseItem._count?.documents || 0}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}

            <div className="text-sm text-gray-500 text-center">
                Showing {filteredCases.length} of {cases.length} cases
            </div>
        </div>
    )
}

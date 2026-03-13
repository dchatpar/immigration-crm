'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import {
    Calendar as CalendarIcon,
    Plus,
    Clock,
    CheckCircle,
    XCircle,
    Video,
    DollarSign,
    Loader2,
    AlertCircle,
    Search
} from 'lucide-react'
import Link from 'next/link'

interface Appointment {
    _id: string
    title: string
    appointmentType: string
    status: string
    scheduledAt: number
    duration: number
    location?: string
    caseNumber?: string
    clientFirstName?: string
    clientLastName?: string
    fee: number
    feeType: string
}

export default function AppointmentsPage() {
    const [appointments, setAppointments] = useState<Appointment[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [statusFilter, setStatusFilter] = useState('all')
    const [searchTerm, setSearchTerm] = useState('')

    const fetchAppointments = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)
            
            const params = new URLSearchParams()
            if (statusFilter !== 'all') params.set('status', statusFilter)
            
            const response = await fetch(`/api/appointments?${params}`)
            const data = await response.json()
            
            if (data.success) {
                setAppointments(data.data)
            } else {
                setError(data.error || 'Failed to load appointments')
            }
        } catch (err) {
            setError('Failed to connect to server')
            console.error('Error fetching appointments:', err)
        } finally {
            setLoading(false)
        }
    }, [statusFilter])

    useEffect(() => {
        fetchAppointments()
    }, [fetchAppointments])

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'SCHEDULED': return 'bg-blue-100 text-blue-800'
            case 'COMPLETED': return 'bg-green-100 text-green-800'
            case 'CANCELLED': return 'bg-red-100 text-red-800'
            case 'NO_SHOW': return 'bg-orange-100 text-orange-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    const formatDate = (date: number) => {
        const d = new Date(date)
        return d.toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        })
    }

    const formatTime = (date: number) => {
        const d = new Date(date)
        return d.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    const filteredAppointments = appointments.filter(apt => {
        const matchesSearch = !searchTerm ||
            apt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            apt.clientFirstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            apt.clientLastName?.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus = statusFilter === 'all' || apt.status === statusFilter

        return matchesSearch && matchesStatus
    })

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Appointments</h2>
                <p className="text-gray-600 mb-4">{error}</p>
                <Button onClick={fetchAppointments}>
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
                    <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
                    <p className="mt-2 text-gray-600">Schedule and manage client appointments</p>
                </div>
                <Link href="/dashboard/appointments/new">
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        New Appointment
                    </Button>
                </Link>
            </div>

            <Card>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search appointments..."
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
                            <option value="all">All Appointments</option>
                            <option value="SCHEDULED">Scheduled</option>
                            <option value="COMPLETED">Completed</option>
                            <option value="CANCELLED">Cancelled</option>
                            <option value="NO_SHOW">No Show</option>
                        </select>
                    </div>
                </CardContent>
            </Card>

            {loading ? (
                <div className="flex items-center justify-center min-h-[300px]">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
            ) : filteredAppointments.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[300px]">
                    <CalendarIcon className="h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No Appointments Found</h3>
                    <p className="text-gray-500 mt-1">Try adjusting your filters or schedule a new appointment.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredAppointments.map((apt) => (
                        <Card key={apt._id} className="hover:shadow-md transition-shadow">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-full bg-blue-100">
                                            {apt.appointmentType === 'video' || apt.location?.toLowerCase().includes('video') ? (
                                                <Video className="h-6 w-6 text-blue-600" />
                                            ) : (
                                                <CalendarIcon className="h-6 w-6 text-blue-600" />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{apt.title}</h3>
                                            <p className="text-sm text-gray-500">
                                                {apt.clientFirstName} {apt.clientLastName}
                                                {apt.caseNumber && ` • ${apt.caseNumber}`}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <p className="font-medium text-gray-900">{formatDate(apt.scheduledAt)}</p>
                                            <p className="text-sm text-gray-500">{formatTime(apt.scheduledAt)} • {apt.duration} min</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(apt.status)}`}>
                                                {apt.status}
                                            </span>
                                            {apt.feeType === 'premium' ? (
                                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                                                    $185
                                                </span>
                                            ) : (
                                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                                    $85
                                                </span>
                                            )}
                                        </div>
                                        <Link href={`/dashboard/appointments/${apt._id}`}>
                                            <Button variant="outline" size="sm">View</Button>
                                        </Link>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <div className="text-sm text-gray-500 text-center">
                Showing {filteredAppointments.length} of {appointments.length} appointments
            </div>
        </div>
    )
}

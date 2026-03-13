'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import {
    Calendar as CalendarIcon,
    Plus,
    Clock,
    CheckCircle,
    XCircle,
    Video,
    DollarSign
} from 'lucide-react'
import Link from 'next/link'

interface Appointment {
    _id: string
    title: string
    description?: string
    appointmentType: string
    appointmentFee?: number
    status: string
    scheduledAt: number
    duration: number
    location?: string
    meetingLink?: string
    case: {
        id: string
        caseNumber: string
        clientFirstName: string
        clientLastName: string
    } | null
}

export const APPOINTMENT_TYPES = {
    SHORT_CONSULTATION: {
        id: 'SHORT_CONSULTATION',
        name: 'Short Consultation',
        duration: 15,
        fee: 85,
        description: '15-minute initial assessment'
    },
    FULL_CONSULTATION: {
        id: 'FULL_CONSULTATION', 
        name: 'Full Consultation',
        duration: 30,
        fee: 185,
        description: '30-minute comprehensive consultation'
    },
    DOCUMENT_REVIEW: {
        id: 'DOCUMENT_REVIEW',
        name: 'Document Review',
        duration: 45,
        fee: 150,
        description: 'Review of immigration documents'
    },
    INTERVIEW_PREP: {
        id: 'INTERVIEW_PREP',
        name: 'Interview Preparation',
        duration: 60,
        fee: 200,
        description: 'Mock interview and preparation'
    },
    FOLLOW_UP: {
        id: 'FOLLOW_UP',
        name: 'Follow-up Call',
        duration: 15,
        fee: 50,
        description: 'Quick follow-up discussion'
    }
}

const mockAppointments: Appointment[] = [
    { _id: '1', title: 'Short Consultation', appointmentType: 'SHORT_CONSULTATION', status: 'SCHEDULED', scheduledAt: Date.now() + 86400000, duration: 15, location: 'Video Call', case: { id: '1', caseNumber: 'IMM-2026-001', clientFirstName: 'John', clientLastName: 'Smith' } },
    { _id: '2', title: 'Document Review', appointmentType: 'DOCUMENT_REVIEW', status: 'SCHEDULED', scheduledAt: Date.now() + 172800000, duration: 45, location: 'Office - Room 2', case: { id: '2', caseNumber: 'IMM-2026-002', clientFirstName: 'Maria', clientLastName: 'Garcia' } },
    { _id: '3', title: 'Interview Prep', appointmentType: 'INTERVIEW_PREP', status: 'SCHEDULED', scheduledAt: Date.now() + 259200000, duration: 60, location: 'Video Call', case: { id: '3', caseNumber: 'IMM-2026-003', clientFirstName: 'Ahmed', clientLastName: 'Hassan' } },
    { _id: '4', title: 'Follow-up Call', appointmentType: 'FOLLOW_UP', status: 'COMPLETED', scheduledAt: Date.now() - 86400000, duration: 15, location: 'Phone', case: { id: '4', caseNumber: 'IMM-2026-004', clientFirstName: 'Sarah', clientLastName: 'Johnson' } },
    { _id: '5', title: 'Full Consultation', appointmentType: 'FULL_CONSULTATION', status: 'SCHEDULED', scheduledAt: Date.now() + 345600000, duration: 30, location: 'Office - Room 1', case: { id: '5', caseNumber: 'IMM-2026-005', clientFirstName: 'Carlos', clientLastName: 'Rodriguez' } },
]

export default function AppointmentsPage() {
    const appointments = mockAppointments
    const loading = false

    const [statusFilter, setStatusFilter] = useState('all')

    const filteredAppointments = appointments.filter(apt => {
        if (statusFilter === 'all') return true
        return apt.status === statusFilter
    })

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'SCHEDULED':
                return <Clock className="h-5 w-5 text-blue-600" />
            case 'COMPLETED':
                return <CheckCircle className="h-5 w-5 text-green-600" />
            case 'CANCELLED':
                return <XCircle className="h-5 w-5 text-red-600" />
            default:
                return <Clock className="h-5 w-5 text-gray-600" />
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'SCHEDULED':
                return 'bg-blue-100 text-blue-800'
            case 'COMPLETED':
                return 'bg-green-100 text-green-800'
            case 'CANCELLED':
                return 'bg-red-100 text-red-800'
            case 'NO_SHOW':
                return 'bg-orange-100 text-orange-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    const getAppointmentFee = (type: string): number => {
        const typeInfo = Object.values(APPOINTMENT_TYPES).find(t => t.id === type)
        return typeInfo?.fee || 0
    }

    const getAppointmentDuration = (type: string): number => {
        const typeInfo = Object.values(APPOINTMENT_TYPES).find(t => t.id === type)
        return typeInfo?.duration || 0
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

    return (
        <>
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
                        <p className="mt-2 text-gray-600">Schedule and manage client appointments</p>
                    </div>
                    <Link href="/dashboard/appointments/new">
                        <Button className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            New Appointment
                        </Button>
                    </Link>
                </div>
            </div>

            <Card className="mb-8">
                <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                        <label className="text-sm font-medium text-gray-700">Filter by Status:</label>
                        <select
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All Appointments</option>
                            <option value="SCHEDULED">Scheduled</option>
                            <option value="COMPLETED">Completed</option>
                            <option value="CANCELLED">Cancelled</option>
                        </select>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total</p>
                                <p className="text-2xl font-bold">{appointments.length}</p>
                            </div>
                            <CalendarIcon className="h-8 w-8 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Scheduled</p>
                                <p className="text-2xl font-bold">{appointments.filter(a => a.status === 'SCHEDULED').length}</p>
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
                                <p className="text-2xl font-bold">{appointments.filter(a => a.status === 'COMPLETED').length}</p>
                            </div>
                            <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">This Week</p>
                                <p className="text-2xl font-bold">{appointments.filter(a => {
                                    const aptDate = new Date(a.scheduledAt)
                                    const now = new Date()
                                    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
                                    return aptDate >= now && aptDate <= weekFromNow
                                }).length}</p>
                            </div>
                            <CalendarIcon className="h-8 w-8 text-purple-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Est. Revenue</p>
                                <p className="text-2xl font-bold text-green-600">${appointments.reduce((sum, a) => sum + getAppointmentFee(a.appointmentType), 0)}</p>
                            </div>
                            <DollarSign className="h-8 w-8 text-green-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Appointments</CardTitle>
                    <CardDescription>Showing {filteredAppointments.length} of {appointments.length} appointments</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                            <p className="mt-4 text-gray-600">Loading appointments...</p>
                        </div>
                    ) : filteredAppointments.length === 0 ? (
                        <div className="text-center py-12">
                            <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto" />
                            <h3 className="mt-4 text-lg font-medium text-gray-900">No appointments found</h3>
                            <p className="mt-2 text-gray-600">
                                {statusFilter !== 'all' ? 'Try adjusting your filters' : 'Get started by scheduling a new appointment'}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredAppointments.map((appointment) => (
                                <div key={appointment._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-4 flex-1">
                                            <div className="mt-1">{getStatusIcon(appointment.status)}</div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3">
                                                    <h3 className="text-lg font-semibold text-gray-900">{appointment.title}</h3>
                                                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(appointment.status)}`}>
                                                        {appointment.status.replace(/_/g, ' ')}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    {appointment.case ? `${appointment.case.clientFirstName} ${appointment.case.clientLastName} - ${appointment.case.caseNumber}` : 'No Case Linked'}
                                                </p>
                                                <div className="flex items-center gap-6 mt-3 text-sm text-gray-600">
                                                    <div className="flex items-center gap-2">
                                                        <CalendarIcon className="h-4 w-4" />
                                                        <span>{formatDate(appointment.scheduledAt)}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="h-4 w-4" />
                                                        <span>{formatTime(appointment.scheduledAt)} ({getAppointmentDuration(appointment.appointmentType) || appointment.duration} min)</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-green-700 font-medium">
                                                        <DollarSign className="h-4 w-4" />
                                                        <span>${getAppointmentFee(appointment.appointmentType)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Link href={`/dashboard/appointments/${appointment._id}`}>
                                                <Button variant="outline" size="sm">View Details</Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </>
    )
}

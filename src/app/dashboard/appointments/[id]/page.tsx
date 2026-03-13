'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  MapPin,
  Video,
  Phone,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  DollarSign
} from 'lucide-react'
import Link from 'next/link'

interface Appointment {
  _id: string
  title: string
  description?: string
  appointmentType: string
  status: string
  scheduledAt: number
  duration: number
  fee: number
  feeType: string
  location?: string
  meetingLink?: string
  case: {
    id: string
    caseNumber: string
    clientFirstName: string
    clientLastName: string
  } | null
}

export default function AppointmentDetailPage() {
  const router = useRouter()
  const params = useParams()
  const appointmentId = params.id as string

  const mockAppointment: Appointment = {
    _id: appointmentId || '1',
    title: 'Initial Consultation',
    description: 'Discuss work permit renewal options and timeline',
    appointmentType: 'consultation',
    status: 'SCHEDULED',
    scheduledAt: Date.now() + 86400000,
    duration: 60,
    fee: 85,
    feeType: 'standard',
    location: 'Video Call',
    meetingLink: 'https://zoom.us/j/123456789',
    case: { id: '1', caseNumber: 'IMM-2026-001', clientFirstName: 'John', clientLastName: 'Smith' }
  }

  const appointment = mockAppointment

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      SCHEDULED: 'bg-blue-100 text-blue-800',
      COMPLETED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
      NO_SHOW: 'bg-orange-100 text-orange-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SCHEDULED': return <Clock className="h-5 w-5 text-blue-600" />
      case 'COMPLETED': return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'CANCELLED': return <XCircle className="h-5 w-5 text-red-600" />
      default: return <AlertCircle className="h-5 w-5 text-gray-600" />
    }
  }

  const formatDate = (date: number) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatTime = (date: number) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/appointments">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{appointment.title}</h1>
              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(appointment.status)}`}>
                {appointment.status}
              </span>
            </div>
            <p className="text-gray-500 mt-1">
              {appointment.appointmentType.replace(/_/g, ' ')} • {appointment.duration} minutes
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline" className="text-red-600 hover:text-red-700">
            <Trash2 className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Appointment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    {formatDate(appointment.scheduledAt)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Time</p>
                  <p className="font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    {formatTime(appointment.scheduledAt)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium flex items-center gap-2">
                    {appointment.appointmentType === 'video' ? (
                      <Video className="h-4 w-4 text-gray-400" />
                    ) : (
                      <MapPin className="h-4 w-4 text-gray-400" />
                    )}
                    {appointment.location || 'Video Call'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Meeting Link</p>
                  {appointment.meetingLink ? (
                    <a href={appointment.meetingLink} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:underline flex items-center gap-2">
                      <Video className="h-4 w-4" />
                      Join Video Call
                    </a>
                  ) : (
                    <p className="font-medium text-gray-400">Not provided</p>
                  )}
                </div>
              </div>

              {appointment.description && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Description</p>
                  <p className="text-gray-900">{appointment.description}</p>
                </div>
              )}

              {appointment.case && (
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-500 mb-2">Associated Case</p>
                  <Link href={`/dashboard/cases/${appointment.case.id}`} className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                    <User className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">{appointment.case.caseNumber}</p>
                      <p className="text-sm text-gray-500">{appointment.case.clientFirstName} {appointment.case.clientLastName}</p>
                    </div>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Video className="h-4 w-4 mr-2" />
                Start Video Call
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Phone className="h-4 w-4 mr-2" />
                Call Client
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Reschedule
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-500">Fee Type</span>
                <Badge variant={appointment.feeType === 'premium' ? 'success' : 'default'}>
                  {appointment.feeType === 'premium' ? 'Premium ($185)' : 'Standard ($85)'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Amount</span>
                <span className="text-2xl font-bold text-gray-900">${appointment.fee}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

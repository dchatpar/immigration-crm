'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
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
  AlertCircle
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
  location?: string
  meetingLink?: string
  case: {
    id: string
    caseNumber: string
    clientFirstName: string
    clientLastName: string
  } | null
}

const mockAppointment: Appointment = {
  _id: '1',
  title: 'Initial Consultation',
  description: 'Discuss work permit renewal options and timeline',
  appointmentType: 'consultation',
  status: 'SCHEDULED',
  scheduledAt: Date.now() + 86400000,
  duration: 60,
  location: 'Video Call',
  meetingLink: 'https://zoom.us/j/123456789',
  case: { id: '1', caseNumber: 'IMM-2026-001', clientFirstName: 'John', clientLastName: 'Smith' }
}

export default function AppointmentDetailPage() {
  const router = useRouter()
  const params = useParams()
  const appointmentId = params.id as string

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
    <DashboardLayout>
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
            {appointment.status === 'SCHEDULED' && (
              <>
                <Button variant="outline" className="text-green-600 hover:text-green-700">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark Complete
                </Button>
                <Button variant="outline" className="text-red-600 hover:text-red-700">
                  <XCircle className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Appointment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {appointment.description && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
                    <p className="text-gray-900">{appointment.description}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                      <Calendar className="h-4 w-4" />
                      Date
                    </div>
                    <p className="font-medium">{formatDate(appointment.scheduledAt)}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                      <Clock className="h-4 w-4" />
                      Time
                    </div>
                    <p className="font-medium">{formatTime(appointment.scheduledAt)} ({appointment.duration} min)</p>
                  </div>
                </div>

                {appointment.meetingLink && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Meeting Link</h3>
                    <a 
                      href={appointment.meetingLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
                    >
                      <Video className="h-4 w-4" />
                      Join Video Call
                    </a>
                  </div>
                )}

                {appointment.location && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Location</h3>
                    <div className="flex items-center gap-2 text-gray-900">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      {appointment.location}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Client Information</CardTitle>
              </CardHeader>
              <CardContent>
                {appointment.case ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-700 font-semibold text-lg">
                          {appointment.case.clientFirstName[0]}{appointment.case.clientLastName[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {appointment.case.clientFirstName} {appointment.case.clientLastName}
                        </p>
                        <p className="text-sm text-gray-500">{appointment.case.caseNumber}</p>
                      </div>
                    </div>
                    <Link href={`/dashboard/cases/${appointment.case.id}`}>
                      <Button variant="outline" className="w-full">
                        View Case
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <p className="text-gray-500">No case linked</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
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
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
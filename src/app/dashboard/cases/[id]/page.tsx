'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Progress } from '@/components/ui/Progress'
import {
  ArrowLeft,
  Briefcase,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Edit,
  Trash2,
  Send,
  Building,
  Flag
} from 'lucide-react'
import Link from 'next/link'

interface CaseActivity {
  id: string
  type: 'status_change' | 'document' | 'note' | 'appointment' | 'communication'
  description: string
  timestamp: string
  user: string
}

interface Case {
  _id: string
  caseNumber: string
  clientFirstName: string
  clientLastName: string
  clientEmail: string
  clientPhone: string
  clientAddress: string
  clientCountry: string
  status: string
  priority: string
  serviceType: string
  tier: string
  description: string
  assignedTo: {
    id: string
    name: string
    email: string
  } | null
  createdAt: number
  updatedAt: number
  _count: {
    documents: number
    appointments: number
    communications: number
  }
}

const mockCase: Case = {
  _id: '1',
  caseNumber: 'IMM-2026-001',
  clientFirstName: 'John',
  clientLastName: 'Smith',
  clientEmail: 'john.smith@example.com',
  clientPhone: '+1 (555) 123-4567',
  clientAddress: '123 Main Street, Suite 100',
  clientCountry: 'United States',
  status: 'IN_PROGRESS',
  priority: 'HIGH',
  serviceType: 'WORK_PERMIT',
  tier: 'premium',
  description: 'Application for employment-based work permit renewal. Client currently employed as software engineer.',
  assignedTo: { id: '1', name: 'Sarah Johnson', email: 'sarah@lawfirm.com' },
  createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
  updatedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
  _count: { documents: 5, appointments: 3, communications: 8 }
}

const mockActivities: CaseActivity[] = [
  { id: '1', type: 'status_change', description: 'Case status changed to In Progress', timestamp: '2 days ago', user: 'System' },
  { id: '2', type: 'document', description: 'Document uploaded: Employment Letter', timestamp: '3 days ago', user: 'Sarah Johnson' },
  { id: '3', type: 'note', description: 'Client contacted for additional information', timestamp: '5 days ago', user: 'Sarah Johnson' },
  { id: '4', type: 'appointment', description: 'Interview preparation scheduled', timestamp: '1 week ago', user: 'System' },
  { id: '5', type: 'communication', description: 'Email sent to client regarding required documents', timestamp: '1 week ago', user: 'Sarah Johnson' }
]

export default function CaseDetailPage() {
  const router = useRouter()
  const params = useParams()
  const caseId = params.id as string
  
  const [activeTab, setActiveTab] = useState('overview')

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
    const colors: Record<string, string> = {
      LOW: 'bg-gray-100 text-gray-800',
      MEDIUM: 'bg-blue-100 text-blue-800',
      HIGH: 'bg-orange-100 text-orange-800',
      URGENT: 'bg-red-100 text-red-800',
    }
    return colors[priority] || 'bg-gray-100 text-gray-800'
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'status_change': return <AlertCircle className="h-4 w-4 text-blue-600" />
      case 'document': return <FileText className="h-4 w-4 text-purple-600" />
      case 'note': return <MessageSquare className="h-4 w-4 text-yellow-600" />
      case 'appointment': return <Calendar className="h-4 w-4 text-green-600" />
      case 'communication': return <Mail className="h-4 w-4 text-indigo-600" />
      default: return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const caseData = mockCase

  const progressSteps = [
    { status: 'INITIATED', label: 'Initiated', completed: true },
    { status: 'DOCUMENTS_PENDING', label: 'Documents', completed: true },
    { status: 'UNDER_REVIEW', label: 'Under Review', completed: true },
    { status: 'APPLICATION_SUBMITTED', label: 'Submitted', completed: false },
    { status: 'APPROVED', label: 'Approved', completed: false },
  ]

  const currentStepIndex = progressSteps.findIndex(s => s.status === caseData.status)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/cases">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">{caseData.caseNumber}</h1>
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(caseData.status)}`}>
                  {caseData.status.replace(/_/g, ' ')}
                </span>
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getPriorityColor(caseData.priority)}`}>
                  {caseData.priority}
                </span>
              </div>
              <p className="text-gray-500 mt-1">
                {caseData.serviceType.replace(/_/g, ' ')} • {caseData.tier.charAt(0).toUpperCase() + caseData.tier.slice(1)} Tier
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit Case
            </Button>
            <Button variant="outline" className="text-red-600 hover:text-red-700">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Case Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200">
                    <div 
                      className="h-full bg-blue-600 transition-all duration-500"
                      style={{ width: `${(currentStepIndex / (progressSteps.length - 1)) * 100}%` }}
                    />
                  </div>
                  <div className="relative flex justify-between">
                    {progressSteps.map((step, index) => (
                      <div key={step.status} className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${
                          index <= currentStepIndex 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-200 text-gray-500'
                        }`}>
                          {index < currentStepIndex ? (
                            <CheckCircle className="h-5 w-5" />
                          ) : (
                            <span className="text-sm font-medium">{index + 1}</span>
                          )}
                        </div>
                        <span className={`text-xs mt-2 ${index <= currentStepIndex ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                          {step.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="border-b">
                <div className="flex items-center gap-2">
                  <Button 
                    variant={activeTab === 'overview' ? 'default' : 'ghost'} 
                    size="sm"
                    onClick={() => setActiveTab('overview')}
                  >
                    Overview
                  </Button>
                  <Button 
                    variant={activeTab === 'documents' ? 'default' : 'ghost'} 
                    size="sm"
                    onClick={() => setActiveTab('documents')}
                  >
                    Documents ({caseData._count.documents})
                  </Button>
                  <Button 
                    variant={activeTab === 'appointments' ? 'default' : 'ghost'} 
                    size="sm"
                    onClick={() => setActiveTab('appointments')}
                  >
                    Appointments ({caseData._count.appointments})
                  </Button>
                  <Button 
                    variant={activeTab === 'activity' ? 'default' : 'ghost'} 
                    size="sm"
                    onClick={() => setActiveTab('activity')}
                  >
                    Activity
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Description</h3>
                      <p className="text-gray-600">{caseData.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                          <Calendar className="h-4 w-4" />
                          Created
                        </div>
                        <p className="font-medium">{new Date(caseData.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                          <Clock className="h-4 w-4" />
                          Last Updated
                        </div>
                        <p className="font-medium">{new Date(caseData.updatedAt).toLocaleDateString()}</p>
                      </div>
                    </div>

                    {caseData.assignedTo && (
                      <div className="border-t pt-6">
                        <h3 className="text-lg font-semibold mb-4">Assigned To</h3>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <User className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">{caseData.assignedTo.name}</p>
                            <p className="text-sm text-gray-500">{caseData.assignedTo.email}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'documents' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <p className="text-gray-500">No documents uploaded yet</p>
                      <Button size="sm">
                        <FileText className="h-4 w-4 mr-2" />
                        Upload Document
                      </Button>
                    </div>
                  </div>
                )}

                {activeTab === 'appointments' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <p className="text-gray-500">No appointments scheduled</p>
                      <Link href="/dashboard/appointments/new">
                        <Button size="sm">
                          <Calendar className="h-4 w-4 mr-2" />
                          Schedule Appointment
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}

                {activeTab === 'activity' && (
                  <div className="space-y-4">
                    {mockActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3 pb-4 border-b last:border-0">
                        <div className="mt-1">{getActivityIcon(activity.type)}</div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                            <span>{activity.timestamp}</span>
                            <span>•</span>
                            <span>{activity.user}</span>
                          </div>
                        </div>
                      </div>
                    ))}
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
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-700 font-semibold text-lg">
                      {caseData.clientFirstName[0]}{caseData.clientLastName[0]}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {caseData.clientFirstName} {caseData.clientLastName}
                    </p>
                    <p className="text-sm text-gray-500">Client</p>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">{caseData.clientEmail}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">{caseData.clientPhone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">{caseData.clientAddress}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Flag className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">{caseData.clientCountry}</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Link href={`/dashboard/leads/${caseData._id}`}>
                    <Button variant="outline" className="w-full">
                      <User className="h-4 w-4 mr-2" />
                      View Client Profile
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Upload Document
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Appointment
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Send className="h-4 w-4 mr-2" />
                  Update Status
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from "next-auth/react"
import { useParams, useRouter } from 'next/navigation'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import {
  ArrowLeft,
  Phone,
  Mail,
  Calendar,
  User,
  FileText,
  Edit,
  Save,
  X,
  Trash2,
  MessageSquare,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'

interface LeadDetail {
  id: string
  firstName: string
  lastName: string
  email?: string
  phone: string
  alternatePhone?: string
  source: string
  status: string
  priority: string
  assignedTo?: {
    id: string
    name: string
    email: string
    role: string
    department?: string
  }
  assignedToId?: string
  initialCallId?: string
  callRecording?: {
    id: string
    phoneNumber: string
    direction: string
    duration: number
    callStartedAt: string
  }
  convertedToCase?: {
    id: string
    caseNumber: string
    clientFirstName: string
    clientLastName: string
    serviceType: string
    status: string
  }
  convertedToCaseId?: string
  capturedAt: string
  convertedAt?: string
  createdAt: string
  updatedAt: string
  notes: Array<{
    id: string
    content: string
    user: {
      id: string
      name: string
      email: string
    }
    isPinned: boolean
    isInternal: boolean
    createdAt: string
    updatedAt: string
  }>
  activities: Array<{
    id: string
    type: string
    action: string
    description: string
    user?: {
      id: string
      name: string
      email: string
    }
    createdAt: string
  }>
  _count: {
    notes: number
    activities: number
  }
}

export default function LeadDetailPage() {
    const params = useParams()
    const router = useRouter()
  const [lead, setLead] = useState<LeadDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const leadId = params.id as string


  const fetchLeadDetails = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/leads/${leadId}`)
      const data = await response.json()

      if (data.success) {
        setLead(data.data)
      } else {
        setError(data.error?.message || 'Failed to load lead details')
      }
    } catch (error) {
      console.error('Error fetching lead details:', error)
      setError('Failed to load lead details')
    } finally {
      setLoading(false)
    }
  }, [leadId])

  useEffect(() => {
    fetchLeadDetails()
  }, [fetchLeadDetails])

  const handleConvertToCase = async () => {
    if (!confirm('Are you sure you want to convert this lead to a case?')) return

    try {
      const response = await fetch(`/api/leads/${leadId}/convert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceType: 'VISITOR_VISA',
          assignedToId: 'admin-id',
        }),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess('Lead converted to case successfully!')
        setTimeout(() => {
          router.push(`/dashboard/cases/${data.data.case.id}`)
        }, 1500)
      } else {
        setError(data.error?.message || 'Failed to convert lead')
      }
    } catch (error) {
      console.error('Error converting lead:', error)
      setError('Failed to convert lead')
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this lead? This action cannot be undone.')) return

    try {
      const response = await fetch(`/api/leads/${leadId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.push('/dashboard/leads')
      } else {
        const data = await response.json()
        setError(data.error?.message || 'Failed to delete lead')
      }
    } catch (error) {
      console.error('Error deleting lead:', error)
      setError('Failed to delete lead')
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-4 text-gray-600">Loading lead details...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!lead) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
            <h2 className="mt-4 text-xl font-semibold text-gray-900">Lead not found</h2>
            <p className="mt-2 text-gray-600">
              The lead you&apos;re looking for doesn&apos;t exist or you don&apos;t have permission to view it.
            </p>
            <div className="mt-6">
              <Link href="/dashboard/leads">
                <Button>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Leads
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <Link href="/dashboard/leads">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Leads
          </Button>
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {lead.firstName} {lead.lastName}
            </h1>
            <div className="mt-2 flex items-center space-x-4">
              <div className="flex items-center text-gray-600">
                <Phone className="h-4 w-4 mr-1" />
                <span>{lead.phone}</span>
              </div>
              {lead.email && (
                <div className="flex items-center text-gray-600">
                  <Mail className="h-4 w-4 mr-1" />
                  <span>{lead.email}</span>
                </div>
              )}
              <div className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${lead.status === 'NEW' ? 'bg-blue-100 text-blue-800' :
                lead.status === 'CONTACTED' ? 'bg-yellow-100 text-yellow-800' :
                  lead.status === 'QUALIFIED' ? 'bg-green-100 text-green-800' :
                    lead.status === 'CONVERTED' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                }`}>
                {lead.status.replace('_', ' ')}
              </div>
              <div className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${lead.priority === 'LOW' ? 'bg-gray-100 text-gray-800' :
                lead.priority === 'MEDIUM' ? 'bg-blue-100 text-blue-800' :
                  lead.priority === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                    'bg-red-100 text-red-800'
                }`}>
                {lead.priority}
              </div>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={() => setEditing(!editing)}>
              <Edit className="h-4 w-4 mr-2" />
              {editing ? 'Cancel Edit' : 'Edit Lead'}
            </Button>
            <Button onClick={handleConvertToCase}>
              <FileText className="h-4 w-4 mr-2" />
              Convert to Case
            </Button>
            {true && (
              <Button variant="destructive" onClick={handleDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Lead
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800">{success}</p>
        </div>
      )}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Lead Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Personal Information</span>
                {editing && (
                  <Button size="sm" onClick={() => setEditing(false)}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                )}
              </CardTitle>
              <CardDescription>
                Contact details and personal information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  {editing ? (
                    <Input
                      value={lead.firstName}
                      onChange={(e) => setLead({ ...lead, firstName: e.target.value })}
                    />
                  ) : (
                    <p className="text-gray-900">{lead.firstName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  {editing ? (
                    <Input
                      value={lead.lastName}
                      onChange={(e) => setLead({ ...lead, lastName: e.target.value })}
                    />
                  ) : (
                    <p className="text-gray-900">{lead.lastName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  {editing ? (
                    <Input
                      type="email"
                      value={lead.email || ''}
                      onChange={(e) => setLead({ ...lead, email: e.target.value })}
                    />
                  ) : (
                    <p className="text-gray-900">{lead.email || 'Not provided'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  {editing ? (
                    <Input
                      value={lead.phone}
                      onChange={(e) => setLead({ ...lead, phone: e.target.value })}
                    />
                  ) : (
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-gray-400" />
                      <p className="text-gray-900">{lead.phone}</p>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Alternate Phone
                  </label>
                  {editing ? (
                    <Input
                      value={lead.alternatePhone || ''}
                      onChange={(e) => setLead({ ...lead, alternatePhone: e.target.value })}
                    />
                  ) : (
                    <p className="text-gray-900">{lead.alternatePhone || 'Not provided'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Source
                  </label>
                  {editing ? (
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={lead.source}
                      onChange={(e) => setLead({ ...lead, source: e.target.value })}
                    >
                      <option value="INCOMING_CALL">Incoming Call</option>
                      <option value="WEBSITE">Website</option>
                      <option value="REFERRAL">Referral</option>
                      <option value="WALK_IN">Walk-in</option>
                      <option value="SOCIAL_MEDIA">Social Media</option>
                      <option value="ADVERTISEMENT">Advertisement</option>
                      <option value="OTHER">Other</option>
                    </select>
                  ) : (
                    <p className="text-gray-900">{lead.source.replace('_', ' ')}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  {editing ? (
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={lead.priority}
                      onChange={(e) => setLead({ ...lead, priority: e.target.value })}
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="URGENT">Urgent</option>
                    </select>
                  ) : (
                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${lead.priority === 'LOW' ? 'bg-gray-100 text-gray-800' :
                      lead.priority === 'MEDIUM' ? 'bg-blue-100 text-blue-800' :
                        lead.priority === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'
                      }`}>
                      {lead.priority}
                    </span>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assigned To
                  </label>
                  {editing ? (
                    <Input
                      value={lead.assignedTo?.name || 'Unassigned'}
                      onChange={(e) => {
                        // In a real app, you'd have a dropdown of users
                      }}
                    />
                  ) : (
                    <p className="text-gray-900">{lead.assignedTo?.name || 'Unassigned'}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Notes ({lead._count.notes})
              </CardTitle>
              <CardDescription>
                Internal notes and comments about the lead
              </CardDescription>
            </CardHeader>
            <CardContent>
              {editing ? (
                <div className="space-y-4">
                  <Input
                    placeholder="Add a new note..."
                    className="min-h-[100px]"
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="isInternal"
                        className="h-4 w-4 text-blue-600 rounded"
                      />
                      <label htmlFor="isInternal" className="text-sm text-gray-700">
                        Internal note (not visible to client)
                      </label>
                    </div>
                    <Button size="sm">
                      Add Note
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {lead.notes.length > 0 ? (
                    lead.notes.map((note) => (
                      <div key={note.id} className="border-b border-gray-200 pb-4 last:border-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm text-gray-900">{note.content}</p>
                            <div className="mt-2 flex items-center text-xs text-gray-500">
                              <span>By {note.user.name}</span>
                              <span className="mx-2">•</span>
                              <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                              {note.isInternal && (
                                <>
                                  <span className="mx-2">•</span>
                                  <span className="text-blue-600">Internal</span>
                                </>
                              )}
                            </div>
                          </div>
                          {note.isPinned && (
                            <div className="text-yellow-600">
                              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No notes yet</p>
                  )}
                  <Button variant="outline" className="w-full">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Add Note
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Timeline & Actions */}
        <div className="space-y-6">
          {/* Timeline Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Activity ({lead._count.activities})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lead.activities.length > 0 ? (
                  lead.activities.map((activity) => (
                    <div key={activity.id} className="border-l-2 border-gray-200 pl-4 pb-4 last:pb-0">
                      <div className="text-sm text-gray-900">{activity.description}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {activity.user?.name} • {new Date(activity.createdAt).toLocaleString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No recent activity</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Phone className="h-4 w-4 mr-2" />
                Call Lead
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Appointment
              </Button>
              <Button className="w-full justify-start bg-blue-600 text-white hover:bg-blue-700">
                <FileText className="h-4 w-4 mr-2" />
                Convert to Case
              </Button>
            </CardContent>
          </Card>

          {/* Status Card */}
          <Card>
            <CardHeader>
              <CardTitle>Lead Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Created</span>
                    <span className="font-medium">{new Date(lead.capturedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div className="h-full bg-blue-600 rounded-full w-1/4"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Last Updated</span>
                    <span className="font-medium">{new Date(lead.updatedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div className="h-full bg-green-600 rounded-full w-3/4"></div>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm font-medium text-gray-900">Next Action</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {lead.status === 'NEW' ? 'Contact lead within 24 hours' :
                      lead.status === 'CONTACTED' ? 'Schedule initial consultation' :
                        lead.status === 'QUALIFIED' ? 'Prepare case documents' :
                          lead.status === 'APPOINTMENT_SCHEDULED' ? 'Prepare for appointment' :
                            'No action needed'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
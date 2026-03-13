'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { 
  MessageSquare, 
  Mail, 
  Phone, 
  Send,
  Search,
  Filter,
  Plus,
  User,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react'

interface Communication {
  _id: string
  type: 'email' | 'sms' | 'call'
  direction: 'inbound' | 'outbound'
  subject: string
  content: string
  status: 'sent' | 'delivered' | 'failed' | 'received'
  recipient: {
    name: string
    email: string
    phone: string
  }
  caseNumber?: string
  createdAt: string
}

const mockCommunications: Communication[] = [
  {
    _id: '1',
    type: 'email',
    direction: 'outbound',
    subject: 'Document Request - Work Permit Renewal',
    content: 'Please upload the required documents for your work permit renewal...',
    status: 'sent',
    recipient: { name: 'John Smith', email: 'john@example.com', phone: '+1 555-0101' },
    caseNumber: 'IMM-2026-001',
    createdAt: '2 hours ago'
  },
  {
    _id: '2',
    type: 'sms',
    direction: 'outbound',
    subject: 'Appointment Reminder',
    content: 'Reminder: Your appointment is scheduled for tomorrow at 2:00 PM.',
    status: 'delivered',
    recipient: { name: 'Maria Garcia', email: 'maria@example.com', phone: '+1 555-0102' },
    caseNumber: 'IMM-2026-002',
    createdAt: '1 day ago'
  },
  {
    _id: '3',
    type: 'call',
    direction: 'inbound',
    subject: 'Follow-up Call',
    content: 'Client called regarding case status update.',
    status: 'received',
    recipient: { name: 'Ahmed Hassan', email: 'ahmed@example.com', phone: '+1 555-0103' },
    caseNumber: 'IMM-2026-003',
    createdAt: '2 days ago'
  },
  {
    _id: '4',
    type: 'email',
    direction: 'outbound',
    subject: 'Case Approved!',
    content: 'Great news! Your case has been approved. Please review the attached documents...',
    status: 'sent',
    recipient: { name: 'Sarah Johnson', email: 'sarah@example.com', phone: '+1 555-0104' },
    caseNumber: 'IMM-2026-004',
    createdAt: '3 days ago'
  }
]

export default function CommunicationsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')

  const filteredCommunications = mockCommunications.filter(comm => {
    const matchesSearch = searchTerm === '' ||
      comm.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comm.recipient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comm.caseNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = typeFilter === 'all' || comm.type === typeFilter
    
    return matchesSearch && matchesType
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="h-4 w-4 text-blue-600" />
      case 'sms': return <MessageSquare className="h-4 w-4 text-green-600" />
      case 'call': return <Phone className="h-4 w-4 text-purple-600" />
      default: return <MessageSquare className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent': 
      case 'delivered':
      case 'received':
        return (
          <span className="inline-flex items-center gap-1 text-xs text-green-600">
            <CheckCircle className="h-3 w-3" />
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        )
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1 text-xs text-red-600">
            <XCircle className="h-3 w-3" />
            Failed
          </span>
        )
      default:
        return <span className="text-xs text-gray-500">{status}</span>
    }
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Communications</h1>
            <p className="mt-2 text-gray-600">
              Manage all client communications
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Communication
          </Button>
        </div>
      </div>

      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search communications..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="email">Email</option>
                <option value="sms">SMS</option>
                <option value="call">Call</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold">{mockCommunications.length}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Emails</p>
                <p className="text-2xl font-bold">{mockCommunications.filter(c => c.type === 'email').length}</p>
              </div>
              <Mail className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">SMS</p>
                <p className="text-2xl font-bold">{mockCommunications.filter(c => c.type === 'sms').length}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Calls</p>
                <p className="text-2xl font-bold">{mockCommunications.filter(c => c.type === 'call').length}</p>
              </div>
              <Phone className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Communications</CardTitle>
          <CardDescription>
            Showing {filteredCommunications.length} of {mockCommunications.length} communications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredCommunications.map((comm) => (
              <div key={comm._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="mt-1">{getTypeIcon(comm.type)}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-gray-900">{comm.subject}</h3>
                        {getStatusBadge(comm.status)}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{comm.content}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {comm.recipient.name}
                        </span>
                        {comm.caseNumber && (
                          <span className="flex items-center gap-1">
                            <span className="font-medium">{comm.caseNumber}</span>
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {comm.createdAt}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { 
  MessageSquare, 
  Mail, 
  Phone, 
  Search, 
  Filter,
  Send,
  User,
  Clock,
  CheckCircle,
  XCircle,
  Inbox,
  Star,
  Archive,
  Trash2,
  MoreVertical,
  Video,
  MessageCircle
} from 'lucide-react'

interface Communication {
  _id: string
  type: 'EMAIL' | 'SMS' | 'CALL' | 'VIDEO' | 'IN_APP'
  direction: 'INBOUND' | 'OUTBOUND'
  status: 'SENT' | 'DELIVERED' | 'READ' | 'FAILED' | 'SCHEDULED'
  subject?: string
  preview: string
  content: string
  recipient: {
    id: string
    name: string
    email?: string
    phone?: string
  }
  case?: {
    id: string
    caseNumber: string
  }
  createdAt: number
  readAt?: number
}

const mockCommunications: Communication[] = [
  {
    _id: '1',
    type: 'EMAIL',
    direction: 'OUTBOUND',
    status: 'READ',
    subject: 'Follow-up: Your Work Permit Application',
    preview: 'Dear John, I wanted to follow up on your work permit application...',
    content: 'Dear John, I wanted to follow up on your work permit application. We have received confirmation from USCIS and expect a decision within 30 days.',
    recipient: { id: '1', name: 'John Smith', email: 'john@example.com' },
    case: { id: '1', caseNumber: 'IMM-2026-001' },
    createdAt: Date.now() - 86400000,
    readAt: Date.now() - 43200000
  },
  {
    _id: '2',
    type: 'SMS',
    direction: 'OUTBOUND',
    status: 'DELIVERED',
    subject: 'Appointment Reminder',
    preview: 'Reminder: You have an appointment tomorrow at 2:00 PM...',
    content: 'Reminder: You have an appointment tomorrow at 2:00 PM. Please bring your passport and employment letter.',
    recipient: { id: '2', name: 'Maria Garcia', phone: '+1234567890' },
    case: { id: '2', caseNumber: 'IMM-2026-002' },
    createdAt: Date.now() - 172800000
  },
  {
    _id: '3',
    type: 'CALL',
    direction: 'INBOUND',
    status: 'READ',
    subject: 'Incoming Call - Sarah Johnson',
    preview: 'Client called regarding document submission...',
    content: 'Sarah called to inquire about the status of her document submission. She submitted her employment verification letter and wants to confirm receipt.',
    recipient: { id: '3', name: 'Sarah Johnson', phone: '+1234567891' },
    case: { id: '4', caseNumber: 'IMM-2026-004' },
    createdAt: Date.now() - 259200000,
    readAt: Date.now() - 200000000
  },
  {
    _id: '4',
    type: 'VIDEO',
    direction: 'OUTBOUND',
    status: 'SENT',
    subject: 'Video Consultation Scheduled',
    preview: 'Your video consultation is scheduled for tomorrow...',
    content: 'Your video consultation is scheduled for tomorrow at 3:00 PM. A meeting link will be sent 30 minutes before the appointment.',
    recipient: { id: '5', name: 'Carlos Rodriguez', email: 'carlos@example.com' },
    case: { id: '5', caseNumber: 'IMM-2026-005' },
    createdAt: Date.now() - 3600000
  },
  {
    _id: '5',
    type: 'IN_APP',
    direction: 'OUTBOUND',
    status: 'READ',
    subject: 'Document Request',
    preview: 'Please upload your updated passport scan...',
    content: 'Please upload your updated passport scan. We need a clear copy of the information page for your renewal application.',
    recipient: { id: '6', name: 'Ahmed Hassan', email: 'ahmed@example.com' },
    case: { id: '3', caseNumber: 'IMM-2026-003' },
    createdAt: Date.now() - 432000000,
    readAt: Date.now() - 400000000
  },
  {
    _id: '6',
    type: 'EMAIL',
    direction: 'INBOUND',
    status: 'READ',
    subject: 'RE: Green Card Interview',
    preview: 'Thank you for the interview preparation...',
    content: 'Thank you for the interview preparation materials. I feel much more confident now. See you at the interview next week!',
    recipient: { id: '4', name: 'Emily Chen', email: 'emily@example.com' },
    case: { id: '4', caseNumber: 'IMM-2026-004' },
    createdAt: Date.now() - 518400000,
    readAt: Date.now() - 500000000
  }
]

export default function CommunicationsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedComm, setSelectedComm] = useState<Communication | null>(null)

  const filteredCommunications = mockCommunications.filter(comm => {
    const matchesSearch = comm.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comm.preview.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comm.recipient.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || comm.type === filterType
    const matchesStatus = filterStatus === 'all' || comm.status === filterStatus
    return matchesSearch && matchesType && matchesStatus
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'EMAIL': return <Mail className="h-4 w-4" />
      case 'SMS': return <MessageCircle className="h-4 w-4" />
      case 'CALL': return <Phone className="h-4 w-4" />
      case 'VIDEO': return <Video className="h-4 w-4" />
      default: return <MessageSquare className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'EMAIL': return 'bg-blue-100 text-blue-800'
      case 'SMS': return 'bg-green-100 text-green-800'
      case 'CALL': return 'bg-purple-100 text-purple-800'
      case 'VIDEO': return 'bg-indigo-100 text-indigo-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SENT': return <Clock className="h-3 w-3 text-gray-500" />
      case 'DELIVERED': return <CheckCircle className="h-3 w-3 text-green-500" />
      case 'READ': return <CheckCircle className="h-3 w-3 text-blue-500" />
      case 'FAILED': return <XCircle className="h-3 w-3 text-red-500" />
      default: return <Clock className="h-3 w-3 text-gray-400" />
    }
  }

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return new Date(timestamp).toLocaleDateString()
  }

  const unreadCount = mockCommunications.filter(c => c.status !== 'READ').length

  return (
    <>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Communications</h1>
            <p className="mt-2 text-gray-600">Manage all client communications</p>
          </div>
          <Button className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            New Message
          </Button>
        </div>
      </div>

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
                <p className="text-sm text-gray-600">Unread</p>
                <p className="text-2xl font-bold text-orange-600">{unreadCount}</p>
              </div>
              <Inbox className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">This Week</p>
                <p className="text-2xl font-bold">{mockCommunications.filter(c => Date.now() - c.createdAt < 604800000).length}</p>
              </div>
              <Mail className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Starred</p>
                <p className="text-2xl font-bold">3</p>
              </div>
              <Star className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Communications</CardTitle>
              <CardDescription>{filteredCommunications.length} messages</CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search messages..."
                  className="pl-10 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="EMAIL">Email</option>
                <option value="SMS">SMS</option>
                <option value="CALL">Call</option>
                <option value="VIDEO">Video</option>
                <option value="IN_APP">In-App</option>
              </select>
              <select
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="SENT">Sent</option>
                <option value="DELIVERED">Delivered</option>
                <option value="READ">Read</option>
                <option value="FAILED">Failed</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredCommunications.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No messages found</h3>
              <p className="mt-2 text-gray-600">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredCommunications.map((comm) => (
                <div
                  key={comm._id}
                  className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${selectedComm?._id === comm._id ? 'bg-blue-50' : ''}`}
                  onClick={() => setSelectedComm(comm)}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-full ${comm.direction === 'INBOUND' ? 'bg-green-100' : 'bg-blue-100'}`}>
                      {getTypeIcon(comm.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">{comm.recipient.name}</span>
                          <Badge variant={comm.direction === 'INBOUND' ? 'success' : 'info'} className="text-xs">
                            {comm.direction === 'INBOUND' ? 'Received' : 'Sent'}
                          </Badge>
                        </div>
                        <span className="text-xs text-gray-500">{formatTime(comm.createdAt)}</span>
                      </div>
                      <p className="text-sm font-medium text-gray-800 truncate">{comm.subject}</p>
                      <p className="text-sm text-gray-600 truncate">{comm.preview}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getTypeColor(comm.type)}`}>
                          {getTypeIcon(comm.type)}
                          {comm.type}
                        </span>
                        {comm.case && (
                          <span className="text-xs text-gray-500">
                            Case: {comm.case.caseNumber}
                          </span>
                        )}
                        <div className="flex items-center gap-1">
                          {getStatusIcon(comm.status)}
                          <span className="text-xs text-gray-500">{comm.status}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-1 hover:bg-gray-200 rounded">
                        <Star className="h-4 w-4 text-gray-400 hover:text-yellow-500" />
                      </button>
                      <button className="p-1 hover:bg-gray-200 rounded">
                        <Archive className="h-4 w-4 text-gray-400" />
                      </button>
                      <button className="p-1 hover:bg-gray-200 rounded">
                        <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-500" />
                      </button>
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

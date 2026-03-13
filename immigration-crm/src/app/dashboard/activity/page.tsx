'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { 
  Activity, 
  Search, 
  Filter,
  User,
  Briefcase,
  FileText,
  Calendar,
  MessageSquare,
  Bell,
  Clock,
  ChevronRight,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  Edit,
  Trash2,
  Mail,
  Phone
} from 'lucide-react'

interface Activity {
  _id: string
  type: 'CASE' | 'LEAD' | 'DOCUMENT' | 'APPOINTMENT' | 'COMMUNICATION' | 'SYSTEM'
  action: 'CREATED' | 'UPDATED' | 'DELETED' | 'COMPLETED' | 'CANCELLED' | 'SENT' | 'RECEIVED'
  title: string
  description: string
  user: {
    name: string
    avatar?: string
  }
  entityId?: string
  entityType?: string
  createdAt: number
}

const mockActivities: Activity[] = [
  { _id: '1', type: 'CASE', action: 'UPDATED', title: 'Case status updated', description: 'IMM-2026-001 status changed to In Progress', user: { name: 'Sarah Johnson' }, entityId: 'IMM-2026-001', createdAt: Date.now() - 1800000 },
  { _id: '2', type: 'DOCUMENT', action: 'CREATED', title: 'Document uploaded', description: 'Employment letter uploaded for Maria Garcia', user: { name: 'Michael Chen' }, entityId: 'doc-123', createdAt: Date.now() - 3600000 },
  { _id: '3', type: 'APPOINTMENT', action: 'COMPLETED', title: 'Appointment completed', description: 'Consultation with John Smith finished', user: { name: 'Emily Davis' }, entityId: 'apt-456', createdAt: Date.now() - 7200000 },
  { _id: '4', type: 'LEAD', action: 'CREATED', title: 'New lead added', description: 'Ahmed Hassan - Work Permit inquiry', user: { name: 'James Wilson' }, entityId: 'lead-789', createdAt: Date.now() - 10800000 },
  { _id: '5', type: 'COMMUNICATION', action: 'SENT', title: 'Email sent', description: 'Follow-up email to Carlos Rodriguez', user: { name: 'Sarah Johnson' }, entityId: 'comm-101', createdAt: Date.now() - 14400000 },
  { _id: '6', type: 'CASE', action: 'CREATED', title: 'New case created', description: 'Green Card application for Sarah Johnson', user: { name: 'Michael Chen' }, entityId: 'IMM-2026-045', createdAt: Date.now() - 18000000 },
  { _id: '7', type: 'DOCUMENT', action: 'DELETED', title: 'Document removed', description: 'Old passport scan removed from case', user: { name: 'Emily Davis' }, entityId: 'doc-999', createdAt: Date.now() - 36000000 },
  { _id: '8', type: 'APPOINTMENT', action: 'CANCELLED', title: 'Appointment cancelled', description: 'Interview prep with Ahmed Hassan cancelled', user: { name: 'James Wilson' }, entityId: 'apt-888', createdAt: Date.now() - 72000000 },
  { _id: '9', type: 'SYSTEM', action: 'UPDATED', title: 'System settings changed', description: 'Email notifications enabled', user: { name: 'Sarah Johnson' }, createdAt: Date.now() - 86400000 },
  { _id: '10', type: 'COMMUNICATION', action: 'RECEIVED', title: 'Email received', description: 'Client inquiry from new prospect', user: { name: 'System' }, createdAt: Date.now() - 90000000 },
]

export default function ActivityPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')

  const filteredActivities = mockActivities.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.user.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || activity.type === filterType
    return matchesSearch && matchesType
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'CASE': return <Briefcase className="h-4 w-4" />
      case 'LEAD': return <User className="h-4 w-4" />
      case 'DOCUMENT': return <FileText className="h-4 w-4" />
      case 'APPOINTMENT': return <Calendar className="h-4 w-4" />
      case 'COMMUNICATION': return <Mail className="h-4 w-4" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'CASE': return 'bg-blue-100 text-blue-600'
      case 'LEAD': return 'bg-green-100 text-green-600'
      case 'DOCUMENT': return 'bg-yellow-100 text-yellow-600'
      case 'APPOINTMENT': return 'bg-purple-100 text-purple-600'
      case 'COMMUNICATION': return 'bg-indigo-100 text-indigo-600'
      case 'SYSTEM': return 'bg-gray-100 text-gray-600'
      default: return 'bg-gray-100 text-gray-600'
    }
  }

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'CREATED': return <Badge variant="success">Created</Badge>
      case 'UPDATED': return <Badge variant="info">Updated</Badge>
      case 'DELETED': return <Badge variant="danger">Deleted</Badge>
      case 'COMPLETED': return <Badge variant="success">Completed</Badge>
      case 'CANCELLED': return <Badge variant="warning">Cancelled</Badge>
      case 'SENT': return <Badge variant="info">Sent</Badge>
      case 'RECEIVED': return <Badge variant="success">Received</Badge>
      default: return <Badge>{action}</Badge>
    }
  }

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 60) return `${minutes} min ago`
    if (hours < 24) return `${hours} hours ago`
    if (days < 7) return `${days} days ago`
    return new Date(timestamp).toLocaleDateString()
  }

  const groupedActivities = filteredActivities.reduce((groups, activity) => {
    const date = new Date(activity.createdAt).toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    })
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(activity)
    return groups
  }, {} as Record<string, Activity[]>)

  return (
    <>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Activity Feed</h1>
            <p className="mt-2 text-gray-600">Recent activities across your workspace</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today</p>
                <p className="text-2xl font-bold">{mockActivities.filter(a => Date.now() - a.createdAt < 86400000).length}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">This Week</p>
                <p className="text-2xl font-bold">{mockActivities.filter(a => Date.now() - a.createdAt < 604800000).length}</p>
              </div>
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Case Updates</p>
                <p className="text-2xl font-bold">{mockActivities.filter(a => a.type === 'CASE').length}</p>
              </div>
              <Briefcase className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Documents</p>
                <p className="text-2xl font-bold">{mockActivities.filter(a => a.type === 'DOCUMENT').length}</p>
              </div>
              <FileText className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6 flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search activities..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <option value="CASE">Cases</option>
          <option value="LEAD">Leads</option>
          <option value="DOCUMENT">Documents</option>
          <option value="APPOINTMENT">Appointments</option>
          <option value="COMMUNICATION">Communications</option>
          <option value="SYSTEM">System</option>
        </select>
      </div>

      <div className="space-y-8">
        {Object.entries(groupedActivities).map(([date, activities]) => (
          <div key={date}>
            <h3 className="text-sm font-medium text-gray-500 mb-4">{date}</h3>
            <Card>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-200">
                  {activities.map((activity) => (
                    <div key={activity._id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-full ${getTypeColor(activity.type)}`}>
                          {getTypeIcon(activity.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-900">{activity.title}</span>
                              {getActionBadge(activity.action)}
                            </div>
                            <span className="text-sm text-gray-500">{formatTime(activity.createdAt)}</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <User className="h-3 w-3" />
                              {activity.user.name}
                            </div>
                            {activity.entityId && (
                              <ChevronRight className="h-3 w-3 text-gray-400" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ))}

        {filteredActivities.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Activity className="h-12 w-12 text-gray-400 mx-auto" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No activities found</h3>
              <p className="mt-2 text-gray-600">Try adjusting your search or filters</p>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  )
}

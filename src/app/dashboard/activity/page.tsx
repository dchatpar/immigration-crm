'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  Activity, 
  Search,
  Filter,
  Calendar,
  User,
  FileText,
  MessageSquare,
  Phone,
  Mail,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react'

interface ActivityItem {
  id: string
  type: 'case' | 'lead' | 'document' | 'appointment' | 'communication' | 'system'
  action: string
  description: string
  user: string
  entityId?: string
  entityName?: string
  timestamp: string
}

const mockActivities: ActivityItem[] = [
  { id: '1', type: 'case', action: 'status_update', description: 'Case status changed to In Progress', user: 'Sarah Johnson', entityId: 'IMM-2026-001', entityName: 'John Smith', timestamp: '2 hours ago' },
  { id: '2', type: 'document', action: 'upload', description: 'Document uploaded: Employment Letter', user: 'Sarah Johnson', entityId: 'IMM-2026-001', entityName: 'John Smith', timestamp: '3 hours ago' },
  { id: '3', type: 'lead', action: 'create', description: 'New lead created: Ahmed Hassan', user: 'System', entityName: 'Ahmed Hassan', timestamp: '5 hours ago' },
  { id: '4', type: 'appointment', action: 'schedule', description: 'Appointment scheduled: Initial Consultation', user: 'Sarah Johnson', entityId: 'IMM-2026-002', entityName: 'Maria Garcia', timestamp: '1 day ago' },
  { id: '5', type: 'communication', action: 'send', description: 'Email sent: Document Request', user: 'Sarah Johnson', entityId: 'IMM-2026-001', entityName: 'John Smith', timestamp: '1 day ago' },
  { id: '6', type: 'case', action: 'create', description: 'New case created: IMM-2026-005', user: 'Sarah Johnson', entityId: 'IMM-2026-005', entityName: 'Carlos Rodriguez', timestamp: '2 days ago' },
  { id: '7', type: 'lead', action: 'convert', description: 'Lead converted to case', user: 'Sarah Johnson', entityName: 'Carlos Rodriguez', timestamp: '2 days ago' },
  { id: '8', type: 'system', action: 'reminder', description: 'Automatic reminder sent for passport expiry', user: 'System', timestamp: '3 days ago' },
]

export default function ActivityPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')

  const filteredActivities = mockActivities.filter(activity => {
    const matchesSearch = searchTerm === '' ||
      activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.entityName?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = typeFilter === 'all' || activity.type === typeFilter
    
    return matchesSearch && matchesType
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'case': return <FileText className="h-4 w-4 text-blue-600" />
      case 'lead': return <User className="h-4 w-4 text-green-600" />
      case 'document': return <FileText className="h-4 w-4 text-purple-600" />
      case 'appointment': return <Calendar className="h-4 w-4 text-orange-600" />
      case 'communication': return <Mail className="h-4 w-4 text-indigo-600" />
      case 'system': return <AlertCircle className="h-4 w-4 text-gray-600" />
      default: return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  const getActionBadge = (action: string) => {
    const badges: Record<string, { bg: string, text: string }> = {
      status_update: { bg: 'bg-blue-100', text: 'text-blue-800' },
      upload: { bg: 'bg-purple-100', text: 'text-purple-800' },
      create: { bg: 'bg-green-100', text: 'text-green-800' },
      schedule: { bg: 'bg-orange-100', text: 'text-orange-800' },
      send: { bg: 'bg-indigo-100', text: 'text-indigo-800' },
      convert: { bg: 'bg-green-100', text: 'text-green-800' },
      reminder: { bg: 'bg-gray-100', text: 'text-gray-800' },
    }
    const badge = badges[action] || { bg: 'bg-gray-100', text: 'text-gray-800' }
    return (
      <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded ${badge.bg} ${badge.text}`}>
        {action.replace(/_/g, ' ')}
      </span>
    )
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Activity Log</h1>
        <p className="mt-2 text-gray-600">
          Track all system activities and changes
        </p>
      </div>

      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search activities..."
                  className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                <option value="case">Cases</option>
                <option value="lead">Leads</option>
                <option value="document">Documents</option>
                <option value="appointment">Appointments</option>
                <option value="communication">Communications</option>
                <option value="system">System</option>
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
                <p className="text-sm text-gray-600">Total Activities</p>
                <p className="text-2xl font-bold">{mockActivities.length}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today</p>
                <p className="text-2xl font-bold">{mockActivities.filter(a => a.timestamp.includes('hour')).length}</p>
              </div>
              <Clock className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">This Week</p>
                <p className="text-2xl font-bold">{mockActivities.filter(a => a.timestamp.includes('day')).length}</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">System</p>
                <p className="text-2xl font-bold">{mockActivities.filter(a => a.type === 'system').length}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Activities</CardTitle>
          <CardDescription>
            Showing {filteredActivities.length} of {mockActivities.length} activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 pb-4 border-b last:border-0">
                <div className="mt-1">{getTypeIcon(activity.type)}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                    {getActionBadge(activity.action)}
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {activity.user}
                    </span>
                    {activity.entityName && (
                      <span className="font-medium">{activity.entityName}</span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {activity.timestamp}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
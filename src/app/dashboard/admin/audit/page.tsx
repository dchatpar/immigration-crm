'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { 
  Shield, 
  Search, 
  Download,
  Filter,
  Eye,
  Edit,
  Trash2,
  LogIn,
  LogOut,
  FileText,
  User,
  Settings,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react'

interface AuditLog {
  _id: string
  action: string
  category: 'AUTH' | 'USER' | 'CASE' | 'DOCUMENT' | 'APPOINTMENT' | 'SYSTEM'
  severity: 'INFO' | 'WARNING' | 'CRITICAL'
  description: string
  user: {
    id: string
    name: string
    email: string
  }
  ipAddress: string
  userAgent: string
  metadata?: Record<string, string>
  createdAt: number
}

const mockLogs: AuditLog[] = [
  { _id: '1', action: 'LOGIN', category: 'AUTH', severity: 'INFO', description: 'User logged in successfully', user: { id: '1', name: 'Sarah Johnson', email: 'sarah@immigration.com' }, ipAddress: '192.168.1.100', userAgent: 'Chrome/120.0', createdAt: Date.now() - 3600000 },
  { _id: '2', action: 'CASE_UPDATE', category: 'CASE', severity: 'INFO', description: 'Case IMM-2026-001 status changed to In Progress', user: { id: '2', name: 'Michael Chen', email: 'michael@immigration.com' }, ipAddress: '192.168.1.101', userAgent: 'Firefox/121.0', metadata: { caseId: 'IMM-2026-001', oldStatus: 'INITIATED', newStatus: 'IN_PROGRESS' }, createdAt: Date.now() - 7200000 },
  { _id: '3', action: 'DOCUMENT_UPLOAD', category: 'DOCUMENT', severity: 'INFO', description: 'Document uploaded: Passport.pdf', user: { id: '1', name: 'Sarah Johnson', email: 'sarah@immigration.com' }, ipAddress: '192.168.1.100', userAgent: 'Chrome/120.0', metadata: { documentType: 'PASSPORT', fileSize: '2.4 MB' }, createdAt: Date.now() - 10800000 },
  { _id: '4', action: 'FAILED_LOGIN', category: 'AUTH', severity: 'WARNING', description: 'Failed login attempt - incorrect password', user: { id: '0', name: 'Unknown', email: 'hacker@test.com' }, ipAddress: '45.33.32.156', userAgent: 'Python-urllib/3.10', createdAt: Date.now() - 14400000 },
  { _id: '5', action: 'USER_CREATE', category: 'USER', severity: 'INFO', description: 'New user created: emily@immigration.com', user: { id: '1', name: 'Sarah Johnson', email: 'sarah@immigration.com' }, ipAddress: '192.168.1.100', userAgent: 'Chrome/120.0', metadata: { newUserId: '6', role: 'STAFF' }, createdAt: Date.now() - 18000000 },
  { _id: '6', action: 'SETTINGS_CHANGE', category: 'SYSTEM', severity: 'WARNING', description: 'System settings modified - maintenance mode enabled', user: { id: '1', name: 'Sarah Johnson', email: 'sarah@immigration.com' }, ipAddress: '192.168.1.100', userAgent: 'Chrome/120.0', metadata: { setting: 'maintenanceMode', value: 'true' }, createdAt: Date.now() - 21600000 },
  { _id: '7', action: 'CASE_DELETE', category: 'CASE', severity: 'CRITICAL', description: 'Case IMM-2026-099 permanently deleted', user: { id: '1', name: 'Sarah Johnson', email: 'sarah@immigration.com' }, ipAddress: '192.168.1.100', userAgent: 'Chrome/120.0', metadata: { caseId: 'IMM-2026-099', reason: 'Duplicate entry' }, createdAt: Date.now() - 43200000 },
  { _id: '8', action: 'APPOINTMENT_SCHEDULE', category: 'APPOINTMENT', severity: 'INFO', description: 'New appointment scheduled with John Smith', user: { id: '2', name: 'Michael Chen', email: 'michael@immigration.com' }, ipAddress: '192.168.1.101', userAgent: 'Firefox/121.0', metadata: { appointmentType: 'CONSULTATION', duration: '30 min' }, createdAt: Date.now() - 86400000 },
  { _id: '9', action: 'LOGOUT', category: 'AUTH', severity: 'INFO', description: 'User logged out', user: { id: '3', name: 'Emily Davis', email: 'emily@immigration.com' }, ipAddress: '192.168.1.102', userAgent: 'Safari/17.0', createdAt: Date.now() - 90000000 },
  { _id: '10', action: 'PASSWORD_CHANGE', category: 'AUTH', severity: 'INFO', description: 'Password changed successfully', user: { id: '4', name: 'James Wilson', email: 'james@immigration.com' }, ipAddress: '192.168.1.103', userAgent: 'Edge/120.0', createdAt: Date.now() - 172800000 },
]

export default function AuditLogPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterSeverity, setFilterSeverity] = useState('all')

  const filteredLogs = mockLogs.filter(log => {
    const matchesSearch = log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'all' || log.category === filterCategory
    const matchesSeverity = filterSeverity === 'all' || log.severity === filterSeverity
    return matchesSearch && matchesCategory && matchesSeverity
  })

  const getActionIcon = (action: string) => {
    if (action.includes('LOGIN')) return <LogIn className="h-4 w-4" />
    if (action.includes('LOGOUT')) return <LogOut className="h-4 w-4" />
    if (action.includes('CREATE')) return <User className="h-4 w-4" />
    if (action.includes('UPDATE') || action.includes('CHANGE')) return <Edit className="h-4 w-4" />
    if (action.includes('DELETE')) return <Trash2 className="h-4 w-4" />
    if (action.includes('DOCUMENT')) return <FileText className="h-4 w-4" />
    if (action.includes('SETTINGS')) return <Settings className="h-4 w-4" />
    return <Eye className="h-4 w-4" />
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'AUTH': return 'bg-blue-100 text-blue-800'
      case 'USER': return 'bg-purple-100 text-purple-800'
      case 'CASE': return 'bg-green-100 text-green-800'
      case 'DOCUMENT': return 'bg-yellow-100 text-yellow-800'
      case 'APPOINTMENT': return 'bg-indigo-100 text-indigo-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'INFO': return <Badge variant="info">INFO</Badge>
      case 'WARNING': return <Badge variant="warning">WARNING</Badge>
      case 'CRITICAL': return <Badge variant="danger">CRITICAL</Badge>
      default: return <Badge>{severity}</Badge>
    }
  }

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  return (
    <>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Audit Log</h1>
            <p className="mt-2 text-gray-600">Track all system activities and changes</p>
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Logs
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Events</p>
                <p className="text-2xl font-bold">{mockLogs.length}</p>
              </div>
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Warnings</p>
                <p className="text-2xl font-bold text-orange-600">{mockLogs.filter(l => l.severity === 'WARNING').length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Critical</p>
                <p className="text-2xl font-bold text-red-600">{mockLogs.filter(l => l.severity === 'CRITICAL').length}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today</p>
                <p className="text-2xl font-bold">{mockLogs.filter(l => Date.now() - l.createdAt < 86400000).length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Events</CardTitle>
              <CardDescription>{filteredLogs.length} log entries</CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search logs..."
                  className="pl-10 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value="AUTH">Authentication</option>
                <option value="USER">User</option>
                <option value="CASE">Case</option>
                <option value="DOCUMENT">Document</option>
                <option value="APPOINTMENT">Appointment</option>
                <option value="SYSTEM">System</option>
              </select>
              <select
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
              >
                <option value="all">All Severity</option>
                <option value="INFO">Info</option>
                <option value="WARNING">Warning</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Timestamp</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Action</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">User</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Category</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Severity</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Description</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">IP Address</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={log._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-600 whitespace-nowrap">
                      <div>
                        <p className="font-medium">{formatTime(log.createdAt)}</p>
                        <p className="text-xs text-gray-400">{new Date(log.createdAt).toLocaleString()}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-gray-100 rounded">
                          {getActionIcon(log.action)}
                        </div>
                        <span className="text-sm font-medium">{log.action}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-sm font-medium">{log.user.name}</p>
                        <p className="text-xs text-gray-500">{log.user.email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(log.category)}`}>
                        {log.category}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {getSeverityBadge(log.severity)}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 max-w-xs truncate">
                      {log.description}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500 font-mono">
                      {log.ipAddress}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

import { Input } from '@/components/ui/Input'

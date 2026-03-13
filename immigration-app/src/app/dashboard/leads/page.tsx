'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import {
  Users,
  Search,
  Filter,
  Plus,
  Download,
  Edit,
  Trash2,
  MoreVertical,
  Phone,
  Mail,
  Calendar,
  ArrowUpDown
} from 'lucide-react'
import Link from 'next/link'

interface Lead {
  _id: string
  id?: string // for compatibility
  firstName: string
  lastName: string
  email?: string
  phone: string
  source: string
  status: string
  priority: string
  assignedTo?: {
    id: string
    name: string
    email: string
    role: string
  }
  capturedAt?: number
  updatedAt: number
  createdAt: number
  _count: {
    notes: number
    activities: number
  }
}

export default function LeadsPage() {
  const leads = [
    { _id: '1', firstName: 'John', lastName: 'Smith', email: 'john@example.com', phone: '555-0101', source: 'Website', status: 'NEW', priority: 'high', capturedAt: Date.now(), updatedAt: Date.now(), createdAt: Date.now(), _creationTime: Date.now(), assignedTo: { id: '1', name: 'Admin', email: 'admin@example.com', role: 'admin' }, _count: { notes: 2, activities: 3 } },
    { _id: '2', firstName: 'Maria', lastName: 'Garcia', email: 'maria@example.com', phone: '555-0102', source: 'Referral', status: 'CONTACTED', priority: 'medium', capturedAt: Date.now(), updatedAt: Date.now(), createdAt: Date.now(), _creationTime: Date.now(), assignedTo: null, _count: { notes: 1, activities: 2 } },
    { _id: '3', firstName: 'Ahmed', lastName: 'Hassan', email: 'ahmed@example.com', phone: '555-0103', source: 'Website', status: 'QUALIFIED', priority: 'high', capturedAt: Date.now(), updatedAt: Date.now(), createdAt: Date.now(), _creationTime: Date.now(), assignedTo: { id: '1', name: 'Admin', email: 'admin@example.com', role: 'admin' }, _count: { notes: 3, activities: 5 } },
    { _id: '4', firstName: 'Sarah', lastName: 'Johnson', email: 'sarah@example.com', phone: '555-0104', source: 'LinkedIn', status: 'APPOINTMENT_SCHEDULED', priority: 'low', capturedAt: Date.now(), updatedAt: Date.now(), createdAt: Date.now(), _creationTime: Date.now(), assignedTo: null, _count: { notes: 1, activities: 2 } },
    { _id: '5', firstName: 'Carlos', lastName: 'Rodriguez', email: 'carlos@example.com', phone: '555-0105', source: 'Referral', status: 'CONVERTED', priority: 'medium', capturedAt: Date.now(), updatedAt: Date.now(), createdAt: Date.now(), _creationTime: Date.now(), assignedTo: { id: '1', name: 'Admin', email: 'admin@example.com', role: 'admin' }, _count: { notes: 4, activities: 6 } },
  ]
  const loading = false

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [sortField, setSortField] = useState('createdAt')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  const deleteLeadMutation = { mutate: (x: any) => console.log('Delete:', x) };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = searchTerm === '' ||
      lead.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.email && lead.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      lead.phone.includes(searchTerm)

    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || lead.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const getSortIcon = (field: string) => {
    if (sortField !== field) return null
    return sortDirection === 'asc' ? '↑' : '↓'
  }

  const sortedLeads = [...filteredLeads].sort((a, b) => {
    const sortKey = sortField as keyof typeof a
    const aValue = a[sortKey]
    const bValue = b[sortKey]

    if (aValue == null && bValue == null) return 0
    if (aValue == null) return 1
    if (bValue == null) return -1

    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  const handleExport = () => {
    const csvContent = [
      ['Name', 'Email', 'Phone', 'Status', 'Priority', 'Source', 'Created'].join(','),
      ...sortedLeads.map(lead => [
        `${lead.firstName} ${lead.lastName}`,
        lead.email || '',
        lead.phone,
        lead.status,
        lead.priority,
        lead.source,
        new Date(lead.createdAt).toLocaleDateString()
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `leads-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleDeleteLead = async (leadId: string) => {
    if (!confirm('Are you sure you want to delete this lead?')) return
    console.log('Delete lead:', leadId)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NEW': return 'bg-blue-100 text-blue-800'
      case 'CONTACTED': return 'bg-yellow-100 text-yellow-800'
      case 'QUALIFIED': return 'bg-green-100 text-green-800'
      case 'APPOINTMENT_SCHEDULED': return 'bg-purple-100 text-purple-800'
      case 'CONVERTED': return 'bg-green-100 text-green-800'
      case 'LOST': return 'bg-red-100 text-red-800'
      case 'ARCHIVED': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'LOW': return 'bg-gray-100 text-gray-800'
      case 'MEDIUM': return 'bg-blue-100 text-blue-800'
      case 'HIGH': return 'bg-orange-100 text-orange-800'
      case 'URGENT': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Leads</h1>
            <p className="mt-2 text-gray-600">
              Manage and track your immigration leads
            </p>
          </div>
          <Link href="/dashboard/leads/new">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Lead
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters and Search */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search leads by name, email, or phone..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="NEW">New</option>
                <option value="CONTACTED">Contacted</option>
                <option value="QUALIFIED">Qualified</option>
                <option value="APPOINTMENT_SCHEDULED">Appointment Scheduled</option>
                <option value="CONVERTED">Converted</option>
                <option value="LOST">Lost</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
            <div>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option value="all">All Priorities</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Leads</p>
                <p className="text-2xl font-bold">{leads.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">New Today</p>
                <p className="text-2xl font-bold">
                  {leads.filter(l => new Date(l.createdAt).toDateString() === new Date().toDateString()).length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold">
                  {leads.length > 0
                    ? `${((leads.filter(l => l.status === 'CONVERTED').length / leads.length) * 100).toFixed(1)}%`
                    : '0%'}
                </p>
              </div>
              <ArrowUpDown className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Response Time</p>
                <p className="text-2xl font-bold">2.4h</p>
              </div>
              <Phone className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leads Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Leads</CardTitle>
              <CardDescription>
                Showing {sortedLeads.length} of {leads.length} leads
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
              <p className="mt-4 text-gray-600">Loading leads...</p>
            </div>
          ) : sortedLeads.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No leads found</h3>
              <p className="mt-2 text-gray-600">
                {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Get started by creating a new lead'}
              </p>
              {!searchTerm && statusFilter === 'all' && priorityFilter === 'all' && (
                <div className="mt-6">
                  <Link href="/dashboard/leads/new">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Lead
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700" onClick={() => handleSort('firstName')}>
                      Name {getSortIcon('firstName')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700" onClick={() => handleSort('status')}>
                      Status {getSortIcon('status')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700" onClick={() => handleSort('priority')}>
                      Priority {getSortIcon('priority')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assigned To
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700" onClick={() => handleSort('createdAt')}>
                      Last Updated {getSortIcon('createdAt')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {sortedLeads.map((lead) => (
                    <tr key={lead._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-blue-800 font-medium">
                                {lead.firstName[0]}{lead.lastName[0]}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {lead.firstName} {lead.lastName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {lead.source.replace('_', ' ')}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{lead.phone}</div>
                        <div className="text-sm text-gray-500">{lead.email || 'No email'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(lead.status)}`}>
                          {lead.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getPriorityColor(lead.priority)}`}>
                          {lead.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {lead.assignedTo?.name || 'Unassigned'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(lead._creationTime).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <Link href={`/dashboard/leads/${lead._id}`}>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          {true ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteLead(lead._id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          ) : (
                            <button className="text-gray-400 cursor-not-allowed">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                          <button className="text-gray-600 hover:text-gray-900">
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}

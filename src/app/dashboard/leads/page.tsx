'use client'

import { useState } from 'react'
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

  const sortedLeads = [...filteredLeads].sort((a, b) => {
    // @ts-ignore
    const aValue = a[sortField]
    // @ts-ignore
    const bValue = b[sortField]

    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

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
    <>
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
    </>
  );
}

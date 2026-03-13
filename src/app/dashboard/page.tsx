'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Progress } from '@/components/ui/Progress'
import { Calendar, FileText, Users, Clock, CheckCircle, AlertCircle, BarChart3, Activity } from 'lucide-react'
import Link from 'next/link'
import DashboardLayout from '@/components/layout/DashboardLayout'

export default function DashboardPage() {
  const router = useRouter()
  const [userEmail, setUserEmail] = useState('')
  const [userName, setUserName] = useState('User')
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    const email = localStorage.getItem('userEmail')
    const name = localStorage.getItem('userName')

    if (!isLoggedIn || !email) {
      router.push('/auth/login')
      return
    }

    setUserEmail(email)
    setUserName(name || 'User')
    setIsChecking(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) 

  const user = { email: userEmail, name: userName, role: 'admin' };

  const totalLeads = 24;
  const activeCases = 18;
  const pendingTasks = 5;

  // Mock recent activities for now
  const recentActivities = [
    { id: '1', type: 'lead', description: 'New lead added: John Smith', time: '2 hours ago', user: 'Admin' },
    { id: '2', type: 'case', description: 'Case IMM-2026-001 status updated', time: '4 hours ago', user: 'Admin' },
    { id: '3', type: 'document', description: 'Document uploaded for Maria Garcia', time: 'Yesterday', user: 'Admin' },
    { id: '4', type: 'appointment', description: 'Interview scheduled with Carlos Rodriguez', time: 'Yesterday', user: 'Admin' },
    { id: '5', type: 'communication', description: 'Follow-up call with Sarah Johnson', time: '2 days ago', user: 'Admin' },
  ];

  const upcomingAppointments = 3;

  const mockAppointments = [
    { _id: '1', title: 'Initial Consultation', case: { clientFirstName: 'John', clientLastName: 'Smith' }, scheduledAt: new Date(Date.now() + 86400000).toISOString(), status: 'SCHEDULED' },
    { _id: '2', title: 'Document Review', case: { clientFirstName: 'Maria', clientLastName: 'Garcia' }, scheduledAt: new Date(Date.now() + 172800000).toISOString(), status: 'SCHEDULED' },
    { _id: '3', title: 'Interview Prep', case: { clientFirstName: 'Ahmed', clientLastName: 'Hassan' }, scheduledAt: new Date(Date.now() + 259200000).toISOString(), status: 'SCHEDULED' },
  ];
  const appointmentsList = mockAppointments;

  const quickActions = [
    { title: 'New Lead', icon: Users, href: '/dashboard/leads/new', description: 'Add a new potential client' },
    { title: 'New Case', icon: FileText, href: '/dashboard/cases/new', description: 'Start a new immigration case' },
    { title: 'Upload Document', icon: CheckCircle, href: '/dashboard/documents', description: 'Upload client documents' },
    { title: 'Schedule', icon: Calendar, href: '/dashboard/appointments', description: 'Book an appointment' },
  ];

  // Show loading while checking authentication
  if (isChecking) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg mb-8">
        <div className="px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">
                Welcome back, {user?.name || 'User'}!
              </h1>
              <p className="mt-2 text-blue-100">
                Here&apos;s what&apos;s happening with your cases today.
              </p>
            </div>
            <div className="hidden sm:block">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <p className="text-sm font-medium text-white">Role: <span className="font-normal capitalize">{'role' in user && user.role ? user.role.toLowerCase().replace('_', ' ') : 'User'}</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLeads}</div>
            <p className="text-xs text-green-600 flex items-center">
              <Activity className="h-3 w-3 mr-1" /> 5 new this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Cases</CardTitle>
            <FileText className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCases}</div>
            <div className="mt-2">
              <p className="text-xs text-muted-foreground mb-1">Total Cases</p>
              <Progress value={(activeCases / 25) * 100} className="h-2" />
              <p className="text-xs text-green-600 mt-1">25 total</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingTasks}</div>
            <div className="flex items-center mt-2">
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Docs: 3</p>
                {/* <Progress value={22} className="h-2" /> */}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-green-600 flex items-center">
              <Activity className="h-3 w-3 mr-1" /> Lead Conversion
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest activities across the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        {activity.type === 'lead' && <Users className="h-4 w-4 text-blue-600" />}
                        {activity.type === 'case' && <FileText className="h-4 w-4 text-green-600" />}
                        {activity.type === 'document' && <CheckCircle className="h-4 w-4 text-purple-600" />}
                        {activity.type === 'appointment' && <Calendar className="h-4 w-4 text-orange-600" />}
                        {activity.type === 'communication' && <AlertCircle className="h-4 w-4 text-red-600" />}
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                      <div className="flex items-center text-xs text-gray-500">
                        <span>{activity.time}</span>
                        <span className="mx-2">•</span>
                        <span>by {activity.user}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <Link href="/dashboard/activity">
                  <Button className="w-full border border-input bg-background hover:bg-accent hover:text-accent-foreground">
                    View All Activity
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Appointments & Quick Actions */}
        <div className="space-y-6">
          {/* Upcoming Appointments */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>Next few appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {appointmentsList?.slice(0, 3).map((appointment) => (
                  <div key={appointment._id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{appointment.case?.clientFirstName} {appointment.case?.clientLastName}</p>
                      <p className="text-xs text-gray-500">{appointment.title}</p>
                      <p className="text-xs text-gray-500">{new Date(appointment.scheduledAt).toLocaleString()}</p>
                    </div>
                    <div className={`px-2 py-1 text-xs rounded-full ${appointment.status === 'SCHEDULED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {appointment.status.replace('_', ' ')}
                    </div>
                  </div>
                ))}
                {!appointmentsList?.length && <p className="text-sm text-gray-500">No upcoming appointments.</p>}
              </div>
              <div className="mt-6">
                <Link href="/dashboard/appointments">
                  <Button className="w-full border border-input bg-background hover:bg-accent hover:text-accent-foreground">
                    View Calendar
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks for quick access</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {quickActions.map((action: any) => (
                  <Link key={action.title} href={action.href}>
                    <div className="bg-gray-50 hover:bg-gray-100 rounded-lg p-4 cursor-pointer transition-colors">
                      <div className="flex items-center mb-2">
                        <action.icon className="h-5 w-5 text-blue-600 mr-2" />
                        <h3 className="text-sm font-medium text-gray-900">{action.title}</h3>
                      </div>
                      <p className="text-xs text-gray-600">{action.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>This month&apos;s performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Cases Completed</span>
                    <span className="font-medium">12/15</span>
                  </div>
                  <Progress value={80} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Lead Conversion</span>
                    <span className="font-medium">24%</span>
                  </div>
                  <Progress value={24} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Client Satisfaction</span>
                    <span className="font-medium">4.8/5</span>
                  </div>
                  <Progress value={96} className="h-2" />
                </div>
              </div>
              <div className="mt-6">
                <Link href="/dashboard/analytics">
                  <div className="flex items-center text-sm text-blue-600 hover:text-blue-700">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Detailed Reports
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout >
  )
}
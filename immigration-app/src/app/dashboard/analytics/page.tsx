'use client'

import DashboardLayout from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import {
    Users, Briefcase, FileText, Calendar,
    TrendingUp, TrendingDown, Clock, CheckCircle,
    AlertCircle, DollarSign, Activity, BarChart3
} from 'lucide-react'

export default function AnalyticsPage() {
    const mockData = {
        summary: {
            totalLeads: 48,
            activeCases: 23,
            newLeadsThisMonth: 12
        },
        alerts: {
            pendingDocuments: 8,
            upcomingAppointments: 5,
            overdueReminders: 3
        },
        charts: {
            casesByStatus: [
                { status: 'INITIATED', count: 5 },
                { status: 'IN_PROGRESS', count: 12 },
                { status: 'APPROVED', count: 4 },
                { status: 'REJECTED', count: 2 }
            ]
        },
        recentActivities: [
            { description: 'New lead added: John Smith', timestamp: new Date().toISOString() },
            { description: 'Case IMM-2026-001 updated', timestamp: new Date().toISOString() },
            { description: 'Document uploaded for Maria Garcia', timestamp: new Date().toISOString() }
        ]
    }

    return (
        <DashboardLayout>
            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
                    <p className="mt-2 text-gray-600">Comprehensive insights into your immigration practice</p>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { name: 'Total Leads', value: 48, change: '+12%', trend: 'up', icon: Users, color: 'blue' },
                        { name: 'Active Cases', value: 23, change: '+8%', trend: 'up', icon: Briefcase, color: 'green' },
                        { name: 'Pending Documents', value: 8, change: '-3%', trend: 'down', icon: FileText, color: 'yellow' },
                        { name: 'Upcoming Appointments', value: 5, change: '+5%', trend: 'up', icon: Calendar, color: 'purple' }
                    ].map((stat) => {
                        const Icon = stat.icon
                        return (
                            <Card key={stat.name} className="hover:shadow-lg transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                                            <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                                            <div className="flex items-center mt-2">
                                                {stat.trend === 'up' ? (
                                                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                                                ) : (
                                                    <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                                                )}
                                                <span className={`text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                                                    {stat.change}
                                                </span>
                                                <span className="text-sm text-gray-500 ml-1">vs last month</span>
                                            </div>
                                        </div>
                                        <div className="p-3 rounded-full bg-blue-100">
                                            <Icon className="h-6 w-6 text-blue-600" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Leads Distribution */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Leads by Status</CardTitle>
                            <CardDescription>Distribution of leads across different stages</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {[
                                    { status: 'New', count: 15, color: 'bg-blue-500' },
                                    { status: 'Contacted', count: 12, color: 'bg-yellow-500' },
                                    { status: 'Qualified', count: 10, color: 'bg-green-500' },
                                    { status: 'Converted', count: 8, color: 'bg-purple-500' },
                                    { status: 'Lost', count: 3, color: 'bg-red-500' }
                                ].map((item) => (
                                    <div key={item.status}>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium text-gray-700">{item.status}</span>
                                            <span className="text-sm font-bold text-gray-900">{item.count}</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className={`${item.color} h-2 rounded-full transition-all duration-500`}
                                                style={{ width: `${(item.count / 48) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Cases Distribution */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Cases by Status</CardTitle>
                            <CardDescription>Current status of all immigration cases</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {[
                                    { status: 'Initiated', count: 5, color: 'bg-blue-500' },
                                    { status: 'In Progress', count: 12, color: 'bg-yellow-500' },
                                    { status: 'Approved', count: 4, color: 'bg-green-500' },
                                    { status: 'Rejected', count: 2, color: 'bg-red-500' }
                                ].map((item) => (
                                    <div key={item.status}>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium text-gray-700">{item.status}</span>
                                            <span className="text-sm font-bold text-gray-900">{item.count}</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className={`${item.color} h-2 rounded-full transition-all duration-500`}
                                                style={{ width: `${(item.count / 23) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Alerts & Notifications */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="border-l-4 border-l-red-500">
                        <CardHeader>
                            <CardTitle className="flex items-center text-red-700">
                                <AlertCircle className="h-5 w-5 mr-2" />
                                Overdue Reminders
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold text-red-700">3</p>
                            <p className="text-sm text-gray-600 mt-2">Require immediate attention</p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-yellow-500">
                        <CardHeader>
                            <CardTitle className="flex items-center text-yellow-700">
                                <Clock className="h-5 w-5 mr-2" />
                                Pending Documents
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold text-yellow-700">8</p>
                            <p className="text-sm text-gray-600 mt-2">Awaiting review</p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-blue-500">
                        <CardHeader>
                            <CardTitle className="flex items-center text-blue-700">
                                <Calendar className="h-5 w-5 mr-2" />
                                Expiring Passports
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold text-blue-700">0</p>
                            <p className="text-sm text-gray-600 mt-2">Within 6 months</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Activity */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>Latest updates across all cases</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                { description: 'New lead added: John Smith', timestamp: '2 hours ago' },
                                { description: 'Case IMM-2026-001 status updated', timestamp: '4 hours ago' },
                                { description: 'Document uploaded for Maria Garcia', timestamp: 'Yesterday' },
                                { description: 'Interview scheduled with Carlos Rodriguez', timestamp: 'Yesterday' },
                                { description: 'Follow-up call with Sarah Johnson', timestamp: '2 days ago' }
                            ].map((activity, index) => (
                                <div key={index} className="flex items-start gap-4 pb-4 border-b last:border-b-0">
                                    <div className="p-2 rounded-full bg-blue-100">
                                        <Activity className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                                        <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    )
}

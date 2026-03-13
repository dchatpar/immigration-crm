'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Briefcase, 
  Calendar,
  FileText,
  DollarSign,
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  LineChart,
  Activity
} from 'lucide-react'

interface ReportData {
  month: string
  leads: number
  cases: number
  revenue: number
  appointments: number
}

const monthlyData: ReportData[] = [
  { month: 'Jan', leads: 45, cases: 12, revenue: 18500, appointments: 28 },
  { month: 'Feb', leads: 52, cases: 15, revenue: 22500, appointments: 32 },
  { month: 'Mar', leads: 48, cases: 18, revenue: 28000, appointments: 35 },
  { month: 'Apr', leads: 61, cases: 14, revenue: 21000, appointments: 30 },
  { month: 'May', leads: 55, cases: 20, revenue: 32000, appointments: 42 },
  { month: 'Jun', leads: 67, cases: 22, revenue: 38500, appointments: 48 },
]

const serviceTypeData = [
  { type: 'Work Permit', count: 45, percentage: 35, color: 'bg-blue-500' },
  { type: 'Visa Application', count: 32, percentage: 25, color: 'bg-green-500' },
  { type: 'Green Card', count: 28, percentage: 22, color: 'bg-purple-500' },
  { type: 'Citizenship', count: 15, percentage: 12, color: 'bg-orange-500' },
  { type: 'Other', count: 8, percentage: 6, color: 'bg-gray-500' },
]

const statusData = [
  { status: 'Approved', count: 42, percentage: 33, color: 'bg-green-500' },
  { status: 'In Progress', count: 38, percentage: 30, color: 'bg-blue-500' },
  { status: 'Under Review', count: 24, percentage: 19, color: 'bg-yellow-500' },
  { status: 'Pending', count: 15, percentage: 12, color: 'bg-orange-500' },
  { status: 'Rejected', count: 8, percentage: 6, color: 'bg-red-500' },
]

const topPerformers = [
  { name: 'Sarah Johnson', cases: 24, revenue: 38500, rating: 4.9 },
  { name: 'Michael Chen', cases: 21, revenue: 32000, rating: 4.8 },
  { name: 'Emily Davis', cases: 18, revenue: 28000, rating: 4.7 },
  { name: 'James Wilson', cases: 15, revenue: 24500, rating: 4.6 },
]

const recentActivities = [
  { type: 'case_approved', description: 'Case IMM-2026-045 approved', time: '2 hours ago' },
  { type: 'payment_received', description: '$500 payment received from John Smith', time: '4 hours ago' },
  { type: 'document_uploaded', description: 'New document uploaded for Maria Garcia', time: 'Yesterday' },
  { type: 'appointment_scheduled', description: 'New appointment scheduled with Carlos Rodriguez', time: 'Yesterday' },
  { type: 'lead_converted', description: 'Lead Ahmed Hassan converted to case', time: '2 days ago' },
]

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState('6months')

  const totalLeads = monthlyData.reduce((sum, m) => sum + m.leads, 0)
  const totalCases = monthlyData.reduce((sum, m) => sum + m.cases, 0)
  const totalRevenue = monthlyData.reduce((sum, m) => sum + m.revenue, 0)
  const totalAppointments = monthlyData.reduce((sum, m) => sum + m.appointments, 0)

  const avgLeadsPerMonth = Math.round(totalLeads / monthlyData.length)
  const avgCasesPerMonth = Math.round(totalCases / monthlyData.length)
  const conversionRate = ((totalCases / totalLeads) * 100).toFixed(1)

  const maxRevenue = Math.max(...monthlyData.map(m => m.revenue))
  const maxLeads = Math.max(...monthlyData.map(m => m.leads))

  return (
    <>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
            <p className="mt-2 text-gray-600">Comprehensive insights into your immigration practice</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="30days">Last 30 Days</option>
              <option value="3months">Last 3 Months</option>
              <option value="6months">Last 6 Months</option>
              <option value="12months">Last 12 Months</option>
              <option value="ytd">Year to Date</option>
            </select>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Leads</p>
                <p className="text-3xl font-bold">{totalLeads}</p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowUpRight className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">+12%</span>
                  <span className="text-xs text-gray-500">vs last period</span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Cases</p>
                <p className="text-3xl font-bold">{totalCases}</p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowUpRight className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">+8%</span>
                  <span className="text-xs text-gray-500">vs last period</span>
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Briefcase className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Revenue</p>
                <p className="text-3xl font-bold">${(totalRevenue / 1000).toFixed(1)}K</p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowUpRight className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">+18%</span>
                  <span className="text-xs text-gray-500">vs last period</span>
                </div>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Conversion Rate</p>
                <p className="text-3xl font-bold">{conversionRate}%</p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowDownRight className="h-4 w-4 text-red-600" />
                  <span className="text-sm text-red-600">-2%</span>
                  <span className="text-xs text-gray-500">vs last period</span>
                </div>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="leads">Leads</TabsTrigger>
          <TabsTrigger value="cases">Cases</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Leads & Cases Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5" />
                  Leads & Cases Trend
                </CardTitle>
                <CardDescription>Monthly leads and cases over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monthlyData.map((month, index) => (
                    <div key={month.month} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{month.month}</span>
                        <span className="text-gray-500">Leads: {month.leads} | Cases: {month.cases}</span>
                      </div>
                      <div className="flex gap-2 h-8">
                        <div 
                          className="bg-blue-500 rounded transition-all"
                          style={{ width: `${(month.leads / maxLeads) * 100}%` }}
                        />
                        <div 
                          className="bg-green-500 rounded transition-all"
                          style={{ width: `${(month.cases / maxLeads) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center gap-4 pt-2 text-xs">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-blue-500 rounded"></div>
                      <span>Leads</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-green-500 rounded"></div>
                      <span>Cases</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Revenue Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Revenue Trend
                </CardTitle>
                <CardDescription>Monthly revenue in dollars</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monthlyData.map((month) => (
                    <div key={month.month} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{month.month}</span>
                        <span className="text-gray-500">${month.revenue.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-emerald-500 h-4 rounded-full"
                          style={{ width: `${(month.revenue / maxRevenue) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Service Type Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Service Type Distribution
                </CardTitle>
                <CardDescription>Cases by immigration service type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {serviceTypeData.map((item) => (
                    <div key={item.type} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{item.type}</span>
                        <span className="text-sm text-gray-500">{item.count} ({item.percentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`${item.color} h-2 rounded-full`}
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Case Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Case Status Distribution
                </CardTitle>
                <CardDescription>Current status of all cases</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {statusData.map((item) => (
                    <div key={item.status} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{item.status}</span>
                        <span className="text-sm text-gray-500">{item.count} ({item.percentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`${item.color} h-2 rounded-full`}
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Performers */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Staff</CardTitle>
              <CardDescription>Staff members with highest case counts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Rank</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Name</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Cases Completed</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Revenue Generated</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topPerformers.map((performer, index) => (
                      <tr key={performer.name} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${index === 0 ? 'bg-yellow-100 text-yellow-800' : index === 1 ? 'bg-gray-100 text-gray-800' : 'bg-orange-100 text-orange-800'}`}>
                            {index + 1}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-medium">{performer.name}</td>
                        <td className="py-3 px-4">{performer.cases}</td>
                        <td className="py-3 px-4">${performer.revenue.toLocaleString()}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-500">★</span>
                            <span>{performer.rating}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leads" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Lead Analytics</CardTitle>
              <CardDescription>Detailed breakdown of lead performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <p className="text-3xl font-bold">{totalLeads}</p>
                  <p className="text-gray-600">Total Leads</p>
                </div>
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <p className="text-3xl font-bold">{avgLeadsPerMonth}</p>
                  <p className="text-gray-600">Avg Leads/Month</p>
                </div>
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <p className="text-3xl font-bold">{conversionRate}%</p>
                  <p className="text-gray-600">Conversion Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cases" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Case Analytics</CardTitle>
              <CardDescription>Detailed breakdown of case performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <p className="text-3xl font-bold">{totalCases}</p>
                  <p className="text-gray-600">Total Cases</p>
                </div>
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <p className="text-3xl font-bold">{avgCasesPerMonth}</p>
                  <p className="text-gray-600">Avg Cases/Month</p>
                </div>
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <p className="text-3xl font-bold">42</p>
                  <p className="text-gray-600">Approved Cases</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Analytics</CardTitle>
              <CardDescription>Detailed breakdown of revenue streams</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <p className="text-3xl font-bold">${totalRevenue.toLocaleString()}</p>
                  <p className="text-gray-600">Total Revenue</p>
                </div>
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <p className="text-3xl font-bold">${Math.round(totalRevenue / totalCases).toLocaleString()}</p>
                  <p className="text-gray-600">Avg Revenue/Case</p>
                </div>
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <p className="text-3xl font-bold">${Math.round(totalRevenue / 6).toLocaleString()}</p>
                  <p className="text-gray-600">Monthly Average</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  )
}

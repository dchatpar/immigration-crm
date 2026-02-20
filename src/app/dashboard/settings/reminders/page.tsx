'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Bell, Plus, Trash2, Edit2, Clock } from 'lucide-react'

interface ReminderRule {
    id: string
    name: string
    type: string
    triggerCondition: string
    daysBefore: number
    messageTemplate: string
    isActive: boolean
}

// Mock data (replace with actual API later)
const MOCK_RULES: ReminderRule[] = [
    {
        id: '1',
        name: 'Passport Expiry Warning',
        type: 'PASSPORT_EXPIRY',
        triggerCondition: '6_MONTHS_BEFORE',
        daysBefore: 180,
        messageTemplate: 'Your passport is expiring in 6 months. Please renew it immediately.',
        isActive: true
    },
    {
        id: '2',
        name: 'Appointment Reminder (24h)',
        type: 'APPOINTMENT',
        triggerCondition: '24_HOURS_BEFORE',
        daysBefore: 1,
        messageTemplate: 'You have an appointment tomorrow at {time}.',
        isActive: true
    },
    {
        id: '3',
        name: 'Document Upload Deadline',
        type: 'DOCUMENT_DEADLINE',
        triggerCondition: '3_DAYS_BEFORE',
        daysBefore: 3,
        messageTemplate: 'Reminder: Only 3 days left to upload your documents.',
        isActive: true
    }
]

export default function ReminderRulesPage() {
    const [rules, setRules] = useState<ReminderRule[]>(MOCK_RULES)
    const [loading, setLoading] = useState(false)

    return (
        <DashboardLayout>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Reminder Rules</h1>
                    <p className="mt-2 text-gray-600">Configure automated reminder triggers</p>
                </div>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Rule
                </Button>
            </div>

            <div className="grid gap-6">
                {rules.map((rule) => (
                    <Card key={rule.id}>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${rule.isActive ? 'bg-blue-100' : 'bg-gray-100'}`}>
                                    <Bell className={`h-5 w-5 ${rule.isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                                </div>
                                <div>
                                    <CardTitle className="text-lg">{rule.name}</CardTitle>
                                    <CardDescription>{rule.type.replace(/_/g, ' ')}</CardDescription>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                    <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Clock className="h-4 w-4" />
                                    <span>Triggers: {rule.daysBefore} days before event</span>
                                </div>
                                <div className="bg-gray-50 p-3 rounded text-sm text-gray-700 italic border border-gray-200">
                                    &quot;{rule.messageTemplate}&quot;
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </DashboardLayout>
    )
}

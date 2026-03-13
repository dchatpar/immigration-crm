'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Switch } from '@/components/ui/Switch'
import { Mail, MessageSquare, Bell, Shield, Server, Clock } from 'lucide-react'

// Simple checkbox component removed as we utilize the Switch component

export default function AutomationSettingsPage() {
    const [settings, setSettings] = useState({
        emailEnabled: true,
        smsEnabled: true,
        autoReminders: true,
        weekendProcessing: false,
        debugMode: false
    })

    const [saving, setSaving] = useState(false)

    const handleToggle = (key: keyof typeof settings) => {
        setSettings(prev => ({
            ...prev,
            [key]: !prev[key]
        }))
    }

    const handleSave = async () => {
        setSaving(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        setSaving(false)
        alert('Automation settings saved')
    }

    return (
        <DashboardLayout>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Automation Settings</h1>
                    <p className="mt-2 text-gray-600">Control system-wide automation features</p>
                </div>
                <Button onClick={handleSave} disabled={saving}>
                    {saving ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>

            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Communication Channels</CardTitle>
                        <CardDescription>Enable or disable automated messaging channels</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Mail className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="font-medium">Email Notifications</p>
                                    <p className="text-sm text-gray-500">Send automated emails via SendGrid</p>
                                </div>
                            </div>
                            <Switch
                                checked={settings.emailEnabled}
                                onCheckedChange={() => handleToggle('emailEnabled')}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <MessageSquare className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="font-medium">SMS Notifications</p>
                                    <p className="text-sm text-gray-500">Send automated SMS via Twilio</p>
                                </div>
                            </div>
                            <Switch
                                checked={settings.smsEnabled}
                                onCheckedChange={() => handleToggle('smsEnabled')}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Processing Rules</CardTitle>
                        <CardDescription>Configure when and how automations run</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-orange-100 rounded-lg">
                                    <Bell className="h-5 w-5 text-orange-600" />
                                </div>
                                <div>
                                    <p className="font-medium">Auto-Reminders</p>
                                    <p className="text-sm text-gray-500">Automatically generate due reminders</p>
                                </div>
                            </div>
                            <Switch
                                checked={settings.autoReminders}
                                onCheckedChange={() => handleToggle('autoReminders')}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <Clock className="h-5 w-5 text-purple-600" />
                                </div>
                                <div>
                                    <p className="font-medium">Weekend Processing</p>
                                    <p className="text-sm text-gray-500">Send notifications on weekends</p>
                                </div>
                            </div>
                            <Switch
                                checked={settings.weekendProcessing}
                                onCheckedChange={() => handleToggle('weekendProcessing')}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>System & Debug</CardTitle>
                        <CardDescription>Advanced system configurations</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gray-100 rounded-lg">
                                    <Server className="h-5 w-5 text-gray-600" />
                                </div>
                                <div>
                                    <p className="font-medium">Debug Mode</p>
                                    <p className="text-sm text-gray-500">Log detailed automation events</p>
                                </div>
                            </div>
                            <Switch
                                checked={settings.debugMode}
                                onCheckedChange={() => handleToggle('debugMode')}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    )
}

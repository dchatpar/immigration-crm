'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Save, RefreshCw, Settings as SettingsIcon } from 'lucide-react'

interface Setting {
    id: string
    key: string
    value: string
    category: string
    description: string
}

interface GroupedSettings {
    [category: string]: Setting[]
}

export default function SettingsPage() {
    const [settings, setSettings] = useState<GroupedSettings>({})
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [editedSettings, setEditedSettings] = useState<Record<string, string>>({})

    useEffect(() => {
        fetchSettings()
    }, [])

    const fetchSettings = async () => {
        try {
            setLoading(true)
            const response = await fetch('/api/settings')
            const data = await response.json()
            if (data.success) {
                setSettings(data.data)
                // Initialize edited settings
                const initial: Record<string, string> = {}
                Object.values(data.data as GroupedSettings).flat().forEach(s => {
                    initial[s.key] = s.value
                })
                setEditedSettings(initial)
            }
        } catch (error) {
            console.error('Error fetching settings:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async (category: string) => {
        try {
            setSaving(true)
            const categorySettings = settings[category]

            const promises = categorySettings.map(setting => {
                return fetch('/api/settings', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        key: setting.key,
                        value: editedSettings[setting.key],
                        category,
                        description: setting.description
                    })
                })
            })

            await Promise.all(promises)
            alert('Settings saved successfully')
        } catch (error) {
            alert('Failed to save settings')
        } finally {
            setSaving(false)
        }
    }

    const handleInputChange = (key: string, value: string) => {
        setEditedSettings(prev => ({
            ...prev,
            [key]: value
        }))
    }

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
                    <p className="mt-2 text-gray-600">Configure global application settings</p>
                </div>
                <Button onClick={fetchSettings} variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                </Button>
            </div>

            <div className="grid gap-6">
                {Object.entries(settings).map(([category, categorySettings]) => (
                    <Card key={category}>
                        <CardHeader>
                            <CardTitle className="capitalize">{category.replace(/_/g, ' ')} Settings</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {categorySettings.map((setting) => (
                                    <div key={setting.id} className="grid gap-2">
                                        <label className="text-sm font-medium text-gray-700">
                                            {setting.key.split('_').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ')}
                                        </label>
                                        <div className="flex gap-4">
                                            <input
                                                type="text"
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                value={editedSettings[setting.key] || ''}
                                                onChange={(e) => handleInputChange(setting.key, e.target.value)}
                                                placeholder="Enter value..."
                                            />
                                        </div>
                                        {setting.description && (
                                            <p className="text-xs text-gray-500">{setting.description}</p>
                                        )}
                                    </div>
                                ))}
                                <div className="pt-4 flex justify-end">
                                    <Button onClick={() => handleSave(category)} disabled={saving}>
                                        <Save className="h-4 w-4 mr-2" />
                                        Save {category} Settings
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {Object.keys(settings).length === 0 && (
                    <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                        <SettingsIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">No Settings Configured</h3>
                        <p className="text-gray-500 mt-2">Initialize the database seeds to see default settings.</p>
                    </div>
                )}
            </div>
        </DashboardLayout>
    )
}

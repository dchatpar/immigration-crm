'use client'

import DashboardLayout from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Plus, Trash2, Edit2, GitBranch } from 'lucide-react'

interface WorkflowStep {
    _id: string
    stepName: string
    stepType: string
    stepOrder: number
    config?: string
}

interface WorkflowTemplate {
    _id: string
    name: string
    serviceType: string
    isActive: boolean
}

export default function WorkflowsPage() {
    const templates = [
        { _id: '1', name: 'Work Permit Application', serviceType: 'WORK_PERMIT', isActive: true },
        { _id: '2', name: 'Visa Application', serviceType: 'VISA_APPLICATION', isActive: true },
        { _id: '3', name: 'Green Card Renewal', serviceType: 'GREEN_CARD', isActive: false },
    ]

    const getTemplateSteps = async (templateId: string) => {
        return []
    }

    return (
        <DashboardLayout>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Workflow Templates</h1>
                    <p className="mt-2 text-gray-600">Manage automated case workflows</p>
                </div>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Template
                </Button>
            </div>

            <div className="grid gap-6">
                {templates && templates.length > 0 ? (
                    templates.map((template: any) => (
                        <Card key={template._id}>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>{template.name}</CardTitle>
                                    <CardDescription>Service Type: {template.serviceType.replace(/_/g, ' ')}</CardDescription>
                                </div>
                                <div className="flex gap-2">
                                    <Button className="border">
                                        <Edit2 className="h-4 w-4" />
                                    </Button>
                                    <Button className="border text-red-600 hover:text-red-700">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm text-gray-600">
                                    {template.isActive ? (
                                        <span className="text-green-600">● Active</span>
                                    ) : (
                                        <span className="text-gray-400">● Inactive</span>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="text-center py-12">
                        <GitBranch className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">No Workflows</h3>
                        <p className="text-gray-500 mt-2">Create your first automation workflow to get started.</p>
                    </div>
                )}
            </div>
        </DashboardLayout>
    )
}

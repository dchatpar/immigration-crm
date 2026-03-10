'use client'

import { useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { AlertCircle, FileText, Clock, CheckCircle } from 'lucide-react'

export default function CustomerPortalPage() {
    const params = useParams()
    const token = params.token as string

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Secure Document Portal</h1>
                    <p className="mt-2 text-gray-600">
                        Token: {token ? token.substring(0, 8) + '...' : 'Invalid'}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle>Case Status</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                                    <Clock className="h-6 w-6 text-blue-600" />
                                    <div>
                                        <p className="font-medium text-blue-900">Portal Loading...</p>
                                        <p className="text-sm text-blue-700">Connecting to server</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="mt-6">
                            <CardHeader>
                                <CardTitle>How It Works</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex gap-3">
                                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                                    <p className="text-sm text-gray-600">View your case status and updates</p>
                                </div>
                                <div className="flex gap-3">
                                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                                    <p className="text-sm text-gray-600">Upload required documents securely</p>
                                </div>
                                <div className="flex gap-3">
                                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                                    <p className="text-sm text-gray-600">Track document review status</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Notice</CardTitle>
                                <CardDescription>
                                    Document Portal
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-start gap-4 p-6 bg-yellow-50 rounded-lg">
                                    <AlertCircle className="h-8 w-8 text-yellow-600 flex-shrink-0" />
                                    <div>
                                        <p className="font-medium text-yellow-900">Setup Required</p>
                                        <p className="text-sm text-yellow-800 mt-2">
                                            This portal requires Convex backend to be configured. 
                                            Please contact your immigration consultant to get your case linked 
                                            to the client portal system.
                                        </p>
                                        <p className="text-sm text-yellow-800 mt-4">
                                            Once configured, you&apos;ll receive a secure link to access your case documents.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="mt-6">
                            <CardHeader>
                                <CardTitle>Need Help?</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-600">
                                    Contact our office for assistance with your case or portal access.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

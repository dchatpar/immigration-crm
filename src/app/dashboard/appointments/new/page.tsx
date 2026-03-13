'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Badge } from '@/components/ui/Badge'
import { 
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  Video,
  MapPin,
  DollarSign,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

const APPOINTMENT_TYPES = [
  { id: 'SHORT_CONSULTATION', name: 'Short Consultation', duration: 15, fee: 85, description: '15-minute initial assessment' },
  { id: 'FULL_CONSULTATION', name: 'Full Consultation', duration: 30, fee: 185, description: '30-minute comprehensive consultation' },
  { id: 'DOCUMENT_REVIEW', name: 'Document Review', duration: 45, fee: 150, description: 'Review of immigration documents' },
  { id: 'INTERVIEW_PREP', name: 'Interview Preparation', duration: 60, fee: 200, description: 'Mock interview and preparation' },
  { id: 'FOLLOW_UP', name: 'Follow-up Call', duration: 15, fee: 50, description: 'Quick follow-up discussion' },
]

const TIME_SLOTS = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
  '04:00 PM', '04:30 PM'
]

export default function NewAppointmentPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    caseId: '',
    appointmentType: '',
    date: '',
    time: '',
    location: 'video',
    notes: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const selectedType = APPOINTMENT_TYPES.find(t => t.id === formData.appointmentType)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.clientName.trim()) newErrors.clientName = 'Client name is required'
    if (!formData.clientEmail.trim()) newErrors.clientEmail = 'Client email is required'
    if (!formData.appointmentType) newErrors.appointmentType = 'Please select an appointment type'
    if (!formData.date) newErrors.date = 'Please select a date'
    if (!formData.time) newErrors.time = 'Please select a time'
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (formData.clientEmail && !emailRegex.test(formData.clientEmail)) {
      newErrors.clientEmail = 'Please enter a valid email'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    alert('Appointment scheduled successfully!')
    router.push('/dashboard/appointments')
  }

  const getTomorrowDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  }

  const getMaxDate = () => {
    const maxDate = new Date()
    maxDate.setDate(maxDate.getDate() + 90)
    return maxDate.toISOString().split('T')[0]
  }

  return (
    <>
      <div className="mb-8">
        <Button 
          variant="ghost" 
          className="mb-4"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Appointments
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Schedule New Appointment</h1>
        <p className="mt-2 text-gray-600">Book a new consultation or meeting with a client</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Client Information</CardTitle>
                <CardDescription>Enter the client&apos;s details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Client Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Full name"
                        className="pl-10"
                        value={formData.clientName}
                        onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                      />
                    </div>
                    {errors.clientName && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.clientName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Case Number (Optional)
                    </label>
                    <Input
                      placeholder="IMM-2026-001"
                      value={formData.caseId}
                      onChange={(e) => setFormData({ ...formData, caseId: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="email"
                        placeholder="client@example.com"
                        className="pl-10"
                        value={formData.clientEmail}
                        onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                      />
                    </div>
                    {errors.clientEmail && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.clientEmail}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        className="pl-10"
                        value={formData.clientPhone}
                        onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Appointment Details</CardTitle>
                <CardDescription>Select the type, date, and time</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Appointment Type *
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {APPOINTMENT_TYPES.map((type) => (
                      <div
                        key={type.id}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          formData.appointmentType === type.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setFormData({ ...formData, appointmentType: type.id })}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{type.name}</span>
                          <span className="text-sm font-bold text-green-600">${type.fee}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                          <Clock className="h-3 w-3" />
                          {type.duration} min
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{type.description}</p>
                      </div>
                    ))}
                  </div>
                  {errors.appointmentType && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.appointmentType}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="date"
                        className="pl-10"
                        min={getTomorrowDate()}
                        max={getMaxDate()}
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      />
                    </div>
                    {errors.date && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.date}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Time *
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <select
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      >
                        <option value="">Select time</option>
                        {TIME_SLOTS.map((slot) => (
                          <option key={slot} value={slot}>{slot}</option>
                        ))}
                      </select>
                    </div>
                    {errors.time && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.time}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'video', name: 'Video Call', icon: Video },
                      { id: 'office', name: 'Office', icon: MapPin },
                      { id: 'phone', name: 'Phone Call', icon: Phone },
                    ].map((loc) => (
                      <div
                        key={loc.id}
                        className={`p-3 border-2 rounded-lg cursor-pointer transition-all flex items-center justify-center gap-2 ${
                          formData.location === loc.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setFormData({ ...formData, location: loc.id })}
                      >
                        <loc.icon className="h-4 w-4" />
                        <span className="text-sm font-medium">{loc.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes (Optional)
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Add any additional notes..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Appointment Summary</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedType ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">Type</span>
                      <span className="font-medium">{selectedType.name}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">Duration</span>
                      <span className="font-medium">{selectedType.duration} minutes</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">Location</span>
                      <span className="font-medium capitalize">{formData.location === 'video' ? 'Video Call' : formData.location}</span>
                    </div>
                    {formData.date && (
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-600">Date</span>
                        <span className="font-medium">{new Date(formData.date).toLocaleDateString()}</span>
                      </div>
                    )}
                    {formData.time && (
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-600">Time</span>
                        <span className="font-medium">{formData.time}</span>
                      </div>
                    )}
                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Consultation Fee</span>
                        <span className="text-2xl font-bold text-green-600">${selectedType.fee}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
                      <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>Payment will be collected at the time of appointment</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                    <p>Select an appointment type to see the summary</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="space-y-3">
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Scheduling...' : 'Schedule Appointment'}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </form>
    </>
  )
}

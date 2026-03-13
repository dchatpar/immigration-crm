'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { 
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  FileText,
  AlertCircle,
  CheckCircle,
  DollarSign,
  Calendar
} from 'lucide-react'

const SERVICE_TYPES = [
  { id: 'WORK_PERMIT', name: 'Work Permit', description: 'Employment authorization document', tier: 'standard', baseFee: 1500 },
  { id: 'VISA_APPLICATION', name: 'Visa Application', description: 'Tourist, student, or work visa', tier: 'standard', baseFee: 2000 },
  { id: 'GREEN_CARD', name: 'Green Card', description: 'Permanent residence application', tier: 'premium', baseFee: 3500 },
  { id: 'CITIZENSHIP', name: 'Citizenship', description: 'Naturalization application', tier: 'premium', baseFee: 2500 },
  { id: 'VISA_RENEWAL', name: 'Visa Renewal', description: 'Extension of existing visa', tier: 'standard', baseFee: 800 },
  { id: 'DEPORTATION_DEFENSE', name: 'Deportation Defense', description: 'Defense against removal', tier: 'premium', baseFee: 5000 },
  { id: 'ASYLUM', name: 'Asylum Application', description: 'Political asylum or refugee status', tier: 'premium', baseFee: 4000 },
]

const TIER_FEES = {
  standard: { base: 500, additional: 200 },
  premium: { base: 800, additional: 350 },
}

export default function NewCasePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    // Client Info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    countryOfBirth: '',
    currentAddress: '',
    city: '',
    state: '',
    zipCode: '',
    // Case Info
    serviceType: '',
    priority: 'MEDIUM',
    assignedTo: '',
    notes: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const selectedService = SERVICE_TYPES.find(s => s.id === formData.serviceType)

  const calculateFee = () => {
    if (!selectedService) return 0
    const tierInfo = TIER_FEES[selectedService.tier as keyof typeof TIER_FEES]
    return selectedService.baseFee + (formData.priority === 'HIGH' ? 300 : 0) + (formData.priority === 'URGENT' ? 500 : 0)
  }

  const validateStep = (stepNumber: number) => {
    const newErrors: Record<string, string> = {}
    
    if (stepNumber === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
      if (!formData.email.trim()) newErrors.email = 'Email is required'
      if (!formData.phone.trim()) newErrors.phone = 'Phone is required'
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (formData.email && !emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email'
      }
    }
    
    if (stepNumber === 2) {
      if (!formData.serviceType) newErrors.serviceType = 'Please select a service type'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    setStep(step - 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateStep(2)) return

    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    alert('Case created successfully!')
    router.push('/dashboard/cases')
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
          Back to Cases
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Create New Case</h1>
        <p className="mt-2 text-gray-600">Set up a new immigration case for a client</p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-center">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                step >= s 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {step > s ? <CheckCircle className="h-5 w-5" /> : s}
              </div>
              {s < 3 && (
                <div className={`w-24 h-1 ${step > s ? 'bg-blue-600' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-2">
          <span className="text-sm text-gray-600 mr-16">Client Information</span>
          <span className="text-sm text-gray-600 mr-16">Case Details</span>
          <span className="text-sm text-gray-600">Review & Submit</span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Client Information</CardTitle>
                  <CardDescription>Enter the client&apos;s personal details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="John"
                          className="pl-10"
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        />
                      </div>
                      {errors.firstName && (
                        <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name *
                      </label>
                      <Input
                        placeholder="Smith"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      />
                      {errors.lastName && (
                        <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                      )}
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
                          placeholder="john@example.com"
                          className="pl-10"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          type="tel"
                          placeholder="+1 (555) 000-0000"
                          className="pl-10"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date of Birth
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          type="date"
                          className="pl-10"
                          value={formData.dateOfBirth}
                          onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country of Birth
                      </label>
                      <Input
                        placeholder="United States"
                        value={formData.countryOfBirth}
                        onChange={(e) => setFormData({ ...formData, countryOfBirth: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Address
                    </label>
                    <Input
                      placeholder="123 Main Street"
                      value={formData.currentAddress}
                      onChange={(e) => setFormData({ ...formData, currentAddress: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <Input
                        placeholder="New York"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                      <Input
                        placeholder="NY"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                      <Input
                        placeholder="10001"
                        value={formData.zipCode}
                        onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Case Details</CardTitle>
                  <CardDescription>Select the service type and priority</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Service Type *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {SERVICE_TYPES.map((service) => (
                        <div
                          key={service.id}
                          className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            formData.serviceType === service.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setFormData({ ...formData, serviceType: service.id })}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{service.name}</span>
                            <Badge variant={service.tier === 'premium' ? 'warning' : 'default'}>
                              {service.tier}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{service.description}</p>
                        </div>
                      ))}
                    </div>
                    {errors.serviceType && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.serviceType}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority Level
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {['LOW', 'MEDIUM', 'HIGH', 'URGENT'].map((priority) => (
                        <div
                          key={priority}
                          className={`p-3 border-2 rounded-lg cursor-pointer text-center transition-all ${
                            formData.priority === priority
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setFormData({ ...formData, priority })}
                        >
                          <span className={`text-sm font-medium ${
                            priority === 'URGENT' ? 'text-red-600' :
                            priority === 'HIGH' ? 'text-orange-600' :
                            'text-gray-700'
                          }`}>
                            {priority}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Assigned To
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.assignedTo}
                      onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                    >
                      <option value="">Select team member</option>
                      <option value="sarah">Sarah Johnson</option>
                      <option value="michael">Michael Chen</option>
                      <option value="emily">Emily Davis</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notes
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
            )}

            {step === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle>Review & Submit</CardTitle>
                  <CardDescription>Review the case details before creating</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Client Information</h4>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Name</span>
                        <span className="font-medium">{formData.firstName} {formData.lastName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email</span>
                        <span className="font-medium">{formData.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Phone</span>
                        <span className="font-medium">{formData.phone}</span>
                      </div>
                      {formData.currentAddress && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Address</span>
                          <span className="font-medium">{formData.currentAddress}, {formData.city}, {formData.state} {formData.zipCode}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Case Information</h4>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Service Type</span>
                        <span className="font-medium">{selectedService?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Priority</span>
                        <Badge variant={formData.priority === 'URGENT' ? 'danger' : formData.priority === 'HIGH' ? 'warning' : 'default'}>
                          {formData.priority}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tier</span>
                        <Badge variant={selectedService?.tier === 'premium' ? 'warning' : 'default'}>
                          {selectedService?.tier}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-between mt-6">
              {step > 1 ? (
                <Button type="button" variant="outline" onClick={handleBack}>
                  Back
                </Button>
              ) : (
                <div />
              )}
              
              {step < 3 ? (
                <Button type="button" onClick={handleNext}>
                  Continue
                </Button>
              ) : (
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating...' : 'Create Case'}
                </Button>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Case Summary</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedService ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">Service</span>
                      <span className="font-medium text-sm text-center">{selectedService.name}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">Base Fee</span>
                      <span className="font-medium">${selectedService.baseFee.toLocaleString()}</span>
                    </div>
                    {formData.priority === 'HIGH' && (
                      <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                        <span className="text-sm text-orange-700">High Priority</span>
                        <span className="font-medium text-orange-700">+$300</span>
                      </div>
                    )}
                    {formData.priority === 'URGENT' && (
                      <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                        <span className="text-sm text-red-700">Urgent</span>
                        <span className="font-medium text-red-700">+$500</span>
                      </div>
                    )}
                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Total Fee</span>
                        <span className="text-2xl font-bold text-green-600">${calculateFee().toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
                      <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>Fees can be adjusted after initial consultation</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Briefcase className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                    <p>Select a service type to see the fee breakdown</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </>
  )
}

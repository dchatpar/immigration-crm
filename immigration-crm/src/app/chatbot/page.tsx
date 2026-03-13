'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Send, User, Bot, CheckCircle, Loader2 } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface IntakeData {
  name: string
  email: string
  phone: string
  serviceType: string
  caseDetails: string
}

const SERVICE_TYPES = [
  { id: 'WORK_PERMIT', name: 'Work Permit', description: 'Apply for a work permit' },
  { id: 'VISA_APPLICATION', name: 'Visa Application', description: 'Tourist, student, or work visa' },
  { id: 'GREEN_CARD', name: 'Green Card', description: 'Permanent residency' },
  { id: 'CITIZENSHIP', name: 'Citizenship', description: 'Naturalization process' },
  { id: 'DEPORTATION_DEFENSE', name: 'Deportation Defense', description: 'Defense against removal' },
  { id: 'ASYLUM', name: 'Asylum', description: 'Asylum or refugee status' },
  { id: 'OTHER', name: 'Other', description: 'Other immigration matter' },
]

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [intakeStep, setIntakeStep] = useState<'name' | 'email' | 'phone' | 'serviceType' | 'caseDetails' | 'complete'>('name')
  const [intakeData, setIntakeData] = useState<IntakeData>({
    name: '',
    email: '',
    phone: '',
    serviceType: '',
    caseDetails: '',
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        role: 'assistant',
        content: 'Welcome! I\'m your immigration assistant. I\'ll help you get started with your immigration case. Let\'s start with your name - what is your full name?',
        timestamp: new Date(),
      }
      setMessages([welcomeMessage])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const addMessage = (role: 'user' | 'assistant', content: string) => {
    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      role,
      content,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, newMessage])
  }

  const processIntake = async (userInput: string) => {
    const updatedData = { ...intakeData }

    switch (intakeStep) {
      case 'name':
        updatedData.name = userInput
        setIntakeData(updatedData)
        setIntakeStep('email')
        addMessage('assistant', `Great, ${userInput}! Now, what is your email address?`)
        break
      case 'email':
        if (!userInput.includes('@')) {
          addMessage('assistant', 'Please enter a valid email address.')
          return
        }
        updatedData.email = userInput
        setIntakeData(updatedData)
        setIntakeStep('phone')
        addMessage('assistant', 'Got it! What is your phone number?')
        break
      case 'phone':
        updatedData.phone = userInput
        setIntakeData(updatedData)
        setIntakeStep('serviceType')
        addMessage('assistant', 'Thank you! What type of immigration service are you interested in?')
        break
      case 'serviceType':
        const matchedService = SERVICE_TYPES.find(
          s => s.name.toLowerCase() === userInput.toLowerCase() || s.id === userInput.toUpperCase()
        )
        if (matchedService) {
          updatedData.serviceType = matchedService.id
          setIntakeData(updatedData)
          setIntakeStep('caseDetails')
          addMessage('assistant', `Great! You\'re interested in ${matchedService.name}. Please share any additional details about your situation or questions you have.`)
        } else {
          const serviceOptions = SERVICE_TYPES.map(s => s.name).join(', ')
          addMessage('assistant', `Please select one of these options: ${serviceOptions}`)
        }
        break
      case 'caseDetails':
        updatedData.caseDetails = userInput
        setIntakeData(updatedData)
        setIntakeStep('complete')
        await createLead(updatedData)
        break
    }
  }

  const createLead = async (data: IntakeData) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: data.name.split(' ')[0],
          lastName: data.name.split(' ').slice(1).join(' ') || '',
          email: data.email,
          phone: data.phone,
          source: 'Chatbot',
          priority: 'MEDIUM',
          notes: [
            `Service Type: ${data.serviceType}`,
            `Case Details: ${data.caseDetails}`,
          ],
        }),
      })

      if (response.ok) {
        addMessage('assistant', `Thank you for providing your information, ${data.name}! We've received your inquiry about ${data.serviceType.replace(/_/g, ' ').toLowerCase()}. Our team will review your details and contact you at ${data.email} or ${data.phone} shortly. Is there anything else I can help you with?`)
      } else {
        addMessage('assistant', 'Thank you for your information! However, there was an issue submitting your inquiry. Please try again or contact us directly.')
      }
    } catch (error) {
      console.error('Error creating lead:', error)
      addMessage('assistant', 'Thank you for your information! Our team will be in touch with you soon.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userInput = input.trim()
    setInput('')
    addMessage('user', userInput)

    if (intakeStep !== 'complete') {
      await processIntake(userInput)
    } else {
      addMessage('assistant', 'Thank you for your message. Our team will get back to you shortly. Is there anything else I can help you with?')
    }
  }

  const renderServiceOptions = () => {
    if (intakeStep === 'serviceType') {
      return (
        <div className="mt-2 space-y-1">
          {SERVICE_TYPES.map(service => (
            <div key={service.id} className="text-sm text-gray-600">
              • {service.name}: {service.description}
            </div>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900">Immigration Assistant</h1>
        <p className="text-gray-600">Get help with your immigration case</p>
      </header>

      <div className="flex-1 max-w-3xl w-full mx-auto p-4">
        <Card className="h-[calc(100vh-200px)] flex flex-col">
          <CardHeader className="border-b border-gray-200">
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-blue-600" />
              Chat Assistant
            </CardTitle>
          </CardHeader>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'assistant' && (
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Bot className="h-5 w-5 text-blue-600" />
                  </div>
                )}
                <div
                  className={`max-w-[70%] rounded-lg px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  {message.role === 'assistant' && renderServiceOptions()}
                </div>
                {message.role === 'user' && (
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-gray-600" />
                  </div>
                )}
              </div>
            ))}
            
            {intakeStep === 'complete' && (
              <div className="flex justify-center">
                <div className="flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">Information Submitted</span>
                </div>
              </div>
            )}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-gray-600">Processing...</span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          <CardContent className="border-t border-gray-200 p-4">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                type="text"
                placeholder={
                  intakeStep === 'complete'
                    ? 'Ask another question...'
                    : intakeStep === 'serviceType'
                    ? 'Type service name (e.g., Work Permit)'
                    : `Enter your ${intakeStep}...`
                }
                value={input}
                onChange={e => setInput(e.target.value)}
                disabled={isLoading}
                className="flex-1"
              />
              <Button type="submit" disabled={isLoading || !input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export interface ClientData {
  firstName: string
  lastName: string
  email: string
  phone: string
  currentStatus: string
  immigrationHistory: ImmigrationHistory[]
  countryOfOrigin: string
  currentCountry: string
  dateOfBirth?: string
  maritalStatus?: string
}

export interface ImmigrationHistory {
  type: string
  status: string
  startDate: string
  endDate?: string
  country: string
  notes?: string
}

export interface EligibilityResult {
  eligible: boolean
  serviceType: string
  confidence: number
  requirements: string[]
  recommendations: ServiceRecommendation[]
  reminders: Reminder[]
}

export interface ServiceRecommendation {
  serviceType: string
  reason: string
  priority: 'high' | 'medium' | 'low'
  estimatedTimeline: string
}

export interface Reminder {
  id: string
  title: string
  description: string
  dueDate: Date
  type: 'document' | 'action' | 'deadline' | 'followup'
}

const SERVICE_ELIGIBILITY = {
  WORK_PERMIT: {
    eligibleStatuses: ['VISITOR', 'STUDENT', 'OPEN_WORK_PERMIT_HOLDER'],
    ineligibleStatuses: ['WORK_PERMIT_HOLDER', 'PR', 'CITIZEN'],
    requiredDocuments: ['Passport', 'Job Offer', 'LMIA (if required)', 'Education Credentials'],
  },
  VISA_APPLICATION: {
    eligibleStatuses: ['VISITOR', 'STUDENT', 'WORK_PERMIT_HOLDER'],
    ineligibleStatuses: ['PR', 'CITIZEN'],
    requiredDocuments: ['Passport', 'Proof of Funds', 'Travel History', 'Ties to Home Country'],
  },
  GREEN_CARD: {
    eligibleStatuses: ['WORK_PERMIT_HOLDER', 'ASYLEE', 'REFUGEE'],
    ineligibleStatuses: ['PR', 'CITIZEN'],
    requiredDocuments: ['I-485 Form', 'Medical Exam', 'Birth Certificate', 'Passport', 'Photo ID'],
  },
  CITIZENSHIP: {
    eligibleStatuses: ['PR'],
    ineligibleStatuses: ['CITIZEN'],
    requiredDocuments: ['N-400 Form', 'Proof of Physical Presence', 'Tax Returns', 'English Test Results'],
    minPRYears: 3,
  },
  DEPORTATION_DEFENSE: {
    eligibleStatuses: ['DETAINEE', 'IN_REMOVAL_PROCEEDINGS'],
    ineligibleStatuses: ['PR', 'CITIZEN'],
    requiredDocuments: ['Notice to Appear', 'Immigration Documents', 'Evidence of Ties'],
  },
  ASYLUM: {
    eligibleStatuses: ['VISITOR', 'STUDENT', 'WORK_PERMIT_HOLDER', 'UNDOCUMENTED'],
    ineligibleStatuses: ['PR', 'CITIZEN', 'REFUGEE'],
    requiredDocuments: ['I-589 Form', 'Personal Statement', 'Country Conditions Evidence', 'Affidavits'],
  },
  EXPRESS_ENTRY: {
    eligibleStatuses: ['VISITOR', 'WORK_PERMIT_HOLDER', 'STUDENT'],
    ineligibleStatuses: ['PR', 'CITIZEN'],
    requiredDocuments: ['Language Test Results', 'Education Credential Assessment', 'Work Experience Proof'],
    minCLBScore: 67,
  },
  SPOUSE_SPONSORSHIP: {
    eligibleStatuses: ['PR', 'CITIZEN'],
    ineligibleStatuses: ['VISITOR', 'STUDENT', 'WORK_PERMIT_HOLDER'],
    requiredDocuments: ['Marriage Certificate', 'Proof of Relationship', 'Sponsor Financial Documents'],
  },
}

export function checkEligibility(clientData: ClientData): EligibilityResult {
  const { currentStatus, immigrationHistory, countryOfOrigin } = clientData

  const results: EligibilityResult[] = []

  for (const [serviceType, criteria] of Object.entries(SERVICE_ELIGIBILITY)) {
    const isEligible = criteria.eligibleStatuses.includes(currentStatus)
    const isIneligible = criteria.ineligibleStatuses.includes(currentStatus)

    if (!isIneligible) {
      let confidence = 50
      const requirements = [...criteria.requiredDocuments]

      if (isEligible) {
        confidence = 85

        if (serviceType === 'CITIZENSHIP') {
          const prHistory = immigrationHistory.find(h => h.type === 'GREEN_CARD' || h.type === 'PR')
          if (prHistory) {
            const yearsAsPR = calculateYearsSince(prHistory.startDate)
            if (yearsAsPR >= (criteria.minPRYears || 3)) {
              confidence = 95
            } else {
              confidence = 60
              requirements.push(`Need ${(criteria.minPRYears || 3) - yearsAsPR} more years as PR`)
            }
          }
        }

        if (serviceType === 'WORK_PERMIT') {
          const hasValidWorkPermit = immigrationHistory.some(
            h => (h.type === 'WORK_PERMIT' || h.type === 'OPEN_WORK_PERMIT') && h.status === 'ACTIVE'
          )
          if (!hasValidWorkPermit) {
            confidence = 70
          }
        }
      }

      results.push({
        eligible: isEligible,
        serviceType,
        confidence,
        requirements,
        recommendations: [],
        reminders: [],
      })
    }
  }

  const bestMatch = results.sort((a, b) => b.confidence - a.confidence)[0] || {
    eligible: false,
    serviceType: 'CONSULTATION_NEEDED',
    confidence: 0,
    requirements: ['Schedule a consultation to discuss options'],
    recommendations: [],
    reminders: [],
  }

  const recommendations = generateServiceRecommendations(clientData)
  const reminders = generateReminders(clientData, bestMatch)

  return {
    ...bestMatch,
    recommendations,
    reminders,
  }
}

function calculateYearsSince(dateString: string): number {
  const startDate = new Date(dateString)
  const now = new Date()
  return Math.floor((now.getTime() - startDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000))
}

function generateServiceRecommendations(clientData: ClientData): ServiceRecommendation[] {
  const recommendations: ServiceRecommendation[] = []
  const { currentStatus, immigrationHistory } = clientData

  const hasWorkPermit = immigrationHistory.some(h => h.type === 'WORK_PERMIT' && h.status === 'ACTIVE')
  const hasPR = immigrationHistory.some(h => h.type === 'PR' || h.type === 'GREEN_CARD')
  const hasStudyPermit = immigrationHistory.some(h => h.type === 'STUDENT' && h.status === 'ACTIVE')

  if (hasWorkPermit && currentStatus === 'WORK_PERMIT_HOLDER') {
    recommendations.push({
      serviceType: 'EXPRESS_ENTRY',
      reason: 'You may be eligible for Express Entry based on your work experience',
      priority: 'high',
      estimatedTimeline: '6-12 months',
    })
  }

  if (hasPR && currentStatus === 'PR') {
    recommendations.push({
      serviceType: 'CITIZENSHIP',
      reason: 'You may be eligible to apply for citizenship after meeting residency requirements',
      priority: 'medium',
      estimatedTimeline: '12-18 months',
    })
  }

  if (hasStudyPermit && currentStatus === 'STUDENT') {
    recommendations.push({
      serviceType: 'WORK_PERMIT',
      reason: 'Post-graduation work permit may be available after completing studies',
      priority: 'high',
      estimatedTimeline: '3-6 months',
    })
  }

  if (!hasWorkPermit && !hasPR && !hasStudyPermit) {
    recommendations.push({
      serviceType: 'VISA_APPLICATION',
      reason: 'Multiple visa options may be available based on your situation',
      priority: 'high',
      estimatedTimeline: '2-6 months',
    })
  }

  return recommendations
}

function generateReminders(clientData: ClientData, eligibility: EligibilityResult): Reminder[] {
  const reminders: Reminder[] = []
  const now = new Date()

  for (const history of clientData.immigrationHistory) {
    if (history.type === 'WORK_PERMIT' && history.status === 'ACTIVE') {
      const endDate = history.endDate ? new Date(history.endDate) : null
      if (endDate) {
        const daysUntilExpiry = Math.floor((endDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000))
        
        if (daysUntilExpiry > 0 && daysUntilExpiry <= 90) {
          reminders.push({
            id: `reminder_wp_${history.type}`,
            title: 'Work Permit Expiring Soon',
            description: `Your work permit expires in ${daysUntilExpiry} days. Consider applying for extension or new permit.`,
            dueDate: endDate,
            type: 'deadline',
          })
        }

        if (daysUntilExpiry <= 0) {
          reminders.push({
            id: `reminder_wp_expired_${history.type}`,
            title: 'Work Permit Expired',
            description: 'Your work permit has expired. Take immediate action to maintain status.',
            dueDate: now,
            type: 'action',
          })
        }
      }
    }

    if (history.type === 'STUDENT' && history.status === 'ACTIVE') {
      const endDate = history.endDate ? new Date(history.endDate) : null
      if (endDate) {
        const daysUntilExpiry = Math.floor((endDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000))
        
        if (daysUntilExpiry > 0 && daysUntilExpiry <= 120) {
          reminders.push({
            id: `reminder_study_${history.type}`,
            title: 'Study Permit Expiring',
            description: `Your study permit expires in ${daysUntilExpiry} days. Plan for post-graduation options.`,
            dueDate: endDate,
            type: 'deadline',
          })
        }
      }
    }
  }

  if (eligibility.serviceType === 'EXPRESS_ENTRY' || eligibility.serviceType === 'GREEN_CARD') {
    reminders.push({
      id: `reminder_docs_${eligibility.serviceType}`,
      title: 'Gather Required Documents',
      description: `Start gathering documents for ${eligibility.serviceType} application: ${eligibility.requirements.join(', ')}`,
      dueDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
      type: 'document',
    })
  }

  reminders.push({
    id: 'followup_consultation',
    title: 'Follow-up Consultation',
    description: 'Schedule a follow-up consultation to review your case progress.',
    dueDate: new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000),
    type: 'followup',
  })

  return reminders.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
}

export function getServiceTypes(): Array<{ id: string; name: string; description: string }> {
  return [
    { id: 'WORK_PERMIT', name: 'Work Permit', description: 'Apply for or renew a work permit' },
    { id: 'VISA_APPLICATION', name: 'Visa Application', description: 'Tourist, student, or work visa' },
    { id: 'GREEN_CARD', name: 'Green Card', description: 'Permanent residency application' },
    { id: 'CITIZENSHIP', name: 'Citizenship', description: 'Naturalization and citizenship' },
    { id: 'DEPORTATION_DEFENSE', name: 'Deportation Defense', description: 'Defense against removal proceedings' },
    { id: 'ASYLUM', name: 'Asylum', description: 'Asylum or refugee status application' },
    { id: 'EXPRESS_ENTRY', name: 'Express Entry', description: 'Federal skilled worker program' },
    { id: 'SPOUSE_SPONSORSHIP', name: 'Spouse Sponsorship', description: 'Family sponsorship for spouse/partner' },
  ]
}

export function getCommonEligibilityReasons(): Record<string, string[]> {
  return {
    WORK_PERMIT: [
      'Valid job offer from Canadian employer',
      'LMIA approval (if required)',
      'Proof of qualifications',
    ],
    VISA_APPLICATION: [
      'Proof of financial support',
      'Ties to home country',
      'Clean travel history',
    ],
    GREEN_CARD: [
      'Employment-based petition',
      'Family-based petition',
      'Asylum or refugee status',
    ],
    CITIZENSHIP: [
      'Physical presence requirements met',
      'Good moral character',
      'English/French language proficiency',
    ],
  }
}

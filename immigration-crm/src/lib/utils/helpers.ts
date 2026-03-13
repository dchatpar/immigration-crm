/**
 * Utility Functions for Immigration CRM
 */

/**
 * Generate unique case number
 * Format: IMM-YYYY-XXXXX
 */
export function generateCaseNumber(): string {
    const year = new Date().getFullYear()
    const random = Math.floor(10000 + Math.random() * 90000)
    return `IMM-${year}-${random}`
}

/**
 * Format phone number to E.164 format
 */
export function formatPhoneNumber(phone: string): string {
    // Remove all non-numeric characters
    const cleaned = phone.replace(/\D/g, '')

    // Add +1 for US numbers if not present
    if (cleaned.length === 10) {
        return `+1${cleaned}`
    }

    if (cleaned.length === 11 && cleaned.startsWith('1')) {
        return `+${cleaned}`
    }

    // Return as-is if already formatted
    if (phone.startsWith('+')) {
        return phone
    }

    return `+${cleaned}`
}

/**
 * Calculate days between two dates
 */
export function daysBetween(date1: Date, date2: Date): number {
    const oneDay = 24 * 60 * 60 * 1000
    return Math.round(Math.abs((date1.getTime() - date2.getTime()) / oneDay))
}

/**
 * Check if passport is expiring soon (within 6 months)
 */
export function isPassportExpiringSoon(expiryDate: Date): boolean {
    const sixMonthsFromNow = new Date()
    sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6)
    return expiryDate <= sixMonthsFromNow && expiryDate >= new Date()
}

/**
 * Get status color for UI
 */
export function getStatusColor(status: string): string {
    const colors: Record<string, string> = {
        INITIATED: 'blue',
        DOCUMENTS_PENDING: 'yellow',
        UNDER_REVIEW: 'purple',
        DOCUMENTS_APPROVED: 'green',
        APPLICATION_PREPARED: 'indigo',
        APPLICATION_SUBMITTED: 'indigo',
        IN_PROGRESS: 'orange',
        ADDITIONAL_INFO_REQUIRED: 'red',
        APPROVED: 'green',
        REJECTED: 'red',
        COMPLETED: 'gray',
        CANCELLED: 'gray',
    }
    return colors[status] || 'gray'
}

/**
 * Get priority color for UI
 */
export function getPriorityColor(priority: string): string {
    const colors: Record<string, string> = {
        LOW: 'gray',
        MEDIUM: 'blue',
        HIGH: 'orange',
        URGENT: 'red',
    }
    return colors[priority] || 'gray'
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Sanitize filename
 */
export function sanitizeFilename(filename: string): string {
    return filename.replace(/[^a-zA-Z0-9.-]/g, '_')
}

/**
 * Generate random token
 */
export function generateToken(length: number = 32): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let token = ''
    for (let i = 0; i < length; i++) {
        token += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return token
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

/**
 * Validate phone format
 */
export function isValidPhone(phone: string): boolean {
    const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/
    return phoneRegex.test(phone)
}

/**
 * Calculate case processing time
 */
export function calculateProcessingTime(startDate: Date, endDate: Date): {
    days: number
    weeks: number
    months: number
} {
    const days = daysBetween(startDate, endDate)
    const weeks = Math.floor(days / 7)
    const months = Math.floor(days / 30)

    return { days, weeks, months }
}

/**
 * Get next business day
 */
export function getNextBusinessDay(date: Date = new Date()): Date {
    const nextDay = new Date(date)
    nextDay.setDate(nextDay.getDate() + 1)

    // Skip weekends
    while (nextDay.getDay() === 0 || nextDay.getDay() === 6) {
        nextDay.setDate(nextDay.getDate() + 1)
    }

    return nextDay
}

/**
 * Format currency
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
    }).format(amount)
}

/**
 * Truncate text
 */
export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
}

/**
 * Get initials from name
 */
export function getInitials(firstName: string, lastName: string): string {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

/**
 * Parse recurrence rule
 */
export function parseRecurrenceRule(rule: string): {
    frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY'
    interval: number
} {
    // Simple implementation - can be extended
    const frequency = rule.toUpperCase() as 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY'
    return {
        frequency,
        interval: 1,
    }
}

/**
 * Calculate next recurrence date
 */
export function getNextRecurrenceDate(
    lastDate: Date,
    frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY'
): Date {
    const nextDate = new Date(lastDate)

    switch (frequency) {
        case 'DAILY':
            nextDate.setDate(nextDate.getDate() + 1)
            break
        case 'WEEKLY':
            nextDate.setDate(nextDate.getDate() + 7)
            break
        case 'MONTHLY':
            nextDate.setMonth(nextDate.getMonth() + 1)
            break
        case 'YEARLY':
            nextDate.setFullYear(nextDate.getFullYear() + 1)
            break
    }

    return nextDate
}

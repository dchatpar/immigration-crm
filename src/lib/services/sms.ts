import twilio from 'twilio'

/**
 * SMS Service using Twilio
 * Handles all SMS communications
 */

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const fromPhone = process.env.TWILIO_PHONE_NUMBER

let client: ReturnType<typeof twilio> | null = null

if (accountSid && authToken) {
    client = twilio(accountSid, authToken)
}

export interface SMSOptions {
    to: string
    body: string
}

export async function sendSMS(options: SMSOptions): Promise<boolean> {
    try {
        if (!client || !fromPhone) {
            console.warn('Twilio not configured, SMS not sent')
            return false
        }

        await client.messages.create({
            body: options.body,
            from: fromPhone,
            to: options.to,
        })

        console.log(`SMS sent to ${options.to}`)
        return true
    } catch (error) {
        console.error('Error sending SMS:', error)
        return false
    }
}

export async function sendAppointmentReminderSMS(
    to: string,
    appointmentTitle: string,
    appointmentDate: Date
): Promise<boolean> {
    const body = `Reminder: You have an appointment "${appointmentTitle}" scheduled for ${appointmentDate.toLocaleDateString()} at ${appointmentDate.toLocaleTimeString()}. Please contact us if you need to reschedule.`

    return sendSMS({ to, body })
}

export async function sendDocumentRequestSMS(
    to: string,
    caseNumber: string
): Promise<boolean> {
    const body = `Document request for case ${caseNumber}. Please check your email for details or contact us.`

    return sendSMS({ to, body })
}

export async function sendStatusUpdateSMS(
    to: string,
    caseNumber: string,
    newStatus: string
): Promise<boolean> {
    const body = `Case ${caseNumber} status updated to: ${newStatus.replace(/_/g, ' ')}. Check your email for details.`

    return sendSMS({ to, body })
}

export async function sendReminderSMS(
    to: string,
    reminderTitle: string
): Promise<boolean> {
    const body = `Reminder: ${reminderTitle}. Please contact us if you have any questions.`

    return sendSMS({ to, body })
}

export async function sendWelcomeSMS(
    to: string,
    caseNumber: string
): Promise<boolean> {
    const body = `Welcome! Your immigration case ${caseNumber} has been created. We'll keep you updated on your progress.`

    return sendSMS({ to, body })
}

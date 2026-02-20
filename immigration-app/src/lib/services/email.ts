import sgMail from '@sendgrid/mail'

/**
 * Email Service using SendGrid
 * Handles all email communications
 */

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
}

export interface EmailOptions {
  to: string
  subject: string
  text?: string
  html?: string
  from?: string
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    if (!process.env.SENDGRID_API_KEY) {
      console.warn('SendGrid API key not configured, email not sent')
      return false
    }

    const msg = {
      to: options.to,
      from: options.from || process.env.SENDGRID_FROM_EMAIL || 'noreply@example.com',
      subject: options.subject,
      text: options.text,
      html: options.html || options.text,
    }

    await sgMail.send(msg as any)
    console.log(`Email sent to ${options.to}`)
    return true
  } catch (error) {
    console.error('Error sending email:', error)
    return false
  }
}

export async function sendWelcomeEmail(
  to: string,
  clientName: string,
  caseNumber: string
): Promise<boolean> {
  const subject = `Welcome to Our Immigration Services - Case ${caseNumber}`
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Welcome, ${clientName}!</h2>
      <p>Thank you for choosing our immigration services. Your case has been created successfully.</p>
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0;"><strong>Case Number:</strong> ${caseNumber}</p>
      </div>
      <p>We will keep you updated on the progress of your case. If you have any questions, please don't hesitate to contact us.</p>
      <p style="margin-top: 30px;">Best regards,<br>Immigration Services Team</p>
    </div>
  `

  return sendEmail({ to, subject, html })
}

export async function sendAppointmentConfirmation(
  to: string,
  clientName: string,
  appointmentDetails: {
    title: string
    date: Date
    duration: number
    location?: string
    meetingLink?: string
  }
): Promise<boolean> {
  const subject = `Appointment Confirmation - ${appointmentDetails.title}`
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Appointment Confirmed</h2>
      <p>Dear ${clientName},</p>
      <p>Your appointment has been scheduled successfully.</p>
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Appointment:</strong> ${appointmentDetails.title}</p>
        <p><strong>Date & Time:</strong> ${appointmentDetails.date.toLocaleString()}</p>
        <p><strong>Duration:</strong> ${appointmentDetails.duration} minutes</p>
        ${appointmentDetails.location ? `<p><strong>Location:</strong> ${appointmentDetails.location}</p>` : ''}
        ${appointmentDetails.meetingLink ? `<p><strong>Meeting Link:</strong> <a href="${appointmentDetails.meetingLink}">${appointmentDetails.meetingLink}</a></p>` : ''}
      </div>
      <p>Please arrive 10 minutes early if this is an in-person appointment.</p>
      <p style="margin-top: 30px;">Best regards,<br>Immigration Services Team</p>
    </div>
  `

  return sendEmail({ to, subject, html })
}

export async function sendDocumentRequestEmail(
  to: string,
  clientName: string,
  caseNumber: string,
  documents: string[]
): Promise<boolean> {
  const subject = `Document Request - Case ${caseNumber}`
  const documentList = documents.map(doc => `<li>${doc}</li>`).join('')
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Documents Required</h2>
      <p>Dear ${clientName},</p>
      <p>We need the following documents to proceed with your case (${caseNumber}):</p>
      <ul style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        ${documentList}
      </ul>
      <p>Please upload these documents through your secure portal or contact us to arrange document submission.</p>
      <p style="margin-top: 30px;">Best regards,<br>Immigration Services Team</p>
    </div>
  `

  return sendEmail({ to, subject, html })
}

export async function sendStatusUpdateEmail(
  to: string,
  clientName: string,
  caseNumber: string,
  newStatus: string,
  summary: string,
  details?: string
): Promise<boolean> {
  const subject = `Case Status Update - ${caseNumber}`
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Case Status Update</h2>
      <p>Dear ${clientName},</p>
      <p>Your case status has been updated.</p>
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Case Number:</strong> ${caseNumber}</p>
        <p><strong>New Status:</strong> ${newStatus.replace(/_/g, ' ')}</p>
        <p><strong>Summary:</strong> ${summary}</p>
        ${details ? `<p style="margin-top: 10px;">${details}</p>` : ''}
      </div>
      <p>We will continue to keep you updated on your case progress.</p>
      <p style="margin-top: 30px;">Best regards,<br>Immigration Services Team</p>
    </div>
  `

  return sendEmail({ to, subject, html })
}

export async function sendReminderEmail(
  to: string,
  clientName: string,
  reminderTitle: string,
  reminderDescription?: string
): Promise<boolean> {
  const subject = `Reminder: ${reminderTitle}`
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #f59e0b;">Reminder</h2>
      <p>Dear ${clientName},</p>
      <p>This is a reminder regarding your immigration case:</p>
      <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
        <p style="margin: 0; font-weight: bold;">${reminderTitle}</p>
        ${reminderDescription ? `<p style="margin-top: 10px;">${reminderDescription}</p>` : ''}
      </div>
      <p>If you have any questions, please contact us.</p>
      <p style="margin-top: 30px;">Best regards,<br>Immigration Services Team</p>
    </div>
  `

  return sendEmail({ to, subject, html })
}

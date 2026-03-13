export const appConfig = {
  name: process.env.APP_NAME || 'Immigration CRM',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  environment: process.env.NODE_ENV || 'development',
}

export const sendgridConfig = {
  apiKey: process.env.SENDGRID_API_KEY || '',
  fromEmail: process.env.SENDGRID_FROM_EMAIL || 'noreply@example.com',
}

export const twilioConfig = {
  accountSid: process.env.TWILIO_ACCOUNT_SID || '',
  authToken: process.env.TWILIO_AUTH_TOKEN || '',
  phoneNumber: process.env.TWILIO_PHONE_NUMBER || '',
}

export const stripeConfig = {
  secretKey: process.env.STRIPE_SECRET_KEY || '',
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
}

export const docusignConfig = {
  integrationKey: process.env.DOCUSIGN_INTEGRATION_KEY || '',
  secretKey: process.env.DOCUSIGN_SECRET_KEY || '',
  accountId: process.env.DOCUSIGN_ACCOUNT_ID || '',
  basePath: process.env.DOCUSIGN_BASE_PATH || '',
}

export const googleConfig = {
  clientId: process.env.GOOGLE_CLIENT_ID || '',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  redirectUri: process.env.NEXT_PUBLIC_APP_URL 
    ? `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/google`
    : 'http://localhost:3000/api/auth/callback/google',
}

export const openaiConfig = {
  apiKey: process.env.OPENAI_API_KEY || '',
  model: process.env.OPENAI_MODEL || 'gpt-4',
}

export const convexConfig = {
  deployment: process.env.CONVEX_DEPLOYMENT || '',
  url: process.env.NEXT_PUBLIC_CONVEX_URL || '',
}

export function isSendgridConfigured(): boolean {
  return !!sendgridConfig.apiKey
}

export function isTwilioConfigured(): boolean {
  return !!(twilioConfig.accountSid && twilioConfig.authToken && twilioConfig.phoneNumber)
}

export function isStripeConfigured(): boolean {
  return !!stripeConfig.secretKey
}

export function isDocusignConfigured(): boolean {
  return !!(docusignConfig.integrationKey && docusignConfig.secretKey && docusignConfig.accountId)
}

export function isGoogleConfigured(): boolean {
  return !!(googleConfig.clientId && googleConfig.clientSecret)
}

export function isOpenaiConfigured(): boolean {
  return !!openaiConfig.apiKey
}

export function isConvexConfigured(): boolean {
  return !!(convexConfig.deployment && convexConfig.url)
}

export function isProduction(): boolean {
  return appConfig.environment === 'production'
}

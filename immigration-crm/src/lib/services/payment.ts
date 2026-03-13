import Stripe from 'stripe'
import { stripeConfig, isStripeConfigured } from '../config/env'

let stripe: Stripe | null = null

if (isStripeConfigured()) {
  stripe = new Stripe(stripeConfig.secretKey, {
    apiVersion: '2023-10-16',
  })
}

export interface CreateCheckoutSessionParams {
  caseId: string
  caseNumber: string
  clientEmail: string
  clientName: string
  amount: number
  description: string
  successUrl: string
  cancelUrl: string
}

export interface CreatePaymentIntentParams {
  amount: number
  currency?: string
  metadata?: Record<string, string>
}

export async function createCheckoutSession(params: CreateCheckoutSessionParams): Promise<{
  sessionId: string
  url: string
} | null> {
  if (!stripe) {
    console.warn('Stripe not configured, cannot create checkout session')
    return null
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: params.clientEmail,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: params.description,
              description: `Case: ${params.caseNumber}`,
            },
            unit_amount: Math.round(params.amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      metadata: {
        caseId: params.caseId,
        caseNumber: params.caseNumber,
      },
    })

    return {
      sessionId: session.id,
      url: session.url || '',
    }
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return null
  }
}

export async function createPaymentIntent(params: CreatePaymentIntentParams): Promise<{
  clientSecret: string
  paymentIntentId: string
} | null> {
  if (!stripe) {
    console.warn('Stripe not configured, cannot create payment intent')
    return null
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(params.amount * 100),
      currency: params.currency || 'usd',
      metadata: params.metadata,
    })

    return {
      clientSecret: paymentIntent.client_secret || '',
      paymentIntentId: paymentIntent.id,
    }
  } catch (error) {
    console.error('Error creating payment intent:', error)
    return null
  }
}

export async function retrievePaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent | null> {
  if (!stripe) {
    console.warn('Stripe not configured')
    return null
  }

  try {
    return await stripe.paymentIntents.retrieve(paymentIntentId)
  } catch (error) {
    console.error('Error retrieving payment intent:', error)
    return null
  }
}

export async function createRefund(paymentIntentId: string, amount?: number): Promise<{
  refundId: string
  status: string
} | null> {
  if (!stripe) {
    console.warn('Stripe not configured')
    return null
  }

  try {
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: amount ? Math.round(amount * 100) : undefined,
    })

    return {
      refundId: refund.id,
      status: refund.status || 'pending',
    }
  } catch (error) {
    console.error('Error creating refund:', error)
    return null
  }
}

export interface WebhookEvent {
  type: string
  data: {
    object: Stripe.PaymentIntent | Stripe.Checkout.Session
  }
}

export async function constructWebhookEvent(
  payload: string | Buffer,
  signature: string
): Promise<WebhookEvent | null> {
  if (!stripe || !stripeConfig.webhookSecret) {
    console.warn('Stripe not configured for webhook handling')
    return null
  }

  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      stripeConfig.webhookSecret
    )
    return event as unknown as WebhookEvent
  } catch (error) {
    console.error('Error constructing webhook event:', error)
    return null
  }
}

export function handleWebhookEvent(event: WebhookEvent): void {
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      console.log('Checkout completed:', session.id)
      console.log('Metadata:', session.metadata)
      break
    }
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      console.log('Payment succeeded:', paymentIntent.id)
      console.log('Metadata:', paymentIntent.metadata)
      break
    }
    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      console.log('Payment failed:', paymentIntent.id)
      console.log('Error:', paymentIntent.last_payment_error?.message)
      break
    }
    default:
      console.log('Unhandled event type:', event.type)
  }
}

export function getStripePublishableKey(): string {
  return stripeConfig.publishableKey
}

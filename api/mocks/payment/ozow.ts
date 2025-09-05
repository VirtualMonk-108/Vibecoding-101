import { NextApiRequest, NextApiResponse } from 'next'

interface OzowInitiateRequest {
  amount: number
  bankReference: string
  cancelUrl?: string
  errorUrl?: string
  successUrl?: string
  notifyUrl?: string
  isTest: boolean
  customer?: {
    countryCode?: string
    mobile?: string
  }
}

interface OzowResponse {
  transactionId: string
  paymentLink: string
  status: 'PendingPayment' | 'Complete' | 'Error' | 'Cancelled' | 'Abandoned'
  amount?: number
  currency?: string
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req

  if (method === 'POST') {
    return handleInitiatePayment(req, res)
  } else if (method === 'GET') {
    return handlePaymentStatus(req, res)
  } else {
    res.setHeader('Allow', ['POST', 'GET'])
    res.status(405).json({ error: 'Method not allowed' })
  }
}

function handleInitiatePayment(req: NextApiRequest, res: NextApiResponse) {
  const data: OzowInitiateRequest = req.body

  // Validate required fields
  if (!data.amount || !data.bankReference) {
    return res.status(400).json({
      error: 'Missing required fields: amount, bankReference'
    })
  }

  // Generate mock transaction ID
  const transactionId = `OZOW_MOCK_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  // Mock response
  const response: OzowResponse = {
    transactionId,
    paymentLink: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/mock/payment/ozow?id=${transactionId}`,
    status: 'PendingPayment',
    amount: data.amount,
    currency: 'ZAR'
  }

  // Store payment in memory
  global.mockOzowPayments = global.mockOzowPayments || {}
  global.mockOzowPayments[transactionId] = {
    ...data,
    ...response,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }

  res.status(200).json(response)
}

function handlePaymentStatus(req: NextApiRequest, res: NextApiResponse) {
  const { transaction_id } = req.query

  if (!transaction_id) {
    return res.status(400).json({ error: 'Transaction ID required' })
  }

  global.mockOzowPayments = global.mockOzowPayments || {}
  const payment = global.mockOzowPayments[transaction_id as string]

  if (!payment) {
    return res.status(404).json({ error: 'Payment not found' })
  }

  // Simulate payment progression
  const now = new Date()
  const created = new Date(payment.created_at)
  const secondsElapsed = (now.getTime() - created.getTime()) / 1000

  if (payment.status === 'PendingPayment') {
    if (secondsElapsed > 30 && Math.random() > 0.2) {
      payment.status = 'Complete'
      payment.updated_at = new Date().toISOString()
    } else if (secondsElapsed > 60 && Math.random() > 0.8) {
      payment.status = 'Cancelled'
      payment.updated_at = new Date().toISOString()
    }
  }

  res.status(200).json({
    transactionId: payment.transactionId,
    status: payment.status,
    amount: payment.amount,
    currency: payment.currency,
    bankReference: payment.bankReference,
    created_at: payment.created_at,
    updated_at: payment.updated_at
  })
}
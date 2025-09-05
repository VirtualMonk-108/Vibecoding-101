import { NextApiRequest, NextApiResponse } from 'next'

interface PayFastInitiateRequest {
  merchant_id: string
  amount: number // in cents
  item_name: string
  return_url: string
  cancel_url: string
  notify_url?: string
  name_first?: string
  name_last?: string
  email_address?: string
}

interface PayFastResponse {
  payment_id: string
  payment_url: string
  status: 'pending' | 'completed' | 'failed' | 'cancelled'
  amount?: number
  currency?: string
}

// Mock PayFast API endpoints
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
  const data: PayFastInitiateRequest = req.body

  // Validate required fields
  if (!data.merchant_id || !data.amount || !data.item_name) {
    return res.status(400).json({
      error: 'Missing required fields: merchant_id, amount, item_name'
    })
  }

  // Generate mock payment ID
  const paymentId = `MOCK_PAY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  // Mock response
  const response: PayFastResponse = {
    payment_id: paymentId,
    payment_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/mock/payment/payfast?id=${paymentId}`,
    status: 'pending',
    amount: data.amount,
    currency: 'ZAR'
  }

  // Store payment in memory (in production, this would be in a database)
  global.mockPayments = global.mockPayments || {}
  global.mockPayments[paymentId] = {
    ...data,
    ...response,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }

  res.status(200).json(response)
}

function handlePaymentStatus(req: NextApiRequest, res: NextApiResponse) {
  const { payment_id } = req.query

  if (!payment_id) {
    return res.status(400).json({ error: 'Payment ID required' })
  }

  global.mockPayments = global.mockPayments || {}
  const payment = global.mockPayments[payment_id as string]

  if (!payment) {
    return res.status(404).json({ error: 'Payment not found' })
  }

  // Randomly simulate payment completion for demo
  if (payment.status === 'pending' && Math.random() > 0.3) {
    payment.status = 'completed'
    payment.updated_at = new Date().toISOString()
  }

  res.status(200).json({
    payment_id: payment.payment_id,
    status: payment.status,
    amount: payment.amount,
    currency: payment.currency,
    item_name: payment.item_name,
    created_at: payment.created_at,
    updated_at: payment.updated_at
  })
}
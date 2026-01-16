import { describe, it, expect, beforeEach, vi, mock } from 'bun:test'
import { sendEmail, transporter } from '../../utils/email'

// Mock nodemailer
vi.mock('nodemailer', () => ({
  createTransport: vi.fn(() => ({
    sendMail: vi.fn()
  }))
}))

describe('Email Utility', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should send email with correct parameters', async () => {
    const mockSendMail = vi.fn().mockResolvedValue({ messageId: '123' })
    ;(transporter.sendMail as any) = mockSendMail

    const emailData = {
      to: 'test@example.com',
      subject: 'Test Subject',
      text: 'Test message body'
    }

    await sendEmail(emailData)

    expect(mockSendMail).toHaveBeenCalledWith({
      from: 'Invoicerz',
      subject: 'Test Subject',
      text: 'Test message body',
      to: 'test@example.com'
    })
  })

  it('should handle email sending errors', async () => {
    const mockSendMail = vi.fn().mockRejectedValue(new Error('SMTP Error'))
    ;(transporter.sendMail as any) = mockSendMail

    const emailData = {
      to: 'test@example.com',
      subject: 'Test Subject',
      text: 'Test message'
    }

    expect(async () => {
      await sendEmail(emailData)
    }).toThrow()
  })

  it('should send email with empty text', async () => {
    const mockSendMail = vi.fn().mockResolvedValue({ messageId: '456' })
    ;(transporter.sendMail as any) = mockSendMail

    const emailData = {
      to: 'user@example.com',
      subject: 'Empty Email',
      text: ''
    }

    await sendEmail(emailData)

    expect(mockSendMail).toHaveBeenCalledWith({
      from: 'Invoicerz',
      subject: 'Empty Email',
      text: '',
      to: 'user@example.com'
    })
  })
})
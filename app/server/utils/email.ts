import nodemailer from 'nodemailer'
import type { EmailConfig } from '~/types'

export function createTransporter(config: EmailConfig) {
  return nodemailer.createTransporter({
    host: 'smtp.gmail.com', // Pode ser alterado para outros provedores
    port: 587,
    secure: false, // true para 465, false para outras portas
    auth: {
      user: config.user,
      pass: config.pass // Para Gmail, use App Password ao invés da senha normal
    },
    tls: {
      rejectUnauthorized: false
    }
  })
}
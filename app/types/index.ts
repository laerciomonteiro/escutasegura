export interface Denuncia {
  id?: string
  tipo: 'porte' | 'trafico' | 'ameaca' | 'disparos' | 'outros'
  descricao: string
  local?: string
  data?: string
  urgencia: 'baixa' | 'media' | 'alta'
  createdAt?: Date
}

export interface FormErrors {
  tipo?: string
  descricao?: string
  local?: string
  data?: string
  urgencia?: string
}

export interface ApiResponse {
  success: boolean
  message: string
  data?: any
  error?: string
}

export interface EmailConfig {
  user: string
  pass: string
  to: string
}

export interface TelegramConfig {
  botToken: string
  chatId: string
}
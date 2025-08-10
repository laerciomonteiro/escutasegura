export interface Denuncia {
  id?: string
  tipo: string
  urgencia: string
  descricao: string
  local?: string
  data?: string
  testemunhas?: boolean
  evidencias?: boolean
  contato?: string
  createdAt?: Date
}

export interface TelegramConfig {
  botToken: string
  chatId: string
}

// Interface para o objeto que será salvo no Vercel KV
export interface DenunciaKV {
  id: string
  tipo: string
  urgencia: string
  createdAt: string // Salvaremos como string ISO
}

import { z } from 'zod'
import type { Denuncia, FormErrors } from '~/types'

// Schema de validação usando Zod
export const denunciaSchema = z.object({
  tipo: z.enum(['porte', 'trafico', 'ameaca', 'disparos', 'outros'], {
    required_error: 'Selecione o tipo de denúncia',
    invalid_type_error: 'Tipo de denúncia inválido'
  }),
  descricao: z.string()
    .min(10, 'A descrição deve ter pelo menos 10 caracteres')
    .max(2000, 'A descrição não pode exceder 2000 caracteres')
    .refine(val => val.trim().length > 0, 'A descrição é obrigatória'),
  local: z.string().max(200, 'O local não pode exceder 200 caracteres').optional(),
  data: z.string().optional(),
  testemunhas: z.boolean().optional(),
  evidencias: z.boolean().optional(),
  contato: z.string()
    .max(200, 'O contato não pode exceder 200 caracteres')
    .optional(),
  urgencia: z.enum(['baixa', 'media', 'alta'], {
    required_error: 'Selecione o nível de urgência',
    invalid_type_error: 'Nível de urgência inválido'
  })
})

// Função para validar dados da denúncia
export function validateDenuncia(data: Partial<Denuncia>): { isValid: boolean; errors: FormErrors } {
  try {
    denunciaSchema.parse(data)
    return { isValid: true, errors: {} }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: FormErrors = {}
      
      error.errors.forEach((err) => {
        const field = err.path[0] as keyof FormErrors
        if (field) {
          errors[field] = err.message
        }
      })
      
      return { isValid: false, errors }
    }
    
    return { isValid: false, errors: { descricao: 'Erro de validação desconhecido' } }
  }
}

// Função para sanitizar dados (remover informações que possam identificar)
export function sanitizeDenuncia(denuncia: Denuncia): Denuncia {
  return {
    ...denuncia,
    // Remove qualquer informação que possa identificar o usuário
    contato: denuncia.contato ? sanitizeContact(denuncia.contato) : undefined,
    descricao: sanitizeText(denuncia.descricao),
    local: denuncia.local ? sanitizeText(denuncia.local) : undefined
  }
}

// Função para sanitizar texto (remove URLs, emails, telefones, etc.)
function sanitizeText(text: string): string {
  return text
    // Remove URLs
    .replace(/https?:\/\/[^\s]+/gi, '[URL_REMOVIDA]')
    // Remove emails
    .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi, '[EMAIL_REMOVIDO]')
    // Remove telefones brasileiros
    .replace(/\(?[\d\s\-\+\(\)]{10,}\)?/g, '[TELEFONE_REMOVIDO]')
    // Remove CPFs
    .replace(/\d{3}\.?\d{3}\.?\d{3}-?\d{2}/g, '[CPF_REMOVIDO]')
    .trim()
}

// Função para sanitizar contato
function sanitizeContact(contact: string): string {
  // Se for um email, mantém apenas o domínio
  if (contact.includes('@')) {
    const domain = contact.split('@')[1]
    return `***@${domain}`
  }
  
  // Se for telefone, mantém apenas os últimos 4 dígitos
  if (/\d{8,}/.test(contact)) {
    const numbers = contact.replace(/\D/g, '')
    return `****${numbers.slice(-4)}`
  }
  
  // Para outros tipos, ofusca
  if (contact.length > 4) {
    return `${contact.slice(0, 2)}***${contact.slice(-2)}`
  }
  
  return '***'
}

// Gera um ID anônimo para a denúncia
export function generateAnonymousId(): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 8)
  return `${timestamp}${random}`.toUpperCase()
}
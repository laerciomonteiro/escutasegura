import { sendTelegramMessage, buildTelegramText } from '../utils/telegram'
import { validateDenuncia, sanitizeDenuncia, generateAnonymousId } from '~/utils/validation'
import type { Denuncia } from '~/types'

export default defineEventHandler(async (event) => {
  try {
    // Verificar se é POST
    if (getMethod(event) !== 'POST') {
      throw createError({
        statusCode: 405,
        statusMessage: 'Método não permitido'
      })
    }

    // Ler dados do corpo da requisição
    const body = await readBody(event)
    
    // Validar dados
    const validation = validateDenuncia(body)
    if (!validation.isValid) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Dados inválidos',
        data: validation.errors
      })
    }

    // Sanitizar dados para proteger a privacidade
    const denunciaSanitizada: Denuncia = sanitizeDenuncia({
      ...body,
      id: generateAnonymousId(),
      createdAt: new Date()
    })

    // Configurações
    const config = useRuntimeConfig()
    
    // Enviar via Telegram (obrigatório)
    if (config.telegramBotToken && config.telegramChatId) {
      const text = buildTelegramText({
        id: denunciaSanitizada.id!,
        tipo: getTipoLabel(denunciaSanitizada.tipo),
        urgencia: getUrgencyLabel(denunciaSanitizada.urgencia),
        descricao: denunciaSanitizada.descricao,
        local: denunciaSanitizada.local,
        data: denunciaSanitizada.data,
        testemunhas: (body as any)?.testemunhas,
        evidencias: (body as any)?.evidencias,
        contato: (body as any)?.contato,
        submittedAt: denunciaSanitizada.createdAt || new Date()
      })

      await sendTelegramMessage({
        botToken: config.telegramBotToken,
        chatId: config.telegramChatId
      }, text)

      return {
        success: true,
        message: 'Denúncia enviada via Telegram com sucesso',
        id: denunciaSanitizada.id
      }
    }

    // Se faltarem variáveis do Telegram, retorna erro de configuração clara
    throw createError({
      statusCode: 500,
      statusMessage: 'Configuração ausente',
      data: 'Defina TELEGRAM_BOT_TOKEN e TELEGRAM_CHAT_ID nas variáveis de ambiente.'
    })

  } catch (error: any) {
    console.error('Erro ao processar denúncia:', error)
    
    throw createError({
      statusCode: error?.statusCode || 500,
      statusMessage: error?.statusMessage || 'Erro interno do servidor',
      data: error?.data
    })
  }
})

function getTipoLabel(tipo: string): string {
  const tipos: Record<string, string> = {
    'porte': 'Porte ilegal de arma',
    'trafico': 'Tráfico de drogas',
    'ameaca': 'Ameaças de facção',
    'disparos': 'Disparos de arma de fogo',
    'outros': 'Outros'
  }
  return tipos[tipo] || tipo
}

function getUrgencyLabel(urgencia: string): string {
  const urgencias: Record<string, string> = {
    'baixa': 'BAIXA URGÊNCIA',
    'media': 'MÉDIA URGÊNCIA', 
    'alta': 'ALTA URGÊNCIA'
  }
  return urgencias[urgencia] || urgencia
}


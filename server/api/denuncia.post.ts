import { Redis } from '@upstash/redis'
import { sendTelegramMessage, buildTelegramText } from '../utils/telegram'
import { validateDenuncia, sanitizeDenuncia, generateAnonymousId } from '~/utils/validation'
import type { Denuncia } from '~/types'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  // Inicializa o cliente Redis manualmente com as variáveis de ambiente
  const redis = new Redis({
    url: config.kvRestApiUrl,
    token: config.kvRestApiToken,
  })

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

    // Salvar no Upstash Redis
    try {
      const denunciaParaSalvar = {
        id: denunciaSanitizada.id!,
        tipo: denunciaSanitizada.tipo,
        urgencia: denunciaSanitizada.urgencia,
        createdAt: denunciaSanitizada.createdAt!.toISOString()
      }
      
      const pipeline = redis.pipeline()
      // Salva o objeto da denúncia
      pipeline.hset(`denuncia:${denunciaParaSalvar.id}`, denunciaParaSalvar)
      // Adiciona a um set ordenado para buscas por data
      pipeline.zadd('denuncias_por_data', {
        score: denunciaSanitizada.createdAt!.getTime(),
        member: `denuncia:${denunciaParaSalvar.id}`
      })
      await pipeline.exec()

    } catch (dbError) {
      console.error('Erro CRÍTICO ao salvar denúncia no Upstash Redis:', dbError)
      // Envia um alerta para o chat sobre a falha no DB
      const alertText = `🚨 *ALERTA DE SISTEMA* 🚨\n\nA denúncia com ID \`${denunciaSanitizada.id}\` foi recebida e enviada, mas *FALHOU* ao ser salva no banco de dados.\n\n*Erro:* Falha na conexão ou escrita no Redis. Verifique os logs da função e as variáveis de ambiente na Vercel.`
      await sendTelegramMessage({ botToken: config.telegramBotToken, chatId: config.telegramChatId }, alertText)
    }
    
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

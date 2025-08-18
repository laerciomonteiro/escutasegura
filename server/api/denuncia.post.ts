import { Redis } from '@upstash/redis'
import { sendTelegramMessage, buildTelegramText, sendTelegramPhoto, sendTelegramMediaGroup } from '../utils/telegram'
import { validateDenuncia } from '~/utils/validation'
import type { Denuncia } from '~/types'

// Função auxiliar para converter string para booleano
const toBoolean = (value: string | undefined) => value === 'true'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  const redis = new Redis({
    url: config.kvRestApiUrl,
    token: config.kvRestApiToken,
  })

  try {
    if (getMethod(event) !== 'POST') {
      throw createError({ statusCode: 405, statusMessage: 'Método não permitido' })
    }

    const multipart = await readMultipartFormData(event)
    
    const body: Record<string, any> = {}
    const imageFiles: { name: string, data: Buffer, type: string }[] = []

    multipart?.forEach((part) => {
      if (part.name) {
        if (part.filename && part.name === 'imagens') {
          imageFiles.push({
            name: part.filename,
            data: part.data,
            type: part.type!,
          })
        } else {
          body[part.name] = part.data.toString()
        }
      }
    })

    const denunciaData: Partial<Denuncia> = {
      tipo: body.tipo,
      descricao: body.descricao,
      local: body.local,
      data: body.data,
      urgencia: body.urgencia,
      testemunhas: toBoolean(body.testemunhas),
      evidencias: toBoolean(body.evidencias),
      contato: body.contato,
    }

    const validation = validateDenuncia(denunciaData)
    if (!validation.isValid) {
      throw createError({ statusCode: 400, statusMessage: 'Dados inválidos', data: validation.errors })
    }

    const id = `ME${Date.now().toString(36)}${Math.random().toString(36).substring(2, 6)}`.toUpperCase()
    const createdAt = new Date()

    // Objeto final da denúncia, sem sanitização
    const denunciaCompleta: Denuncia = {
      id,
      createdAt,
      tipo: denunciaData.tipo!,
      urgencia: denunciaData.urgencia!,
      descricao: denunciaData.descricao!,
      local: denunciaData.local,
      data: denunciaData.data,
    }

    try {
      const denunciaParaSalvar = {
        id: denunciaCompleta.id!,
        tipo: denunciaCompleta.tipo,
        urgencia: denunciaCompleta.urgencia,
        createdAt: denunciaCompleta.createdAt!.toISOString()
      }
      
      const pipeline = redis.pipeline()
      pipeline.hset(`denuncia:${denunciaParaSalvar.id}`, denunciaParaSalvar)
      pipeline.zadd('denuncias_por_data', {
        score: denunciaCompleta.createdAt!.getTime(),
        member: `denuncia:${denunciaParaSalvar.id}`
      })
      await pipeline.exec()
    } catch (dbError) {
      console.error('Erro CRÍTICO ao salvar denúncia no Upstash Redis:', dbError)
    }
    
    if (config.telegramBotToken && config.telegramChatId) {
      const text = buildTelegramText({
        ...denunciaCompleta,
        id: denunciaCompleta.id!,
        urgencia: getUrgencyLabel(denunciaCompleta.urgencia),
        tipo: getTipoLabel(denunciaCompleta.tipo),
        submittedAt: denunciaCompleta.createdAt
      })
      const telegramConfig = { botToken: config.telegramBotToken, chatId: config.telegramChatId }

      if (imageFiles.length > 1) {
        // Para múltiplas fotos, envia o texto primeiro
        await sendTelegramMessage(telegramConfig, text)
        // E depois o grupo de mídias
        await sendTelegramMediaGroup(telegramConfig, denunciaCompleta.id!, imageFiles)
      } else if (imageFiles.length === 1) {
        // Para foto única, mantém o comportamento original
        await sendTelegramPhoto(telegramConfig, text, imageFiles[0])
      } else {
        // Sem fotos, apenas a mensagem de texto
        await sendTelegramMessage(telegramConfig, text)
      }

      return { success: true, message: 'Denúncia enviada com sucesso', id: denunciaCompleta.id }
    }

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

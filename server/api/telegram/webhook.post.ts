import { Redis } from '@upstash/redis'
import { sendTelegramMessage } from '../../utils/telegram'
import type { DenunciaKV } from '~/types'

// Tipos para a requisição do Telegram
interface TelegramUpdate {
  message: {
    chat: { id: number }
    text: string
  }
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody<TelegramUpdate>(event)

  console.log('Webhook recebido:', JSON.stringify(body, null, 2))

  // 1. Validação básica
  if (!body?.message?.text || !body.message.chat.id) {
    return { statusCode: 200, message: 'Requisição ignorada' }
  }

  const chatId = body.message.chat.id.toString()
  const command = body.message.text.trim()
  const telegramConfig = { botToken: config.telegramBotToken, chatId: config.telegramChatId }
  
  // Inicializa o cliente Redis manualmente com as variáveis de ambiente
  const redis = new Redis({
    url: config.kvRestApiUrl,
    token: config.kvRestApiToken,
  })

  console.log(`Comando recebido: "${command}" do Chat ID: ${chatId}`)
  console.log(`Chat ID esperado: ${config.telegramChatId}`)

  // 2. Verificar se é o comando /stats e se veio do chat correto
  if (command === '/stats' && chatId === config.telegramChatId) {
    console.log('Comando /stats validado. Processando...')
    try {
      // 3. Buscar dados do Upstash Redis
      const denunciaKeys = await redis.zrange('denuncias_por_data', 0, -1)
      if (denunciaKeys.length === 0) {
        await sendTelegramMessage(telegramConfig, 'Nenhuma denúncia encontrada para gerar estatísticas.')
        return { statusCode: 200 }
      }

      const pipeline = redis.pipeline()
      denunciaKeys.forEach(key => pipeline.hgetall(key as string))
      const results = await pipeline.exec()
      const denuncias = results.filter(r => r !== null) as DenunciaKV[]

      // 4. Calcular Estatísticas
      const stats = calculateStatistics(denuncias)

      // 5. Formatar e Enviar Resposta
      const message = formatStatsMessage(stats)
      await sendTelegramMessage(telegramConfig, message)

    } catch (error) {
      console.error('Erro ao gerar estatísticas:', error)
      await sendTelegramMessage(telegramConfig, 'Ocorreu um erro ao buscar as estatísticas. Tente novamente mais tarde.')
    }
  }

  return { statusCode: 200, message: 'OK' }
})

// Lógica de Cálculo
function calculateStatistics(denuncias: DenunciaKV[]) {
  const now = new Date()
  const total = denuncias.length

  // Filtros de tempo
  const today = denuncias.filter(d => (now.getTime() - new Date(d.createdAt).getTime()) < 24 * 60 * 60 * 1000).length
  const week = denuncias.filter(d => (now.getTime() - new Date(d.createdAt).getTime()) < 7 * 24 * 60 * 60 * 1000).length
  const month = denuncias.filter(d => (now.getTime() - new Date(d.createdAt).getTime()) < 30 * 24 * 60 * 60 * 1000).length

  // Contagem por tipo e urgência
  const byType = countBy(denuncias, 'tipo')
  const byUrgency = countBy(denuncias, 'urgencia')

  // Estatísticas temporais
  const byHour = countBy(denuncias, d => new Date(d.createdAt).getUTCHours().toString())
  const peakHour = Object.keys(byHour).length > 0 ? Object.keys(byHour).reduce((a, b) => byHour[a] > byHour[b] ? a : b) : 'N/A'

  const byWeekday = countBy(denuncias, d => new Date(d.createdAt).getUTCDay().toString())
  const peakWeekday = Object.keys(byWeekday).length > 0 ? Object.keys(byWeekday).reduce((a, b) => byWeekday[a] > byWeekday[b] ? a : b) : 'N/A'
  
  return { total, today, week, month, byType, byUrgency, peakHour, peakWeekday }
}

// Lógica de Formatação
function formatStatsMessage(stats: any): string {
  const { total, today, week, month, byType, byUrgency, peakHour, peakWeekday } = stats
  const weekdays = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

  const p = (count: number) => total > 0 ? ((count / total) * 100).toFixed(1) : '0.0'

  const general = [
    '*📊 Estatísticas Gerais*',
    `Total de denúncias: *${total}*`,
    `Hoje (24h): *${today}*`,
    `Esta semana (7d): *${week}*`,
    `Este mês (30d): *${month}*`
  ].join('\n')

  const types = [
    '\n*🏷️ Estatísticas por Tipo*',
    `Porte ilegal: *${byType['porte'] || 0}* (${p(byType['porte'] || 0)}%)`,
    `Tráfico de drogas: *${byType['trafico'] || 0}* (${p(byType['trafico'] || 0)}%)`,
    `Ameaças de facção: *${byType['ameaca'] || 0}* (${p(byType['ameaca'] || 0)}%)`,
    `Disparos: *${byType['disparos'] || 0}* (${p(byType['disparos'] || 0)}%)`,
    `Outros: *${byType['outros'] || 0}* (${p(byType['outros'] || 0)}%)`
  ].join('\n')

  const urgencies = [
    '\n*❗ Estatísticas por Urgência*',
    `Alta urgência: *${byUrgency['alta'] || 0}* (${p(byUrgency['alta'] || 0)}%)`,
    `Média urgência: *${byUrgency['media'] || 0}* (${p(byUrgency['media'] || 0)}%)`,
    `Baixa urgência: *${byUrgency['baixa'] || 0}* (${p(byUrgency['baixa'] || 0)}%)`
  ].join('\n')
  
  const temporal = [
    '\n*🕒 Estatísticas Temporais*',
    `Horário de pico: *${peakHour !== 'N/A' ? `${peakHour}h - ${parseInt(peakHour) + 1}h` : 'N/A'}* (UTC)`,
    `Dia da semana com mais denúncias: *${peakWeekday !== 'N/A' ? weekdays[parseInt(peakWeekday)] : 'N/A'}*`
  ].join('\n')

  return [general, types, urgencies, temporal].join('\n')
}

// Função utilitária para contagem
function countBy(arr: any[], keyOrFn: string | ((item: any) => string)): Record<string, number> {
  return arr.reduce((acc, item) => {
    const key = typeof keyOrFn === 'function' ? keyOrFn(item) : item[keyOrFn]
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})
}

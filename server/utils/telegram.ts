import type { TelegramConfig } from '~/types'

export interface TelegramMessagePayload {
  chat_id: string
  text: string
  parse_mode?: 'Markdown' | 'HTML'
  disable_web_page_preview?: boolean
}

export async function sendTelegramMessage(config: TelegramConfig, text: string): Promise<void> {
  const url = `https://api.telegram.org/bot${config.botToken}/sendMessage`
  const payload: TelegramMessagePayload = {
    chat_id: config.chatId,
    text,
    parse_mode: 'Markdown',
    disable_web_page_preview: true
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })

  if (!response.ok) {
    const body = await response.text().catch(() => '')
    throw new Error(`Falha ao enviar mensagem ao Telegram: ${response.status} ${response.statusText} ${body}`)
  }
}

export function buildTelegramText(payload: {
  id: string
  tipo: string
  urgencia: string
  descricao: string
  local?: string
  data?: string
  testemunhas?: boolean
  evidencias?: boolean
  contato?: string
}): string {
  const lines: string[] = []
  lines.push(`*Nova Denúncia Anônima*`)
  lines.push(`*ID:* ${payload.id}`)
  lines.push(`*Tipo:* ${payload.tipo}`)
  lines.push(`*Urgência:* ${payload.urgencia.toUpperCase()}`)
  if (payload.local) lines.push(`*Local:* ${payload.local}`)
  if (payload.data) lines.push(`*Data:* ${new Date(payload.data).toLocaleDateString('pt-BR')}`)
  if (payload.contato) lines.push(`*Contato (ofuscado):* ${payload.contato}`)
  lines.push('')
  const desc = payload.descricao.length > 3500 ? payload.descricao.slice(0, 3500) + '…' : payload.descricao
  lines.push(`*Descrição:*\n${escapeMarkdown(desc)}`)
  return lines.join('\n')
}

function escapeMarkdown(text: string): string {
  return text.replace(/[\\_\*\[\]\(\)~`>#+\-=\|{}.!]/g, (m) => `\\${m}`)
}



# 🔐 Escuta Segura - Sistema de Denúncia Anônima da 2ª Cia do 8º BPM

Um sistema seguro e confidencial para denúncias anônimas, desenvolvido em Nuxt.js com foco total na privacidade e anonimato dos denunciantes.

## ✨ Características

- **100% Anônimo**: Não coleta IPs, não usa cookies de rastreamento
- **Dados Sanitizados**: Informações pessoais são automaticamente ofuscadas
- **Criptografia SSL**: Todas as comunicações são criptografadas
- **Interface Intuitiva**: Formulário simples e acessível
- **Responsive**: Funciona em desktop e mobile
- **Deploy Gratuito**: Pode ser hospedado gratuitamente

## 🚀 Configuração e Instalação

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Variáveis de Ambiente (Telegram)

Copie o arquivo `env.example` para `.env`:

```bash
cp env.example .env
```

Edite o arquivo `.env` com suas configurações do Telegram:

```env
TELEGRAM_BOT_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TELEGRAM_CHAT_ID=123456789
```

Como obter:
- Crie um bot com o `@BotFather` e copie o token (BOT_TOKEN)
- Descubra o `CHAT_ID` enviando uma mensagem ao bot e consultando `https://api.telegram.org/bot<BOT_TOKEN>/getUpdates`

### 3. Desenvolvimento Local

```bash
npm run dev
```

Acesse `http://localhost:3000`

## 🌐 Deploy Gratuito (com Telegram)

O projeto usa API routes (Nitro) e precisa de um backend durante o deploy. Abaixo, três opções 100% gratuitas (com limites):

### Opção 1: Vercel (Recomendado)

1. Faça push do código para o GitHub.
2. No painel da Vercel, clique em "New Project" e importe o repositório.
3. Em Settings > Environment Variables, adicione:
   - `TELEGRAM_BOT_TOKEN`
   - `TELEGRAM_CHAT_ID`
4. Deploy. A Vercel detecta Nuxt automaticamente.

Observações:
- Para Nuxt 4, a Vercel cria as Serverless Functions para `server/api/**` automaticamente.
- Se precisar, defina o Build Command como `npm run build` (padrão já funciona).

### Opção 2: Render (grátis com plano Free)

1. Crie um Web Service na Render e conecte seu GitHub.
2. Build Command: `npm run build`
3. Start Command: `node .output/server/index.mjs`
4. Em Environment, adicione `TELEGRAM_BOT_TOKEN` e `TELEGRAM_CHAT_ID`.

### Opção 3: Railway (grátis com uso limitado)

1. Crie um projeto na Railway e conecte o repositório.
2. Sete as variáveis `TELEGRAM_BOT_TOKEN` e `TELEGRAM_CHAT_ID` no painel.
3. Caso necessário, configure:
   - Build: `npm run build`
   - Start: `node .output/server/index.mjs`

## 📲 Entrega das Denúncias

As denúncias são enviadas via Telegram (Bot API) usando as variáveis `TELEGRAM_BOT_TOKEN` e `TELEGRAM_CHAT_ID`.
Sem elas, a API retorna erro de configuração.

## 🔒 Recursos de Segurança

- **Headers de Segurança**: CSP, X-Frame-Options, etc.
- **Sanitização Automática**: Remove dados identificáveis
- **Validação Rigorosa**: Zod para validação de dados
- **Middleware de Segurança**: Remove headers de identificação
- **SSL Obrigatório**: Todas as comunicações criptografadas

## 📁 Estrutura do Projeto (atual)

```
escuta-segura/
├── app/
│   ├── components/          # Componentes Vue
│   │   └── DenunciaForm.vue # Formulário principal
│   ├── layouts/             # Layouts da aplicação
│   │   └── default.vue      # Layout padrão
│   ├── middleware/          # Middleware de segurança
│   │   └── security.global.ts
│   ├── pages/               # Páginas da aplicação
│   │   └── index.vue        # Página principal
│   ├── assets/              # Assets estáticos (Tailwind)
│   │   └── css/
│   │       └── main.css
│   ├── utils/               # Utilitários (frontend)
│   │   └── validation.ts    # Validação e sanitização (Zod)
│   ├── types/               # Tipos TypeScript
│   │   └── index.ts
├── server/                  # Backend (Nitro)
│   ├── api/
│   │   └── denuncia.post.ts # Endpoint que envia a denúncia para o Telegram
│   └── utils/
│       └── telegram.ts      # Cliente simples da Telegram Bot API
│   ├── types/               # Tipos TypeScript
│   │   └── index.ts         # Definições de tipos
│   ├── utils/               # Utilitários
│   │   └── validation.ts    # Validação e sanitização
│   └── assets/              # Assets estáticos
│       └── css/
│           └── main.css     # Estilos principais
├── public/                  # Arquivos públicos
├── nuxt.config.ts          # Configuração do Nuxt
├── package.json            # Dependências
└── env.example            # Exemplo de variáveis de ambiente
```

## 🛠️ Personalização

- **Alterar Tipos de Denúncia**: `app/types/index.ts`, `app/components/DenunciaForm.vue` e `app/utils/validation.ts`
- **Mensagem enviada ao Telegram**: formatação em `server/utils/telegram.ts` e mapeamento de labels em `server/api/denuncia.post.ts`
- **Estilos**: `app/assets/css/main.css` (Tailwind)

## 🔧 Scripts Disponíveis

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview da build de produção
npm run generate     # Gerar site estático
```

## 📝 Observações de Ambiente

- As variáveis `TELEGRAM_BOT_TOKEN` e `TELEGRAM_CHAT_ID` são obrigatórias em produção.
- Se estiverem ausentes no servidor, a API retorna erro de configuração.

## 🆘 Suporte

Para problemas ou dúvidas:
1. Verifique a configuração das variáveis de ambiente
2. Confirme se o App Password está correto (Gmail)
3. Verifique os logs do servidor
4. Teste primeiro em modo desenvolvimento

## 📄 Licença

Este projeto é open source e está disponível sob a licença MIT.

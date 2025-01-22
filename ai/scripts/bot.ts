import dotenv from 'dotenv'
import { Telegraf, Context } from 'telegraf'
import { CallbackQuery, Message } from 'telegraf/types'
import fs from 'fs'
import {
  HistoryMessage,
  ProviderFactory,
  ProviderType,
  BaseLLMProvider,
  LLMError,
} from './providers'
import { Tool, tools } from './tools'
import { ToolResultBlockParam } from '@anthropic-ai/sdk/resources/messages'
import { Logger } from './utils/logger'

// Load environment variables
dotenv.config()

const cursorRules = fs.readFileSync('system.md', 'utf-8')
const systemPrompt = cursorRules

// Initialize LLM provider
const CURRENT_PROVIDER = (process.env.LLM_PROVIDER as ProviderType) || 'ollama'
let llmProvider: BaseLLMProvider

try {
  if (!process.env.LLM_API_KEY || !process.env.LLM_MODEL) {
    throw new Error('LLM_API_KEY and LLM_MODEL must be set')
  }

  llmProvider = ProviderFactory.create(CURRENT_PROVIDER, {
    apiKey: process.env.LLM_API_KEY,
    model: process.env.LLM_MODEL,
    host: process.env.LLM_HOST,
  })
} catch (error) {
  console.error(`Failed to initialize ${CURRENT_PROVIDER} provider:`, error)
  process.exit(1)
}

// Initialize bot with token from environment variables
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN || '')

// Store conversation history and loggers
const conversationHistory = new Map<number, Array<HistoryMessage>>()
const userLoggers = new Map<number, Logger>()

// Helper to get chat history
function getChatHistory(chatId: number) {
  if (!conversationHistory.has(chatId)) {
    conversationHistory.set(chatId, [{ role: 'user', content: systemPrompt }])
  }
  return conversationHistory.get(chatId)!
}

// Helper to get or create logger for a user
function getLogger(user: any) {
  const chatId = user.id
  if (!userLoggers.has(chatId)) {
    userLoggers.set(chatId, new Logger({ ...user, app: 'telegram' }))
  }
  return userLoggers.get(chatId)!
}

// Basic error handling
bot.catch((err: unknown, ctx: Context) => {
  console.error('Telegraf error:', err)
  ctx.reply('Sorry, I encountered an error. Please try again later.')
})

// Command handlers
bot.command('start', async (ctx: Context) => {
  const chatId = ctx.chat?.id
  if (!chatId) return

  const user = ctx.from
  if (!user) return

  console.log('user', user)
  console.log('chatId', chatId)

  let context = ''

  const logger = getLogger(user)
  llmProvider.setLogger(logger)
  logger.log(chatId, 'system', 'Starting new conversation', user)

  conversationHistory.set(chatId, [
    {
      role: 'system',
      content: systemPrompt + '\n\n' + context,
    },
    {
      role: 'user',
      content: JSON.stringify({
        user,
        todaysDate: new Date().toISOString().split('T')[0],
      }),
    },
  ])

  logger.log(chatId, 'user', '/start')

  const text = 'Hi! I am your dance assistant. How can I help you today?'

  await ctx.reply(text, {
    parse_mode: 'HTML',
  })
})

// Command to show current provider
bot.command('provider', (ctx: Context) => {
  const chatId = ctx.chat?.id
  if (!chatId || !ctx.from) return

  const logger = getLogger(ctx.from)
  llmProvider.setLogger(logger)

  logger.log(chatId, 'user', '/provider')

  const { name, model } = llmProvider.getModelInfo()
  const response = `Current provider: ${name} (${model})`

  logger.log(chatId, 'bot-response', response)

  ctx.reply(response)
})

async function processMessage(
  ctx: Context,
  history: HistoryMessage[],
  isFirstMessage: boolean = false
) {
  try {
    if (!ctx.chat?.id || !ctx.from) return

    const logger = getLogger(ctx.from)
    llmProvider.setLogger(logger)

    // Get initial response
    let message = await llmProvider.ask(history, ctx.chat?.id)

    let waitingForToolResponse = false

    // Handle text response if present
    if (message.text) {
      await handleTextResponse(ctx, history, message.text)
    }

    // Handle tool calls if present
    if (message.toolCalls?.length) {
      for (const toolCall of message.toolCalls) {
        await handleToolCall(ctx, history, toolCall)
        waitingForToolResponse = true
      }
    }

    if (waitingForToolResponse) {
      await processMessage(ctx, history)
    }
  } catch (error) {
    console.error(
      `${CURRENT_PROVIDER} error:`,
      error instanceof Error ? error.message : String(error)
    )

    if (ctx.chat?.id && ctx.from) {
      const logger = getLogger(ctx.from)
      logger.log(
        ctx.chat?.id,
        'system',
        error instanceof Error ? error.message : String(error)
      )
    }

    let errorMessage = `Sorry, I encountered an error.\n\n`

    if (error instanceof LLMError) {
      errorMessage += 'Restart the conversation with /start'
    }

    await ctx.reply(errorMessage)
  }
}

async function handleToolCall(
  ctx: Context,
  history: HistoryMessage[],
  toolCall: {
    id: string
    name: string
    input: any
  }
) {
  if (!ctx.chat?.id || !ctx.from) return

  await ctx.sendChatAction('typing')

  // Add tool_use message to history
  history.push({
    role: 'assistant',
    content: [
      {
        type: 'tool_use',
        id: toolCall.id,
        name: toolCall.name,
        input: toolCall.input,
      },
    ],
  })

  const tool = tools[toolCall.name] as Tool | undefined

  if (tool) {
    const progress = tool.progress(toolCall.input)

    await ctx.reply(`<i>${progress}</i>`, {
      parse_mode: 'HTML',
    })

    const toolResponse = await tool.execute(toolCall.input)

    const toolResult: ToolResultBlockParam = {
      type: 'tool_result',
      tool_use_id: toolCall.id,
      content: toolResponse,
    }

    const logger = getLogger(ctx.from)
    logger.log(ctx.chat?.id, 'tool-execution', '', {
      tool: toolCall.name,
      input: toolCall.input,
      output: toolResponse,
    })

    history.push({
      role: 'user',
      content: [toolResult],
    })
  }
}

async function handleTextResponse(
  ctx: Context,
  history: HistoryMessage[],
  text: string | undefined
) {
  if (!text) return

  await ctx.sendChatAction('typing')

  history.push({
    role: 'assistant',
    content: text,
  })

  const logger = getLogger(ctx.from!)
  logger.log(ctx.chat!.id, 'bot-response', text)

  await ctx.reply(text, {
    parse_mode: 'HTML',
  })
}

function isDataCallbackQuery(
  query: CallbackQuery
): query is CallbackQuery.DataQuery {
  return (query as CallbackQuery.DataQuery).data !== undefined
}

bot.on('callback_query', async (ctx: Context) => {
  const chatId = ctx.chat?.id
  const callbackQuery = ctx.callbackQuery

  if (!chatId || !callbackQuery) return

  if (isDataCallbackQuery(callbackQuery)) {
    const history = getChatHistory(chatId)
    history.push({ role: 'user', content: callbackQuery.data })

    await processMessage(ctx, history)
  }
})

// Handle messages
bot.on('text', async (ctx: Context) => {
  const chatId = ctx.chat?.id
  const messageText = (ctx.message as Message.TextMessage).text

  if (!chatId || !ctx.from) return

  const history = getChatHistory(chatId)
  history.push({ role: 'user', content: messageText })

  // Log user message
  const logger = getLogger(ctx.from)
  logger.log(chatId, 'user', messageText)

  await processMessage(ctx, history)
})

// Launch bot
async function startBot() {
  if (!process.env.TELEGRAM_BOT_TOKEN) {
    console.error('\n❌ Error: TELEGRAM_BOT_TOKEN is not set in .env file')
    console.log('\n📝 Setup Instructions:')
    console.log('1. Create a bot with @BotFather on Telegram')
    console.log('2. Copy the token you received')
    console.log('3. Create .env file: cp .env.example .env')
    console.log('4. Add your token to .env: TELEGRAM_BOT_TOKEN=your_token_here')
    console.log('\nSee docs/telegram-bot-setup.md for detailed instructions')
    process.exit(1)
  }

  try {
    await bot.launch()
    const { name, model } = llmProvider.getModelInfo()
    console.log('\n✅ Bot is running!')
    console.log(`🤖 Provider: ${name} (${model})`)
    console.log('📚 System prompt loaded from cursorrules')

    if (name === 'ollama') {
      console.log('\n💡 Tip: Make sure Ollama is running:')
      console.log('   docker-compose up -d ollama')
      console.log('   docker exec -it ollama ollama pull mistral')
    }
  } catch (error) {
    if (
      error &&
      typeof error === 'object' &&
      'response' in error &&
      typeof error.response === 'object' &&
      error.response &&
      'error_code' in error.response &&
      error.response.error_code === 404
    ) {
      console.error('\n❌ Error: Invalid Telegram bot token')
      console.log('\n🔍 Common issues:')
      console.log('1. Token might be incorrect or expired')
      console.log('2. Bot might have been deleted')
      console.log('3. .env file might not be properly set up')
      console.log('\n📝 To fix:')
      console.log('1. Check your bot with @BotFather')
      console.log('2. Verify the token in your .env file')
      console.log('3. Make sure you copied the entire token')
      console.log('\nSee docs/telegram-bot-setup.md for help')
    } else {
      console.error(
        '\n❌ Failed to start bot:',
        error instanceof Error ? error.message : String(error)
      )
      console.log('\n🔍 Troubleshooting steps in docs/telegram-bot-setup.md')
    }
    process.exit(1)
  }
}

// Start the bot
startBot()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

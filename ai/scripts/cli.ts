import { tools } from './tools'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

async function main() {
  const toolName = process.argv[2]
  const args = process.argv[3] ? JSON.parse(process.argv[3]) : {}

  if (!toolName) {
    console.log('Available tools:')
    Object.entries(tools).forEach(([name, tool]) => {
      console.log(`\n${name}:`)
      console.log(`Description: ${tool.description}`)
      console.log('Input schema:', JSON.stringify(tool.input_schema, null, 2))
    })
    process.exit(1)
  }

  const tool = tools[toolName]
  if (!tool) {
    console.error(`Tool "${toolName}" not found`)
    process.exit(1)
  }

  try {
    console.log(tool.progress(args))
    const result = await tool.execute(args)
    console.log('\nResult:')
    console.log(result)
  } catch (error) {
    console.error('Error executing tool:', error)
    process.exit(1)
  }
}

main()

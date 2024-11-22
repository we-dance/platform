import * as path from 'path'
import * as fs from 'fs'
import * as YAML from 'yaml'

export function readFile(pathToFile: string) {
  if (!fs.existsSync(pathToFile)) {
    return {}
  }

  const fileContents = fs.readFileSync(pathToFile, 'utf8')
  return YAML.parse(fileContents)
}

export function readFiles(pathToFiles: string) {
  if (!fs.existsSync(pathToFiles)) {
    console.log(`Path ${pathToFiles} not exists`)
    return []
  }

  const properties = [] as any

  fs.readdirSync(pathToFiles).forEach((file) => {
    const pathToFile = path.join(pathToFiles, file)

    if (fs.lstatSync(pathToFile).isFile()) {
      const data = readFile(pathToFile)
      properties.push(data)
    }
  })

  return properties
}

export function getFiles(pathToFiles: string) {
  const result: string[] = []

  fs.readdirSync(pathToFiles).forEach((file) => {
    result.push(file)
  })

  return result
}

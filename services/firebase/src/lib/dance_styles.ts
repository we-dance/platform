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

export function generateStyles() {
  const stylesPath = path.join(__dirname, '../../../../content/styles')
  let styles = readFiles(stylesPath)

  styles = styles.map((s: any) => ({
    id: s.id,
    name: s.name,
  }))

  const output = JSON.stringify(styles, null, 2)

  fs.writeFileSync(
    __dirname + '/../../../../services/firebase/src/dance_styles.json',
    output,
    'utf8'
  )
}

export function getStyles() {
  const pathToFile =
    __dirname + '/../../../../services/firebase/src/dance_styles.json'
  const styles = JSON.parse(fs.readFileSync(pathToFile, 'utf8'))

  return styles
}

import format from 'date-fns/format'
import formatDistance from 'date-fns/formatDistance'
import MarkdownIt from 'markdown-it'
import excerptHtml from 'excerpt-html'
import saveAs from 'file-saver'
import { dsvFormat } from 'd3'
import firebase from 'firebase/app'
import languages from '~/assets/languages'
import 'firebase/firestore'
import { getGoogle } from '~/use/google'

export const getVenueFromText = async (text) => {
  const google = await getGoogle()
  const service = new google.maps.places.PlacesService(
    document.createElement('div')
  )
  const request = {
    query: text,
    fields: ['place_id', 'formatted_address', 'name'],
  }

  return new Promise((resolve, reject) => {
    service.findPlaceFromQuery(request, async (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        try {
          let doc
          const firestore = firebase.firestore()
          const collection = firestore.collection('venues')
          doc = await collection.doc(results[0].place_id).get()
          if (!doc.exists) {
            await collection.doc(results[0].place_id).set({
              name: results[0].name,
              id: results[0].place_id,
              rooms: '',
              map: '',
              address: results[0].formatted_address,
              createdAt: Date.now(),
            })
            doc = await collection.doc(results[0].place_id).get()
          }
          resolve(doc.data())
        } catch (error) {
          reject(new Error(error.message))
        }
      } else {
        reject(new Error('Could not get location'))
      }
    })
  })
}

export const getObjectKeysFromArray = (arr) => {
  const obj = {}

  arr.forEach((element) => {
    obj[element] = true
  })

  return obj
}

export const sortBy = (_key) => {
  let key = _key
  let multi = 1

  if (_key[0] === '-') {
    key = _key.slice(1)
    multi = -1
  }

  return (a, b) =>
    a[key] > b[key] ? 1 * multi : b[key] > a[key] ? -1 * multi : 0
}

export const toDatetimeLocal = (date) => {
  return format(date, "yyyy-MM-dd'T'HH:mm", {
    awareOfUnicodeTokens: true,
  })
}

export const getDateObect = (val) => {
  let date

  if (!val) {
    return null
  }

  if (typeof val.toDate === 'function') {
    date = val.toDate()
  } else {
    date = new Date(val)
  }

  return date
}

export const dateDiff = (val) => {
  if (!val) return ''
  return formatDistance(getDateObect(val), new Date())
}

export const formatDate = (val, formatStr) => {
  if (!val) return ''
  return format(getDateObect(val), formatStr)
}

export const getDateTime = (val) => {
  return formatDate(val, "d MMM' at 'H:mm")
}

export const getDateTimeYear = (val) => {
  return formatDate(val, 'd MMM yyyy')
}

export const getYmdHms = (val) => {
  return formatDate(val, 'yyyy-MM-dd HH:mm:ss')
}

export const getYmd = (val) => {
  return formatDate(val, 'yyyy-MM-dd')
}

export const getDate = (val) => {
  return formatDate(val, 'd MMM')
}

export const getDay = (val) => {
  return formatDate(val, 'iiii')
}

export const getTime = (val) => {
  return formatDate(val, 'H:mm')
}

export const getTimeZone = (val) => {
  return formatDate(val, '(z)')
}

export const openURL = (url) => {
  window.open(url, '_blank')
}

export const getExcerpt = (markdown) => {
  if (!markdown) {
    return ''
  }

  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
  })

  const html = md.render(markdown)

  return excerptHtml(html)
}

export const imageExists = async (url) => {
  let result = {}

  try {
    result = await fetch(url, { method: 'HEAD' })

    if (result.ok) {
      return true
    }
  } catch (e) {}

  return false
}

export const camelcase = (text) => {
  if (!text) {
    return ''
  }

  const result = text.replace(/([A-Z])/g, ' $1')
  const finalResult = result.charAt(0).toUpperCase() + result.slice(1)
  return finalResult
}

export const getId = (text) => {
  if (!text) {
    return ''
  }

  return text.replace(' ', '')
}

export const camelize = (str) => {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase()
    })
    .replace(/\s+/g, '')
}

export const addressPart = (result, type) => {
  if (!result) {
    return ''
  }

  const part = result.address_components.find((o) => o.types.includes(type))
  if (!part) {
    return ''
  }

  return part.long_name
}

export const getLocation = (result, usedGps) => ({
  locality: addressPart(result, 'locality'),
  country: addressPart(result, 'country'),
  place_id: result.place_id,
  latitude: result.geometry.location.lat(),
  longitude: result.geometry.location.lng(),
  usedGps,
})

export const sanitize = (input, trim, target = '') => {
  const val = input || ''
  const expression = new RegExp(trim, 'gi')
  return val.replace(expression, target).trim()
}

export const saveCSV = (data, filename) => {
  const csvFile = dsvFormat(',').format(data)
  const blob = new Blob([csvFile], {
    type: 'text/csv;charset=utf-8',
  })

  saveAs(blob, filename)
}

export const getOptions = (items, label) => {
  return [
    {
      label,
      value: '',
    },
    ...items,
  ]
}

function getLang(languageString) {
  const [language] = languageString
    .replace('-', '_')
    .toLowerCase()
    .split('_')

  return language
}

export function browserLanguages() {
  const langs = []

  if (window?.navigator?.languages) {
    langs.push(...window.navigator.languages)
  }

  if (window?.navigator?.userLanguage) {
    langs.push(window.navigator.userLanguage)
  }

  if (window?.navigator?.language) {
    langs.push(window.navigator.language)
  }

  return langs
}

export function guessLanguages(fromUser, fromBrowser) {
  const input = String(fromUser).toLowerCase()
  const result = {}

  const longLangs = input
    .replace(/[`~!@#$%^&()_+\-?;:'",.\n\r/\\ ]/gi, '|')
    .split('|')
    .filter((l) => l)

  for (const longLang of longLangs) {
    const lang = languages.find(
      (l) =>
        longLang === l.label.toLowerCase() ||
        longLang === l.native.toLowerCase() ||
        (l.synonyms && l.synonyms.includes(longLang))
    )

    if (!lang) {
      continue
    }

    result[lang.value] = true
  }

  const langs = getLanguages(fromBrowser)

  let extended = { ...result, ...langs }

  if (!Object.keys(result)) {
    extended = { en: true }
  }

  return extended
}

export function getLanguages(input) {
  if (!window) {
    return {}
  }

  let langs = input

  if (!input) {
    langs = browserLanguages()
  }

  const locales = getObjectKeysFromArray(langs.map(getLang))

  return locales
}

function traverseAndFlatten(currentNode, target, flattenedKey) {
  for (const key in currentNode) {
    if (key in currentNode) {
      let newKey
      if (flattenedKey === undefined) {
        newKey = key
      } else {
        newKey = flattenedKey + '.' + key
      }

      const value = currentNode[key]
      if (typeof value === 'object' && value && !value.toDate) {
        traverseAndFlatten(value, target, newKey)
      } else {
        target[newKey] = value
      }
    }
  }
}

export function flatten(obj) {
  const flattenedObject = {}
  traverseAndFlatten(obj, flattenedObject)
  return flattenedObject
}

export function search(str, match) {
  if (!match || !match.length) {
    return true
  }

  if (!str) {
    return false
  }

  return str.toLowerCase().includes(match.toLowerCase())
}

export function getLabel(list, value) {
  if (list.length) {
    const item = list.find((i) => i.value === value)

    return item?.label
  }

  return list[value]
}

export function getLabels(list, values) {
  if (!values) {
    return ''
  }

  return Object.keys(values)
    .map((v) => getLabel(list, v))
    .join(', ')
}

export function getOptionsFromMulti(list, values) {
  if (!values) {
    return []
  }

  return Object.keys(values).map((v) => ({
    label: getLabel(list, v),
    value: v,
  }))
}

export async function loadDoc({ app, params, error }, collection) {
  const docRef = app.$fire.firestore.collection(collection).doc(params.id)

  const snapshot = await docRef.get()
  const doc = snapshot.data()

  if (!doc) {
    error({ statusCode: 404 })
  }

  doc.id = snapshot.id

  return {
    doc,
  }
}

export const getEventDescription = (event) => {
  let result =
    getDay(event.startDate) +
    ', ' +
    getDate(event.startDate) +
    ' ' +
    getTime(event.startDate)

  if (event.venue) {
    result += ' at ' + event.venue.name + ' '
  }

  return result
}

export const getMeta = (collection, post) => {
  return {
    title: post.title,
    meta: [
      {
        vmid: 'description',
        name: 'description',
        content: getExcerpt(post.description),
      },
      {
        vmid: 'keywords',
        name: 'keywords',
        content: post.keywords,
      },
      {
        vmid: 'og:title',
        property: 'og:title',
        content: post.title,
      },
      {
        vmid: 'og:description',
        property: 'og:description',
        content: getExcerpt(post.description),
      },
    ],
  }
}

export const getFieldValue = (field) => {
  if (typeof field === 'string') {
    return field
  }

  if (field.value) {
    return field.value
  }

  return field.name
}

export const getFieldLabel = (field) => {
  if (typeof field === 'string') {
    return camelcase(field)
  }

  if (field.label) {
    return field.label
  }

  return camelcase(field.name)
}

export const getOptionsFromArray = (items) => {
  return items.map((i) => ({
    value: getFieldValue(i),
    label: getFieldLabel(i),
  }))
}

export const searchBy = (field, value) => (i) => search(i[field], value)

export const searchByStart = (field, value) => (i) => {
  if (!value) {
    return true
  }

  if (!i[field]) {
    return false
  }

  return i[field].toLowerCase().startsWith(value.toLowerCase())
}

export const getArrayFromHash = (hash) => {
  if (!hash) {
    return []
  }

  return Object.keys(hash).map((k) => hash[k])
}

export const getOptionsFromHash = (hash, label = 'name') => {
  if (!hash) {
    return []
  }

  let labelFn

  if (typeof label === 'function') {
    labelFn = label
  } else {
    labelFn = (doc) => doc[label]
  }

  const keys = Object.keys(hash)

  const results = []

  for (const key of keys) {
    const doc = hash[key]

    results.push({
      label: labelFn(doc),
      value: key,
    })
  }

  return results
}

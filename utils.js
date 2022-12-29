import format from 'date-fns/format'
import { enUS, de, ru, es, fr, tr, it, pl, ro, sr } from 'date-fns/esm/locale'
import formatDistance from 'date-fns/formatDistance'
import MarkdownIt from 'markdown-it'
import excerptHtml from 'excerpt-html'
import saveAs from 'file-saver'
import { dsvFormat } from 'd3'
import { db } from './plugins/firebase'
import languages from '~/assets/languages'

const dateLocales = {
  en: enUS,
  de,
  ru,
  es,
  fr,
  tr,
  it,
  pl,
  ro,
  sr,
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
  if (!date) return ''

  if (Object.prototype.toString.call(date) === '[object Date]') {
    if (isNaN(date)) {
      return ''
    }
  }

  return format(date, "yyyy-MM-dd'T'HH:mm", {
    awareOfUnicodeTokens: true,
  })
}

export const getDateObect = (val) => {
  let date

  if (!val) {
    return null
  }

  if (Object.prototype.toString.call(val) === '[object Date]') {
    if (isNaN(val)) {
      return null
    }
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
  return formatDistance(getDateObect(val), new Date(), { addSuffix: true })
}

export const formatDate = (val, formatStr, locale) => {
  if (!val) return ''

  const date = getDateObect(val)

  if (!date) return ''

  if (!date.getTime || isNaN(date.getTime())) return ''

  let options = {}

  if (dateLocales[locale]) {
    options = { locale: dateLocales[locale] }
  }

  return format(date, formatStr, options)
}

export const getDateTime = (val, locale) => {
  return formatDate(val, 'd MMM H:mm', locale)
}

export const getDateTimeYear = (val, locale) => {
  return formatDate(val, 'd MMM yyyy', locale)
}

export const getYmdHms = (val, locale) => {
  return formatDate(val, 'yyyy-MM-dd HH:mm:ss', locale)
}

export const getYmd = (val, locale) => {
  return formatDate(val, 'yyyy-MM-dd', locale)
}

export const getDate = (val, locale) => {
  return formatDate(val, 'd MMM', locale)
}

export const getDay = (val, locale) => {
  return formatDate(val, 'iiii', locale)
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

export const slugify = (str) => {
  str = str.replace(/^\s+|\s+$/g, '')

  // Make the string lowercase
  str = str.toLowerCase()

  // Remove accents, swap ñ for n, etc
  const from =
    'ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆÍÌÎÏŇÑÓÖÒÔÕØŘŔŠŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇíìîïňñóöòôõøðřŕšťúůüùûýÿžþÞĐđßÆa·/_,:;'
  const to =
    'AAAAAACCCDEEEEEEEEIIIINNOOOOOORRSTUUUUUYYZaaaaaacccdeeeeeeeeiiiinnooooooorrstuuuuuyyzbBDdBAa------'
  for (let i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i))
  }

  // Remove invalid chars
  str = str
    .replace(/[^a-z0-9 -]/g, '')
    // Collapse whitespace and replace by -
    .replace(/\s+/g, '-')
    // Collapse dashes
    .replace(/-+/g, '-')

  return str
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
  const docRef = db.collection(collection).doc(params.id)

  const snapshot = await docRef.get()
  const doc = snapshot.data()

  if (!doc) {
    error({ statusCode: 404 })
    return
  }

  doc.id = snapshot.id

  return {
    doc,
  }
}

export async function loadDocAsync(id, collection) {
  const docRef = db.collection(collection).doc(id)

  const snapshot = await docRef.get()
  const doc = snapshot.data()

  doc.id = snapshot.id

  return doc
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

export const getListOfStyles = (styles, extra) => {
  if (!styles) {
    return extra
  }

  return [
    ...extra,
    ...Object.keys(styles).map((text) => text.replace(/([A-Z])/g, ' $1')),
  ]
}

export const getMeta = (collection, post) => {
  if (!post) {
    return {}
  }

  let schema = []

  if (collection === 'events') {
    schema = {
      '@context': 'https://schema.org',
      '@type': 'DanceEvent',
      name: post.name,
      description: post.description,
      image: post.socialCover || post.cover,
      startDate: post.startDate
        ? getDateObect(post.startDate).toISOString()
        : '',
      endDate: post.endDate ? getDateObect(post.endDate).toISOString() : '',
      url: `/events/${post.id}`,
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      location: {
        '@type': 'Place',
        address: {
          '@type': 'PostalAddress',
          contactType: 'Venue Manager',
          addressLocality: addressPart(post?.venue, 'locality'),
          addressRegion: addressPart(
            post?.venue,
            'administrative_area_level_1'
          ),
          streetAddress:
            addressPart(post?.venue, 'route') +
            ' ' +
            addressPart(post?.venue, 'street_number'),
          postalCode: addressPart(post?.venue, 'postal_code'),
        },
        name: post.venue?.name,
        url: post.venue?.url,
      },
      offers: {
        '@type': 'Offer',
        price: post.price,
      },
      organizer: {
        '@type': 'Person',
        image: post?.org?.photo,
        name: post?.org?.name,
        description: post?.org?.bio,
        sameAs: [
          `https://wedance.vip/${post?.org?.username}`,
          `https://facebook.com/${post?.org?.facebook}`,
          `https://instagram.com/${post?.org?.instagram}`,
        ],
      },
      performer: post.artists?.map((artist) => ({
        '@type': 'Person',
        image: artist?.photo,
        name: artist?.name,
        description: artist?.bio,
        sameAs: [
          `https://wedance.vip/${artist?.username}`,
          `https://facebook.com/${artist?.facebook}`,
          `https://instagram.com/${artist?.instagram}`,
        ],
      })),
    }
  }

  if (collection === 'profiles') {
  }

  return {
    title: post.name || post.title || getExcerpt(post.description),
    meta: [
      {
        hid: 'description',
        name: 'description',
        content: getExcerpt(post.description),
      },
      {
        hid: 'keywords',
        name: 'keywords',
        content: getListOfStyles(post.styles, [
          'WeDance',
          'Dance',
          addressPart(post?.venue, 'country'),
          addressPart(post?.venue, 'locality'),
          post.venue?.name,
          post.eventType,
        ]).join(', '),
      },
      {
        hid: 'og:title',
        property: 'og:title',
        content: post.title,
      },
      {
        hid: 'og:type',
        property: 'og:type',
        content: collection === 'events' ? 'event' : 'website',
      },
      {
        hid: 'og:description',
        property: 'og:description',
        content: getExcerpt(post.description),
      },
      {
        hid: 'og:image',
        property: 'og:image',
        content: post.socialCover || post.cover,
      },
      {
        hid: 'author',
        name: 'author',
        content: post?.org?.name || post.username,
      },
      {
        hid: 'publisher',
        name: 'publisher',
        content: post?.org?.name || post.username,
      },
    ],
    script: [
      {
        hid: 'schema',
        type: 'application/ld+json',
        json: schema,
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

export const getUrlFromText = (text) => {
  const result =
    text.match(/\bhttps?::\/\/\S+/gi) || text.match(/\bhttps?:\/\/\S+/gi)

  if (result) {
    return result[0]
  }

  return ''
}

export const getYoutubeId = (url) => {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
  const match = url.match(regExp)
  const videoId = match && match[7].length === 11 ? match[7] : ''

  return videoId
}

export function sum(a, b) {
  return a + b
}

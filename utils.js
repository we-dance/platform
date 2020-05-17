import format from 'date-fns/format'

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
  return format(date, "yyyy-MM-dd'T'HH:mm", { awareOfUnicodeTokens: true })
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

export const getDateTime = (val) => {
  if (!val) return ''
  return format(getDateObect(val), "d MMM' at 'H:mm")
}

export const getDate = (val) => {
  if (!val) return ''
  return format(getDateObect(val), 'd MMM')
}

export const getDay = (val) => {
  if (!val) return ''
  return format(getDateObect(val), 'iiii')
}

export const getTime = (val) => {
  if (!val) return ''
  return format(getDateObect(val), 'H:mm')
}

export const openURL = (url) => {
  window.open(url, '_blank')
}

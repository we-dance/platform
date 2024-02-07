import { getStyles } from './dance_styles'

export function slugify(str: string) {
    str = str.replace(/^\s+|\s+$/g, '')

    // Make the string lowercase
    str = str.toLowerCase()

    // Remove accents, swap ñ for n, etc
    const from =
        'ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆÍÌÎÏŇÑÓÖÒÔÕØŘŔŠŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇíìîïňñóöòôõøðřŕšťúůüùûýÿžþÞĐđßÆa·/_,:;'
    const to =
        'AAAAAACCCDEEEEEEEEIIIINNOOOOOORRSTUUUUUYYZaaaaaacccdeeeeeeeeiiiinnooooooorrstuuuuuyyzbBDdBAa......'
    for (let i = 0, l = from.length; i < l; i++) {
        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i))
    }

    // Remove invalid chars
    str = str
        .replace(/[^a-z0-9 -]/g, '')
        // Collapse whitespace and replace by .
        .replace(/\s+/g, '.')
        // Collapse dots
        .replace(/\.+/g, '.')

    return str
}

export function getSuggestedType(description: string) {
    let eventType = 'Party'
  
    const eventTypes = [
      'Course',
      'Workshop',
      'Party',
      'Festival',
      'Congress',
      'Concert',
    ]
  
    for (const e of eventTypes) {
      if (description.toLowerCase().includes(e.toLowerCase())) {
        eventType = e
      }
    }

    return eventType
  }
  
  export function getSuggestedStyles(description: string) {
    if (!description) {
      return {}
    }

    const stylesList: any = getStyles()
    const styles: any = {}
  
    for (const style of stylesList) {
      if (!style.regexp) {
        continue
      }
  
      if (description.toLowerCase().includes(style.regexp.toLowerCase())) {
        styles[style.id] = {
          level: 'Interested',
          highlighted: false,
          selected: true,
        }
      }
    }
  
    return styles
  }
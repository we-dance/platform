import { scrapeFbEvent } from 'facebook-event-scraper'

function getDate(timestamp: any) {
  if (!timestamp) {
    return ''
  }

  return timestamp * 1000
}

export async function getFacebookEvent(url: string) {
  const event = await scrapeFbEvent(url)

  console.log(event)

  return {
    name: event.name,
    description: event.description,
    cover: event.photo?.imageUri,
    startDate: getDate(event.startTimestamp),
    endDate: getDate(event.endTimestamp),
    venue: {
      name: event.location?.name,
      address: event.location?.address,
      url: event.location?.url,
      lat: event.location?.coordinates?.latitude,
      lng: event.location?.coordinates?.longitude,
    },
    link: event.ticketUrl ?? '',
    facebook: event.url,
    type: 'event',
    place: 'ChIJ2V-Mo_l1nkcRfZixfUq4DAE',
    visibility: 'Public',
    form: 'No',
    online: 'No',
    international: 'No',
    claimed: 'No',
    eventType: 'Party',
    duration: 60,
    price: '',
    styles: {},
    artists: [],
    org: {
      name: event.hosts[0]?.name,
      facebook: event.hosts[0]?.url,
      photo: event.hosts[0]?.photo?.imageUri,
      username: event.hosts[0]?.url.replace('https://www.facebook.com/', ''),
    },
    username: 'alexrazbakov',
    program: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'tvR012ArEpQhCJdPHh6G7sLuqoO2',
    updatedBy: 'tvR012ArEpQhCJdPHh6G7sLuqoO2',
    watch: {
      count: 0,
      usernames: [],
    },
  }
}

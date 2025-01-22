import algoliasearch from 'algoliasearch/lite'

// Initialize Algolia client
const client = algoliasearch('JKZMWHRKW6', '43a0f4341904979e375977fc73bbb1dd')
const eventsIndex = client.initIndex('events')
const profilesIndex = client.initIndex('profiles')

interface CityProfile {
  objectID: string
  coordinates: {
    lat: number
    lon: number
  }
  [key: string]: any
}

export interface Tool {
  name: string
  description: string
  input_schema: any
  progress: (input: any) => string
  execute: (...args: any[]) => Promise<string>
}

export const tools: { [key: string]: Tool } = {
  search_events: {
    name: 'search_events',
    progress: (input: { city: string }) =>
      `Searching events in ${input.city}...`,
    description:
      'Search for dance events in a specific city or globally. Returns upcoming events sorted by date.',
    input_schema: {
      type: 'object',
      properties: {
        city: {
          type: 'string',
          description: 'City name to search events in',
        },
      },
      required: ['city'],
    },
    execute: async ({ city }: { city: string }) => {
      try {
        // First find the city profile to get coordinates
        const { hits: cityProfiles } = await profilesIndex.search(city, {
          filters: 'type:City',
          hitsPerPage: 1,
        })

        const searchParams: any = {
          query: '',
          filters: `startDate>${Date.now()}`,
          facets: [
            'type',
            'style',
            'country',
            'locality',
            'venue',
            'organizer',
          ],
          hitsPerPage: 10,
          page: 0,
        }

        const cityProfile = cityProfiles[0] as CityProfile
        if (cityProfile?._geoloc) {
          const { lat, lng } = cityProfile._geoloc
          searchParams.aroundLatLng = `${lat}, ${lng}`
          searchParams.aroundRadius = 50000
        }

        const { hits } = await eventsIndex.search('', searchParams)

        if (!hits.length) {
          return 'No events found matching your criteria.'
        }

        return hits
          .map((event: any) => {
            const date = new Date(event.startDate).toLocaleDateString()
            const location = event.venue || event.locality || 'Location TBA'
            return `${date} - ${event.name}\n${location}\n${
              event.type
            }\n${Object.keys(event?.styles || {}).join(', ') ||
              'All styles'}\nhttps://wedance.vip/events/${event.id}\n---`
          })
          ?.join('\n')
      } catch (error) {
        return `Error searching events: ${(error as Error).message}`
      }
    },
  },
}

export const toolDefinitions = Object.entries(tools).map(([key, tool]) => ({
  name: tool.name,
  description: tool.description,
  input_schema: tool.input_schema,
}))

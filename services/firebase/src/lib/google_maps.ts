import {
  AddressType,
  Client,
  PlaceData,
} from '@googlemaps/google-maps-services-js'

export async function getPlace(name: string, region: string = 'de') {
  const client = new Client({})
  if (!name) {
    return {}
  }

  const response = await client.textSearch({
    params: {
      query: name,
      region,
      key: String(process.env.GOOGLE_MAPS_API_KEY),
    },
  })

  if (!response.data.results.length) {
    return {}
  }

  const place = await client.placeDetails({
    params: {
      place_id: String(response.data.results[0].place_id),
      key: String(process.env.GOOGLE_MAPS_API_KEY),
      fields: [
        'place_id',
        'formatted_address',
        'address_components',
        'geometry',
        'icon',
        'name',
        'url',
        'website',
        'international_phone_number',
      ],
    },
  })

  return place.data.result
}

export async function getCityId(venue: Partial<PlaceData>) {
  if (!venue?.address_components) {
    return ''
  }

  const client = new Client({})

  const name = venue.address_components
    .filter((c) => c.types.includes(AddressType.locality))
    .map((c) => c.long_name)
    .join(' ')

  const response = await client.textSearch({
    params: {
      query: name,
      key: String(process.env.GOOGLE_MAPS_API_KEY),
    },
  })

  if (!response.data.results.length) {
    return ''
  }

  return response.data.results[0].place_id
}

import axios from 'axios'
import loader from './google-loader'

export const getPlusCode = async (address) => {
  const url = 'https://plus.codes/api'
  const language = 'en'
  const key = ''

  return await axios.get(url, { params: { address, key, language } })
}

export const getAddress = (
  places,
  components = ['locality', 'country', 'administrative_area_level_1']
) => {
  if (!places) {
    return {}
  }

  const place = places.find((p) => p.types.includes('locality')) || places[0]

  const result = {}

  for (const componentName of components) {
    const item = place.address_components.find((c) =>
      c.types.includes(componentName)
    )
    if (item) {
      result[componentName] = item.short_name
    }
  }

  result.place_id = place.place_id

  return result
}

export const getGeoCode = async (config) => {
  const google = await loader.load()
  const geocoder = new google.maps.Geocoder()

  const defaults = {
    language: 'en'
  }

  const input = {
    ...defaults,
    ...config
  }

  console.log('getGeoCode', input)

  const promise = new Promise((resolve, reject) => {
    geocoder.geocode(input, (results, status) => {
      if (status !== 'OK') {
        reject(new Error(status))
      }

      resolve(results)
    })
  })

  return await promise
}

export const getPlacePredictions = async (input, types = ['(cities)']) => {
  if (!input) {
    return []
  }

  const google = await loader.load()
  const autocomplete = new google.maps.places.AutocompleteService()

  const promise = new Promise((resolve, reject) => {
    autocomplete.getPlacePredictions(
      {
        input,
        types
      },
      (results, status) => {
        if (status !== 'OK') {
          reject(new Error(status))
        }

        resolve(results)
      }
    )
  })

  return await promise
}

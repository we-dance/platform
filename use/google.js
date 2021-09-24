import axios from 'axios'
import loader from './google-loader'
import { getBrowserLocation } from '~/use/geo'

export const getPlusCode = async (address) => {
  const url = 'https://plus.codes/api'
  const language = 'en'
  const key = ''

  return await axios.get(url, { params: { address, key, language } })
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

export const getAddress = (places) => {
  if (!places) {
    return {}
  }

  const place = places.find((p) => p.types.includes('locality')) || places[0]

  const result = {}

  result.locality = addressPart(place, 'locality')
  result.country = addressPart(place, 'country')
  result.region = addressPart(place, 'administrative_area_level_1')

  if (place.geometry?.location) {
    result.latitude = place.geometry.location.lat()
    result.longitude = place.geometry.location.lng()
  }

  result.place_id = place.place_id

  return result
}

export const getGoogle = async () => {
  const google = await loader.load()

  return google
}

export const getGeoCode = async (config) => {
  const google = await getGoogle()
  const geocoder = new google.maps.Geocoder()

  const defaults = {
    language: 'en',
  }

  const input = {
    ...defaults,
    ...config,
  }

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

export const getLocality = async ({ placeId }) => {
  if (!placeId) {
    return {}
  }

  let results = await getGeoCode({ placeId })

  if (!results.find((p) => p.types.includes('locality')).length) {
    const address = getAddress(results)
    results = await getGeoCode({
      address: `${address.locality}, ${address.country}`,
    })
  }

  return getAddress(results)
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
        types,
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

export const getUserAddress = async () => {
  const location = await getBrowserLocation()
  const lat = location.coords.latitude
  const lng = location.coords.longitude
  const results = await getGeoCode({ location: { lat, lng } })

  return getAddress(results)
}

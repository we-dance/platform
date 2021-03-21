import loader from './google-loader'

export const getPlacePredictions = async (input, types = ['(cities)']) => {
  if (!input) {
    return []
  }

  const google = await loader.load()

  const promise = new Promise((resolve, reject) => {
    const autocomplete = new google.maps.places.AutocompleteService()

    autocomplete.getPlacePredictions(
      {
        input,
        types
      },
      (predictions, status) => {
        if (status !== 'OK') {
          reject(new Error(status))
        }

        resolve(predictions)
      }
    )
  })

  return await promise
}

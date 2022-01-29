import { Loader } from 'google-maps'
import { googleApiKey } from '~/plugins/firebase'

export default new Loader(googleApiKey, {
  libraries: ['places'],
  language: 'en',
})

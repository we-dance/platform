import { Loader } from 'google-maps'

export default new Loader(process.env.firebase.config.apiKey, {
  libraries: ['places'],
  language: 'en',
})

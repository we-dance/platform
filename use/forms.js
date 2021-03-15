import { offerFields } from '~/use/offers'
import { playlistFields } from '~/use/playlists'

export function getFields(collection) {
  if (collection === 'offers') {
    return offerFields
  }

  if (collection === 'playlists') {
    return playlistFields
  }

  return []
}

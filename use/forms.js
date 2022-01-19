import { venueFields } from '~/use/venues'
import { useProfiles } from '~/use/profiles'

export function getFields(collection) {
  if (collection === 'venues') {
    return venueFields
  }

  if (collection === 'profiles') {
    const { profileFields } = useProfiles()

    return profileFields
  }

  return []
}

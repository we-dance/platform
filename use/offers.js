import { genderList } from '~/use/profiles'

export const objectivesList = [
  {
    label: 'Learn together',
    value: 'learn'
  },
  {
    label: 'Dance practice',
    value: 'dance'
  },
  {
    label: 'Dance exchange',
    value: 'exchange'
  }
]

export const days = [
  {
    label: 'Monday at 19:00',
    value: 'Monday'
  },
  {
    label: 'Tuesday at 19:00',
    value: 'Tuesday'
  },
  {
    label: 'Wednesday at 19:00',
    value: 'Wednesday'
  },
  {
    label: 'Thursday at 19:00',
    value: 'Thursday'
  },
  {
    label: 'Friday at 19:00',
    value: 'Friday'
  },
  {
    label: 'Saturday at 19:00',
    value: 'Saturday'
  },
  {
    label: 'Sunday at 19:00',
    value: 'Sunday'
  }
]

export const meetingPlaces = [
  {
    label: 'My place',
    value: 'myPlace'
  },
  {
    label: 'Your place',
    value: 'yourPlace'
  }
]

export const offerFields = [
  {
    name: 'objective',
    label: 'Objective',
    type: 'radio',
    options: objectivesList
  },
  {
    name: 'dance',
    label: 'What?',
    type: 'stylesSelect',
    mineOnly: true,
    hideHighlight: true
  },
  {
    name: 'playlist',
    type: 'collection',
    collection: 'playlists',
    keyLabel: (i, p) => `${i.name} (${p.username})`,
    keyValue: 'id',
    canAdd: true
  },
  {
    name: 'days',
    label: 'When?',
    type: 'multi',
    options: days
  },
  {
    name: 'city',
    label: 'City',
    type: 'collection',
    collection: 'cities',
    keyLabel: (i) => `${i.name}, ${i.location.country}`,
    keyValue: 'name'
  },
  {
    name: 'place',
    label: 'Where?',
    type: 'multi',
    options: meetingPlaces
  },
  {
    name: 'partnerBio',
    label: 'My dance partner is',
    type: 'textarea'
  }
]

export const offerFilters = [
  {
    name: 'city',
    type: 'collection',
    collection: 'cities',
    keyValue: 'name',
    keyLabel: (c) => `${c.name}, ${c.location.country}`,
    clearable: true,
    hideLabel: true,
    placeholder: 'City'
  },
  {
    name: 'dance',
    type: 'style',
    hideLabel: true,
    placeholder: 'Style',
    compare: (item, field, value) =>
      item[field][value] && item[field][value].selected,
    mineOnly: true
  },
  {
    name: 'objective',
    type: 'richselect',
    options: objectivesList,
    hideSearchBox: true,
    clearable: true,
    hideLabel: true,
    placeholder: 'Objective'
  },
  {
    name: 'gender',
    type: 'richselect',
    options: genderList,
    hideSearchBox: true,
    clearable: true,
    hideLabel: true,
    placeholder: 'Gender'
  }
]

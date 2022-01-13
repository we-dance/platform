import { useApp } from '~/use/app'
import { accountFields } from '~/use/accounts'
import { useCollection } from '~/use/collection'

export const genderList = [
  {
    label: 'profile.gender.female',
    value: 'Female',
  },
  {
    label: 'profile.gender.male',
    value: 'Male',
  },
  {
    label: 'profile.gender.other',
    value: 'Other',
  },
]

export const days = [
  {
    label: 'profile.days.monday',
    value: 'Monday',
  },
  {
    label: 'profile.days.tuesday',
    value: 'Tuesday',
  },
  {
    label: 'profile.days.wednesday',
    value: 'Wednesday',
  },
  {
    label: 'profile.days.thursday',
    value: 'Thursday',
  },
  {
    label: 'profile.days.friday',
    value: 'Friday',
  },
  {
    label: 'profile.days.saturday',
    value: 'Saturday',
  },
  {
    label: 'profile.days.sunday',
    value: 'Sunday',
  },
]

export const meetingPlaces = [
  {
    label: 'profile.meetingPlaces.myPlace',
    value: 'myPlace',
  },
  {
    label: 'profile.meetingPlaces.yourPlace',
    value: 'yourPlace',
  },
  {
    label: 'profile.meetingPlaces.somewherePrivate',
    value: 'private',
  },
  {
    label: 'profile.meetingPlaces.somewherePublic',
    value: 'public',
  },
]

export const typeList = [
  {
    label: 'profile.typeList.dancer',
    value: 'Dancer',
  },
  {
    label: 'profile.typeList.artist',
    value: 'Artist',
  },
  {
    label: 'profile.typeList.organiser',
    value: 'Organiser',
  },
  {
    label: 'profile.typeList.venue',
    value: 'Venue',
  },
  {
    label: 'profile.typeList.city',
    value: 'City',
  },
]

export const objectivesList = [
  {
    label: 'Talk about dance',
    value: 'talk',
  },
  {
    label: 'profile.objectivesList.talk',
    value: 'learn',
  },
  {
    label: 'profile.objectivesList.outdoors',
    value: 'outdoors',
  },
  {
    label: 'profile.objectivesList.indoors',
    value: 'indoors',
  },
  {
    label: 'profile.objectivesList.teach',
    value: 'teach',
  },
  {
    label: 'profile.objectivesList.project',
    value: 'project',
  },
]

export const contactFields = [
  {
    name: 'instagram',
    key: 'profile.contacts.instagram',
    placeholder: 'profile.placeholder.username',
    when: (p) => p.contacts === 'Yes',
  },
  {
    name: 'facebook',
    key: 'profile.contacts.facebook',
    placeholder: 'profile.placeholder.username',
    when: (p) => p.contacts === 'Yes',
  },
  {
    name: 'whatsapp',
    key: 'profile.contacts.whatsapp',
    placeholder: 'profile.placeholder.whatsapp',
    when: (p) => p.contacts === 'Yes',
  },
  {
    name: 'telegram',
    key: 'profile.contacts.telegram',
    placeholder: 'profile.placeholder.username',
    when: (p) => p.contacts === 'Yes',
  },
  {
    name: 'twitter',
    key: 'profile.contacts.twitter',
    placeholder: 'profile.placeholder.username',
    when: (p) => p.contacts === 'Yes',
  },
  {
    name: 'tiktok',
    key: 'profile.contacts.tiktok',
    placeholder: 'profile.placeholder.username',
    when: (p) => p.contacts === 'Yes',
  },
  {
    name: 'youtube',
    key: 'profile.contacts.youtube',
    placeholder: 'placeholder.username',
    when: (p) => p.contacts === 'Yes',
  },
  {
    name: 'email',
    key: 'profile.contacts.email',
    placeholder: 'profile.placeholder.business',
    when: (p) => p.contacts === 'Yes',
  },
  {
    name: 'website',
    key: 'profile.contacts.website',
    placeholder: 'profile.placeholder.business',
    when: (p) => p.contacts === 'Yes',
  },
]

export const visibilityOptions = [
  {
    label: 'Public',
    value: 'Public',
  },
  {
    label: 'Members',
    value: 'Members',
  },
  {
    label: 'Unlisted',
    value: 'Unlisted',
  },
]

export const booleanOptions = [
  {
    label: 'Yes',
    value: 'Yes',
  },
  {
    label: 'No',
    value: 'No',
  },
]

export const profileFields = [
  {
    name: 'photo',
    key: 'profile.photo',
    poster: true,
    type: 'photo',
  },
  {
    name: 'styles',
    key: 'profile.dances',
    labelPosition: 'top',
    poster: true,
    type: 'stylesSelect',
    tips: 'profile.tips.styles',
  },
  {
    name: 'gender',
    key: 'profile.gender',
    type: 'buttons',
    hideSearchBox: true,
    poster: true,
    options: genderList,
  },
  {
    name: 'type',
    key: 'profile.type',
    type: 'radio',
    hideSearchBox: true,
    poster: true,
    options: typeList,
  },
  {
    name: 'username',
    key: 'profile.username',
    register: true,
    poster: true,
    required: true,
    type: 'username',
    before: 'profile.before.username',
  },
  {
    name: 'place',
    key: 'profile.your-city',
    register: true,
    poster: true,
    required: true,
    type: 'place',
    placeholder: 'profile.placeholder.city',
  },
  {
    name: 'hometown',
    key: 'profile.hometown',
    required: true,
    type: 'place',
    before: 'profile.before.hometown',
  },
  {
    name: 'visibility',
    key: 'profile.visibility',
    poster: true,
    type: 'buttons',
    options: visibilityOptions,
    description: 'profile.description.visibility',
  },
  {
    name: 'permission',
    key: 'profile.permission',
    poster: true,
    type: 'buttons',
    options: booleanOptions,
    description: 'profile.description.permission',
  },
  {
    name: 'name',
    key: 'profile.name',
    required: true,
    placeholder: 'profile.placeholder.required',
    before: 'profile.before.name',
  },
  {
    name: 'locales',
    key: 'profile.languages',
    type: 'languages',
  },
  {
    name: 'objectives',
    key: 'profile.objectives',
    type: 'multi',
    options: objectivesList,
  },
  {
    name: 'bio',
    key: 'profile.bio',
    poster: true,
    type: 'textarea',
    labelPosition: 'top',
    before: 'profile.before.bio',
    max: 140,
  },
  {
    name: 'story',
    key: 'profile.story',
    type: 'textarea',
    labelPosition: 'top',
    placeholder: 'profile.placeholder.markdown',
    before: 'profile.before.story',
    tips: 'profile.tips.story',
  },
  {
    name: 'learning',
    key: 'profile.topics',
    type: 'textarea',
    description: 'profile.description.learning',
  },
  {
    name: 'jobs',
    key: 'profile.jobs',
    type: 'textarea',
    description: 'profile.description.jobs',
  },
  {
    name: 'partner',
    key: 'profile.partner',
    type: 'buttons',
    options: booleanOptions,
  },
  {
    name: 'birthday',
    key: 'profile.birthday',
    when: (p) => p.partner === 'Yes',
    type: 'date',
    description: 'profile.description.birthday',
  },
  {
    name: 'height',
    key: 'profile.height',
    when: (p) => p.partner === 'Yes',
  },
  {
    name: 'weight',
    key: 'profile.weight',
    when: (p) => p.partner === 'Yes',
    description: 'profile.description.weight',
  },
  {
    name: 'partnerBio',
    key: 'Question',
    when: (p) => p.partner === 'Yes',
    type: 'textarea',
    description: 'profile.description.partnerBio',
  },
  {
    name: 'meetingPlace',
    key: 'profile.place',
    when: (p) => p.partner === 'Yes',
    type: 'multi',
    options: meetingPlaces,
  },
  {
    name: 'days',
    key: 'profile.days',
    when: (p) => p.partner === 'Yes',
    type: 'multi',
    options: days,
  },
  {
    name: 'contacts',
    key: 'profile.contacts',
    type: 'buttons',
    options: booleanOptions,
  },
  ...contactFields,
]

const profilePosterFields = profileFields.filter((f) => f.poster)
const profileDetailFields = profileFields.filter((f) => !f.poster)

export const registerFields = [
  ...accountFields.filter((f) => f.register),
  ...profileFields.filter((f) => f.register),
]

export const profileFilters = [
  {
    name: 'place',
    type: 'place',
    clearable: true,
    hideLabel: true,
    placeholder: 'profile.placeholder.city',
  },
  {
    name: 'dance',
    type: 'style',
    hideLabel: true,
    placeholder: 'profile.placeholder.style',
    compare: (item, field, value) =>
      item && item[field] && item[field][value] && item[field][value].selected,
    mineOnly: true,
  },
  {
    name: 'objective',
    type: 'richselect',
    options: objectivesList,
    hideSearchBox: true,
    clearable: true,
    hideLabel: true,
    placeholder: 'profile.placeholder.objective',
  },
  {
    name: 'gender',
    type: 'richselect',
    options: genderList,
    hideSearchBox: true,
    clearable: true,
    hideLabel: true,
    placeholder: 'profile.placeholder.gender',
  },
]

export const profileSorts = [
  {
    value: 'username',
    label: 'profile.profileSorts.username',
  },
  {
    value: '-createdAt',
    label: 'profile.profileSorts.registered',
  },
  {
    value: '-lastLoginAt',
    label: 'profile.profileSorts.last-seen',
  },
]

export const useProfiles = () => {
  const { read, loading } = useApp()
  const { getById } = useCollection('profiles')

  const getFullProfile = (uid) => getById(uid) || {}
  const getProfile = (uid) => read('profiles', uid) || {}

  return {
    getProfile,
    getFullProfile,
    profileFields,
    profilePosterFields,
    profileDetailFields,
    contactFields,
    loading,
    objectivesList,
    typeList,
    genderList,
  }
}

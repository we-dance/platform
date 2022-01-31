import { useI18n } from '~/use/i18n'
import { useApp } from '~/use/app'
import { useAccounts } from '~/use/accounts'
import { useCollection } from '~/use/collection'
import { useCommon } from '~/use/common'

export const useProfiles = () => {
  const { t } = useI18n()
  const { accountFields } = useAccounts()
  const { booleanOptions } = useCommon()

  const { read, loading } = useApp()
  const { getById } = useCollection('profiles')

  const getFullProfile = (uid) => getById(uid) || {}
  const getProfile = (uid) => read('profiles', uid) || {}

  const genderList = [
    {
      label: t('profile.genderList.female'),
      value: 'Female',
    },
    {
      label: t('profile.genderList.male'),
      value: 'Male',
    },
    {
      label: t('profile.genderList.other'),
      value: 'Other',
    },
  ]

  const days = [
    {
      label: t('profile.daysList.monday'),
      value: 'Monday',
    },
    {
      label: t('profile.daysList.tuesday'),
      value: 'Tuesday',
    },
    {
      label: t('profile.daysList.wednesday'),
      value: 'Wednesday',
    },
    {
      label: t('profile.daysList.thursday'),
      value: 'Thursday',
    },
    {
      label: t('profile.daysList.friday'),
      value: 'Friday',
    },
    {
      label: t('profile.daysList.saturday'),
      value: 'Saturday',
    },
    {
      label: t('profile.daysList.sunday'),
      value: 'Sunday',
    },
  ]

  const meetingPlaces = [
    {
      label: t('profile.meetingPlaces.myPlace'),
      value: 'myPlace',
    },
    {
      label: t('profile.meetingPlaces.yourPlace'),
      value: 'yourPlace',
    },
    {
      label: t('profile.meetingPlaces.private'),
      value: 'private',
    },
    {
      label: t('profile.meetingPlaces.public'),
      value: 'public',
    },
  ]

  const typeList = [
    {
      label: t('profile.typeList.dancer'),
      value: 'Dancer',
    },
    {
      label: t('profile.typeList.artist'),
      value: 'Artist',
    },
    {
      label: t('profile.typeList.organiser'),
      value: 'Organiser',
    },
    {
      label: t('profile.typeList.venue'),
      value: 'Venue',
    },
    {
      label: t('profile.typeList.city'),
      value: 'City',
    },
  ]

  const objectivesList = [
    {
      label: t('profile.objectivesList.talk'),
      value: 'talk',
    },
    {
      label: t('profile.objectivesList.learn'),
      value: 'learn',
    },
    {
      label: t('profile.objectivesList.outdoors'),
      value: 'outdoors',
    },
    {
      label: t('profile.objectivesList.indoors'),
      value: 'indoors',
    },
    {
      label: t('profile.objectivesList.teach'),
      value: 'teach',
    },
    {
      label: t('profile.objectivesList.project'),
      value: 'project',
    },
  ]

  const contactFields = [
    {
      name: 'instagram',
      label: t('profile.instagram.label'),
      placeholder: t('profile.instagram.placeholder'),
      when: (p) => p.contacts === 'Yes',
    },
    {
      name: 'facebook',
      label: t('profile.facebook.label'),
      placeholder: t('profile.facebook.placeholder'),
      when: (p) => p.contacts === 'Yes',
    },
    {
      name: 'whatsapp',
      label: t('profile.whatsapp.label'),
      placeholder: t('profile.whatsapp.placeholder'),
      when: (p) => p.contacts === 'Yes',
    },
    {
      name: 'telegram',
      label: t('profile.telegram.label'),
      placeholder: t('profile.telegram.placeholder'),
      when: (p) => p.contacts === 'Yes',
    },
    {
      name: 'twitter',
      label: t('profile.twitter.label'),
      placeholder: t('profile.twitter.placeholder'),
      when: (p) => p.contacts === 'Yes',
    },
    {
      name: 'tiktok',
      label: t('profile.tiktok.label'),
      placeholder: t('profile.tiktok.placeholder'),
      when: (p) => p.contacts === 'Yes',
    },
    {
      name: 'youtube',
      label: t('profile.youtube.label'),
      placeholder: t('profile.youtube.placeholder'),
      when: (p) => p.contacts === 'Yes',
    },
    {
      name: 'email',
      label: t('profile.email.label'),
      placeholder: t('profile.email.placeholder'),
      when: (p) => p.contacts === 'Yes',
    },
    {
      name: 'website',
      label: t('profile.website.label'),
      placeholder: t('profile.website.placeholder'),
      when: (p) => p.contacts === 'Yes',
    },
  ]

  const visibilityOptions = [
    {
      label: t('profile.visibilityOptions.public'),
      value: 'Public',
    },
    {
      label: t('profile.visibilityOptions.members'),
      value: 'Members',
    },
    {
      label: t('profile.visibilityOptions.unlisted'),
      value: 'Unlisted',
    },
  ]

  const profileFields = [
    {
      name: 'photo',
      label: t('profile.photo'),
      poster: true,
      type: 'photo',
    },
    {
      name: 'styles',
      label: t('profile.styles.label'),
      labelPosition: 'top',
      poster: true,
      type: 'stylesSelect',
      tips: t('profile.styles.tips'),
    },
    {
      name: 'gender',
      label: t('profile.gender.label'),
      type: 'buttons',
      hideSearchBox: true,
      poster: true,
      options: genderList,
    },
    {
      name: 'type',
      label: t('profile.type'),
      type: 'radio',
      hideSearchBox: true,
      poster: true,
      options: typeList,
    },
    {
      name: 'username',
      label: t('profile.username.label'),
      register: true,
      poster: true,
      required: true,
      type: 'username',
      before: t('profile.username.before'),
    },
    {
      name: 'place',
      label: t('profile.place.label'),
      register: true,
      poster: true,
      required: true,
      type: 'place',
      placeholder: t('profile.place.placeholder'),
    },
    {
      name: 'hometown',
      label: t('profile.hometown.label'),
      required: true,
      type: 'place',
      before: t('profile.hometown.before'),
    },
    {
      name: 'visibility',
      label: t('profile.visibility.label'),
      poster: true,
      type: 'buttons',
      options: visibilityOptions,
      description: t('profile.visibility.description'),
    },
    {
      name: 'permission',
      label: t('profile.permission.label'),
      poster: true,
      type: 'buttons',
      options: booleanOptions,
      description: t('profile.permission.description'),
    },
    {
      name: 'name',
      label: t('profile.name.label'),
      required: true,
      placeholder: t('profile.name.placeholder'),
      before: t('profile.name.before'),
    },
    {
      name: 'locales',
      label: t('profile.locales'),
      type: 'languages',
    },
    {
      name: 'objectives',
      label: t('profile.objectives'),
      type: 'multi',
      options: objectivesList,
    },
    {
      name: 'bio',
      label: t('profile.bio.label'),
      poster: true,
      type: 'textarea',
      labelPosition: 'top',
      before: t('profile.bio.before'),
      max: 140,
    },
    {
      name: 'story',
      label: t('profile.story.label'),
      type: 'textarea',
      labelPosition: 'top',
      placeholder: t('profile.story.placeholder'),
      before: t('profile.story.before'),
      tips: t('profile.story.tips'),
    },
    {
      name: 'learning',
      label: t('profile.learning.label'),
      type: 'textarea',
      description: t('profile.learning.description'),
    },
    {
      name: 'jobs',
      label: t('profile.jobs.label'),
      type: 'textarea',
      description: t('profile.jobs.description'),
    },
    {
      name: 'partner',
      label: t('profile.partner'),
      type: 'buttons',
      options: booleanOptions,
    },
    {
      name: 'birthday',
      label: t('profile.birthday.label'),
      when: (p) => p.partner === 'Yes',
      type: 'date',
      description: t('profile.birthday.description'),
    },
    {
      name: 'height',
      label: t('profile.height'),
      when: (p) => p.partner === 'Yes',
    },
    {
      name: 'weight',
      label: t('profile.weight.label'),
      when: (p) => p.partner === 'Yes',
      description: t('profile.weight.description'),
    },
    {
      name: 'partnerBio',
      label: t('profile.partnerBio.label'),
      when: (p) => p.partner === 'Yes',
      type: 'textarea',
      description: t('profile.partnerBio.description'),
    },
    {
      name: 'meetingPlace',
      label: t('profile.meetingPlace'),
      when: (p) => p.partner === 'Yes',
      type: 'multi',
      options: meetingPlaces,
    },
    {
      name: 'days',
      label: t('profile.days'),
      when: (p) => p.partner === 'Yes',
      type: 'multi',
      options: days,
    },
    {
      name: 'contacts',
      label: t('profile.contacts'),
      type: 'buttons',
      options: booleanOptions,
    },
    ...contactFields,
  ]

  const profilePosterFields = profileFields.filter((f) => f.poster)
  const profileDetailFields = profileFields.filter((f) => !f.poster)

  const registerFields = [
    ...accountFields.filter((f) => f.register),
    ...profileFields.filter((f) => f.register),
  ]

  const profileFilters = [
    {
      name: 'place',
      type: 'place',
      clearable: true,
      hideLabel: true,
      placeholder: t('profile.place.placeholder'),
    },
    {
      name: 'dance',
      type: 'style',
      hideLabel: true,
      placeholder: t('profile.dance.placeholder'),
      compare: (item, field, value) =>
        item &&
        item[field] &&
        item[field][value] &&
        item[field][value].selected,
      mineOnly: true,
    },
    {
      name: 'objective',
      type: 'richselect',
      options: objectivesList,
      hideSearchBox: true,
      clearable: true,
      hideLabel: true,
      placeholder: t('profile.objective.placeholder'),
    },
    {
      name: 'gender',
      type: 'richselect',
      options: genderList,
      hideSearchBox: true,
      clearable: true,
      hideLabel: true,
      placeholder: t('profile.gender.placeholder'),
    },
  ]

  const profileSorts = [
    {
      value: 'username',
      label: t('profile.profileSorts.username'),
    },
    {
      value: '-createdAt',
      label: t('profile.profileSorts.registered'),
    },
    {
      value: '-lastLoginAt',
      label: t('profile.profileSorts.lastSeen'),
    },
  ]

  const radiusOptions = [
    {
      label: t('profile.radiusOptions.ten'),
      value: 10,
    },
    {
      label: t('profile.radiusOptions.twenty'),
      value: 20,
    },
    {
      label: t('profile.radiusOptions.fifty'),
      value: 50,
    },
    {
      label: t('profile.radiusOptions.hundred'),
      value: 100,
    },
    {
      label: t('profile.radiusOptions.fiveHundred'),
      value: 500,
    },
    {
      label: t('profile.radiusOptions.thousand'),
      value: 1000,
    },
    {
      label: t('profile.radiusOptions.anywhere'),
      value: '',
    },
  ]

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
    radiusOptions,
    registerFields,
    profileFilters,
    profileSorts,
  }
}

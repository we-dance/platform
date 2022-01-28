import { useI18n } from '~/use/i18n'
import { useApp } from '~/use/app'
import { useAccounts } from '~/use/accounts'
import { useCollection } from '~/use/collection'

export const useProfiles = () => {
  const { t } = useI18n()
  const { accountFields } = useAccounts()

  const { read, loading } = useApp()
  const { getById } = useCollection('profiles')

  const getFullProfile = (uid) => getById(uid) || {}
  const getProfile = (uid) => read('profiles', uid) || {}

  const genderList = [
    {
      label: t('profiles.genderList.female'),
      value: 'Female',
    },
    {
      label: t('profiles.genderList.male'),
      value: 'Male',
    },
    {
      label: t('profiles.genderList.female'),
      value: 'Other',
    },
  ]

  const days = [
    {
      label: t('profiles.daysList.monday'),
      value: 'Monday',
    },
    {
      label: t('profiles.daysList.tuesday'),
      value: 'Tuesday',
    },
    {
      label: t('profiles.daysList.wednesday'),
      value: 'Wednesday',
    },
    {
      label: t('profiles.daysList.thursday'),
      value: 'Thursday',
    },
    {
      label: t('profiles.daysList.friday'),
      value: 'Friday',
    },
    {
      label: t('profiles.daysList.saturday'),
      value: 'Saturday',
    },
    {
      label: t('profiles.daysList.sunday'),
      value: 'Sunday',
    },
  ]

  const meetingPlaces = [
    {
      label: t('profiles.meetingPlaces.myPlace'),
      value: 'myPlace',
    },
    {
      label: t('profiles.meetingPlaces.yourPlace'),
      value: 'yourPlace',
    },
    {
      label: t('profiles.meetingPlaces.private'),
      value: 'private',
    },
    {
      label: t('profiles.meetingPlaces.public'),
      value: 'public',
    },
  ]

  const typeList = [
    {
      label: t('profiles.typeList.dancer'),
      value: 'Dancer',
    },
    {
      label: t('profiles.typeList.artist'),
      value: 'Artist',
    },
    {
      label: t('profiles.typeList.organiser'),
      value: 'Organiser',
    },
    {
      label: t('profiles.typeList.venue'),
      value: 'Venue',
    },
    {
      label: t('profiles.typeList.city'),
      value: 'City',
    },
  ]

  const objectivesList = [
    {
      label: t('profiles.objectivesList.talk'),
      value: 'talk',
    },
    {
      label: t('profiles.objectivesList.learn'),
      value: 'learn',
    },
    {
      label: t('profiles.objectivesList.outdoors'),
      value: 'outdoors',
    },
    {
      label: t('profiles.objectivesList.indoors'),
      value: 'indoors',
    },
    {
      label: t('profiles.objectivesList.teach'),
      value: 'teach',
    },
    {
      label: t('profiles.objectivesList.project'),
      value: 'project',
    },
  ]

  const contactFields = [
    {
      name: 'instagram',
      label: t('profiles.contactFields.instagram'),
      placeholder: t('profiles.placeholder.username'),
      when: (p) => p.contacts === 'Yes',
    },
    {
      name: 'facebook',
      label: t('profiles.contactFields.facebook'),
      placeholder: t('profiles.placeholder.username'),
      when: (p) => p.contacts === 'Yes',
    },
    {
      name: 'whatsapp',
      label: t('profiles.contactFields.whatsapp'),
      placeholder: t('profiles.placeholder.whatsapp'),
      when: (p) => p.contacts === 'Yes',
    },
    {
      name: 'telegram',
      label: t('profiles.contactFields.telegram'),
      placeholder: t('profiles.placeholder.username'),
      when: (p) => p.contacts === 'Yes',
    },
    {
      name: 'twitter',
      label: t('profiles.contactFields.twitter'),
      placeholder: t('profiles.placeholder.username'),
      when: (p) => p.contacts === 'Yes',
    },
    {
      name: 'tiktok',
      label: t('profiles.contactFields.tiktok'),
      placeholder: t('profiles.placeholder.username'),
      when: (p) => p.contacts === 'Yes',
    },
    {
      name: 'youtube',
      label: t('profiles.contactFields.youtube'),
      placeholder: t('profiles.placeholder.username'),
      when: (p) => p.contacts === 'Yes',
    },
    {
      name: 'email',
      label: t('profiles.contactFields.email'),
      placeholder: t('profiles.placeholder.business'),
      when: (p) => p.contacts === 'Yes',
    },
    {
      name: 'website',
      label: t('profiles.contactFields.website'),
      placeholder: t('profiles.placeholder.business'),
      when: (p) => p.contacts === 'Yes',
    },
  ]

  const visibilityOptions = [
    {
      label: t('profiles.visibilityOptions.public'),
      value: 'Public',
    },
    {
      label: t('profiles.visibilityOptions.members'),
      value: 'Members',
    },
    {
      label: t('profiles.visibilityOptions.unlisted'),
      value: 'Unlisted',
    },
  ]

  const booleanOptions = [
    {
      label: t('profiles.booleanOptions.yes'),
      value: 'Yes',
    },
    {
      label: t('profiles.booleanOptions.no'),
      value: 'No',
    },
  ]

  const profileFields = [
    {
      name: 'photo',
      label: t('profiles.photo'),
      poster: true,
      component: 'TInputPhoto',
    },
    {
      name: 'styles',
      label: t('profiles.styles'),
      labelPosition: 'top',
      poster: true,
      component: 'TInputStylesSelect2',
      tips: t('profiles.tips.styles'),
    },
    {
      name: 'gender',
      label: t('profiles.gender'),
      component: 'TInputButtons',
      hideSearchBox: true,
      poster: true,
      options: genderList,
    },
    {
      name: 'type',
      label: t('profiles.type'),
      component: 'TRadioGroup',
      hideSearchBox: true,
      poster: true,
      options: typeList,
    },
    {
      name: 'username',
      label: t('profiles.username'),
      register: true,
      poster: true,
      required: true,
      component: 'TInputUsername',
      before: t('profiles.before.username'),
    },
    {
      name: 'place',
      label: t('profiles.place'),
      register: true,
      poster: true,
      required: true,
      component: 'TInputPlace',
      placeholder: t('profiles.placeholder.place'),
    },
    {
      name: 'hometown',
      label: t('profiles.hometown'),
      required: true,
      component: 'TInputPlace',
      before: t('profiles.before.hometown'),
    },
    {
      name: 'visibility',
      label: t('profiles.visibility'),
      poster: true,
      component: 'TInputButtons',
      options: visibilityOptions,
      description: t('profiles.description.visibility'),
    },
    {
      name: 'permission',
      label: t('profiles.permission'),
      poster: true,
      component: 'TInputButtons',
      options: booleanOptions,
      description: t('profiles.description.permission'),
    },
    {
      name: 'name',
      label: t('profiles.name'),
      required: true,
      placeholder: t('profiles.placeholder.required'),
      before: t('profiles.before.name'),
    },
    {
      name: 'locales',
      label: t('profiles.locales'),
      component: 'TInputLanguages',
    },
    {
      name: 'objectives',
      label: t('profiles.objectives'),
      component: 'TInputMulti',
      options: objectivesList,
    },
    {
      name: 'bio',
      label: t('profiles.bio'),
      poster: true,
      component: 'TInputTextarea',
      labelPosition: 'top',
      before: t('profiles.before.bio'),
      max: 140,
    },
    {
      name: 'story',
      label: t('profiles.story'),
      component: 'TInputTextarea',
      labelPosition: 'top',
      placeholder: t('profiles.placeholder.story'),
      before: t('profiles.before.story'),
      tips: t('profiles.tips.story'),
    },
    {
      name: 'learning',
      label: t('profiles.learning'),
      component: 'TInputTextarea',
      description: t('profiles.description.learning'),
    },
    {
      name: 'jobs',
      label: t('profiles.jobs'),
      component: 'TInputTextarea',
      description: t('profiles.description.jobs'),
    },
    {
      name: 'partner',
      label: t('profiles.partner'),
      component: 'TInputButtons',
      options: booleanOptions,
    },
    {
      name: 'birthday',
      label: t('profiles.birthday'),
      when: (p) => p.partner === 'Yes',
      type: 'date',
      description: 'We will show only your age',
    },
    {
      name: 'height',
      label: t('profiles.height'),
      when: (p) => p.partner === 'Yes',
    },
    {
      name: 'weight',
      label: t('profiles.weight'),
      when: (p) => p.partner === 'Yes',
      description: t('profiles.description.weight'),
    },
    {
      name: 'partnerBio',
      label: t('profiles.partnerBio'),
      when: (p) => p.partner === 'Yes',
      component: 'TInputTextarea',
      description: t('profiles.description.partnerBio'),
    },
    {
      name: 'meetingPlace',
      label: t('profiles.meetingPlace'),
      when: (p) => p.partner === 'Yes',
      component: 'TInputMulti',
      options: meetingPlaces,
    },
    {
      name: 'days',
      label: t('profiles.days'),
      when: (p) => p.partner === 'Yes',
      component: 'TInputMulti',
      options: days,
    },
    {
      name: 'contacts',
      label: t('profiles.contacts'),
      component: 'TInputButtons',
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
      component: 'TInputPlace',
      clearable: true,
      hideLabel: true,
      placeholder: t('profiles.placeholder.place'),
    },
    {
      name: 'dance',
      component: 'TInputStyle',
      hideLabel: true,
      placeholder: t('profiles.placeholder.dance'),
      compare: (item, field, value) =>
        item &&
        item[field] &&
        item[field][value] &&
        item[field][value].selected,
      mineOnly: true,
    },
    {
      name: 'objective',
      component: 'TRichSelect',
      options: objectivesList,
      hideSearchBox: true,
      clearable: true,
      hideLabel: true,
      placeholder: t('profiles.placeholder.objective'),
    },
    {
      name: 'gender',
      component: 'TRichSelect',
      options: genderList,
      hideSearchBox: true,
      clearable: true,
      hideLabel: true,
      placeholder: t('profiles.placeholder.gender'),
    },
  ]

  const profileSorts = [
    {
      value: 'username',
      label: t('profiles.profileSorts.username'),
    },
    {
      value: '-createdAt',
      label: t('profiles.profileSorts.registered'),
    },
    {
      value: '-lastLoginAt',
      label: t('profiles.profileSorts.lastSeen'),
    },
  ]

  const radiusOptions = [
    {
      label: t('profiles.radiusOptions.ten'),
      value: 10,
    },
    {
      label: t('profiles.radiusOptions.twenty'),
      value: 20,
    },
    {
      label: t('profiles.radiusOptions.fifty'),
      value: 50,
    },
    {
      label: t('profiles.radiusOptions.hundred'),
      value: 100,
    },
    {
      label: t('profiles.radiusOptions.fiveHundred'),
      value: 500,
    },
    {
      label: t('profiles.radiusOptions.thousand'),
      value: 1000,
    },
    {
      label: t('profiles.radiusOptions.anywhere'),
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

import { useI18n } from '~/use/i18n'
import { useApp } from '~/use/app'
import { useAccounts } from '~/use/accounts'
import { useCollection } from '~/use/collection'
import { useCommon } from '~/use/common'

export const useProfiles = () => {
  const { t } = useI18n()
  const { accountFields } = useAccounts()
  const { yesNoOptions, visibilityOptions, genderList, days } = useCommon()

  const { read, loading } = useApp()
  const { getById } = useCollection('profiles')

  const getFullProfile = (uid) => getById(uid) || {}
  const getProfile = (uid) => read('profiles', uid) || {}

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
      label: t('profile.typeList.organiser'),
      value: 'Organiser',
    },
    {
      label: t('profile.typeList.venue'),
      value: 'Venue',
    },
    {
      label: t('profile.typeList.artist'),
      value: 'Artist',
    },
    {
      label: t('profile.typeList.dancer'),
      value: 'Dancer',
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
      label: t('profile.objectivesList.home'),
      value: 'home',
    },
    {
      label: t('profile.objectivesList.auto'),
      value: 'auto',
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
      name: 'couchsurfing',
      label: 'Couchsurfing',
      placeholder: 'https://www.couchsurfing.com/people/username',
    },
    {
      name: 'airbnb',
      label: 'Airbnb',
      placeholder: 'https://www.airbnb.com/users/show/00000000',
    },
    {
      name: 'blablacar',
      label: 'BlaBlaCar',
      placeholder:
        'https://www.blablacar.de/user/show/00000000-0000-0000-0000-000000000000',
    },
    {
      name: 'spotify',
      label: 'Spotify',
      placeholder: 'https://open.spotify.com/user/000000000000000000000000',
    },
    {
      name: 'instagram',
      label: 'Instagram',
      placeholder: 'https://www.instagram.com/username/',
    },
    {
      name: 'facebook',
      label: 'Facebook',
      placeholder: 'https://www.facebook.com/username',
    },
    {
      name: 'whatsapp',
      label: 'Whatsapp',
      placeholder: 'https://wa.me/0000000000000',
    },
    {
      name: 'telegram',
      label: 'Telegram',
      placeholder: 'https://t.me/username',
    },
    {
      name: 'twitter',
      label: 'Twitter',
      placeholder: 'https://twitter.com/username',
    },
    {
      name: 'tiktok',
      label: 'TikTok',
      placeholder: 'https://www.tiktok.com/@username',
    },
    {
      name: 'youtube',
      label: 'Youtube',
      placeholder: 'https://www.youtube.com/c/username',
    },
    {
      name: 'email',
      label: 'Email',
      placeholder: 'name@example.com',
    },
    {
      name: 'website',
      label: 'Website',
      placeholder: 'https://www.example.com/',
    },
  ]

  const profileFields = [
    {
      name: 'photo',
      label: t('profile.photo'),
      poster: true,
      component: 'TInputPhoto',
    },
    {
      name: 'styles',
      label: t('profile.styles.label'),
      labelPosition: 'top',
      poster: true,
      component: 'TInputStylesSelect2',
      tips: t('profile.styles.tips'),
    },
    {
      name: 'gender',
      label: t('profile.gender.label'),
      component: 'TInputButtons',
      hideSearchBox: true,
      poster: true,
      options: genderList,
    },
    {
      name: 'type',
      label: t('profile.type'),
      component: 'TRadioGroup',
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
      component: 'TInputUsername',
      before: t('profile.username.before'),
    },
    {
      name: 'current',
      label: t('profile.current.label'),
      register: true,
      poster: true,
      required: true,
      component: 'TInputPlace',
      before: t('profile.current.before'),
    },
    {
      name: 'place',
      label: t('profile.place.label'),
      register: true,
      poster: true,
      required: true,
      component: 'TInputPlace',
      before: t('profile.place.before'),
    },
    {
      name: 'hometown',
      label: t('profile.hometown.label'),
      required: true,
      component: 'TInputPlace',
      before: t('profile.hometown.before'),
    },
    {
      name: 'visibility',
      label: t('visibility.label'),
      poster: true,
      component: 'TInputButtons',
      options: visibilityOptions,
      description: t('visibility.description'),
    },
    {
      name: 'permission',
      label: t('profile.permission.label'),
      poster: true,
      component: 'TInputButtons',
      options: yesNoOptions,
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
      component: 'TInputLanguages',
    },
    {
      name: 'objectives',
      label: t('profile.objectives'),
      component: 'TInputMulti',
      options: objectivesList,
    },
    {
      name: 'bio',
      label: t('profile.bio.label'),
      poster: true,
      component: 'TInputTextarea',
      labelPosition: 'top',
      before: t('profile.bio.before'),
      max: 140,
    },
    {
      name: 'story',
      label: t('profile.story.label'),
      component: 'TInputTextarea',
      labelPosition: 'top',
      placeholder: t('profile.story.placeholder'),
      before: t('profile.story.before'),
      tips: t('profile.story.tips'),
    },
    {
      name: 'learning',
      label: t('profile.learning.label'),
      component: 'TInputTextarea',
      description: t('profile.learning.description'),
    },
    {
      name: 'jobs',
      label: t('profile.jobs.label'),
      component: 'TInputTextarea',
      description: t('profile.jobs.description'),
    },
    {
      name: 'partner',
      label: t('profile.partner'),
      component: 'TInputButtons',
      options: yesNoOptions,
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
      component: 'TInputTextarea',
      description: t('profile.partnerBio.description'),
    },
    {
      name: 'meetingPlace',
      label: t('profile.meetingPlace'),
      when: (p) => p.partner === 'Yes',
      component: 'TInputMulti',
      options: meetingPlaces,
    },
    {
      name: 'days',
      label: t('profile.days'),
      when: (p) => p.partner === 'Yes',
      component: 'TInputMulti',
      options: days,
    },
    ...contactFields,
    {
      name: 'team',
      component: 'TInputArray',
      children: {
        component: 'TInputProfile',
      },
      label: t('profile.team'),
      labelPosition: 'top',
    },
    {
      name: 'reviews',
      component: 'TInputArray',
      children: {
        component: 'TInputReview',
      },
      label: t('reviews.title'),
      labelPosition: 'top',
    },
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
      placeholder: t('profile.place.placeholder'),
    },
    {
      name: 'dance',
      component: 'TInputStyle',
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
      component: 'TRichSelect',
      options: objectivesList,
      hideSearchBox: true,
      clearable: true,
      hideLabel: true,
      placeholder: t('profile.objective.placeholder'),
    },
    {
      name: 'gender',
      component: 'TRichSelect',
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
      label: t('radiusOptions.ten'),
      value: 10,
    },
    {
      label: t('radiusOptions.twenty'),
      value: 20,
    },
    {
      label: t('radiusOptions.fifty'),
      value: 50,
    },
    {
      label: t('radiusOptions.hundred'),
      value: 100,
    },
    {
      label: t('radiusOptions.fiveHundred'),
      value: 500,
    },
    {
      label: t('radiusOptions.thousand'),
      value: 1000,
    },
    {
      label: t('radiusOptions.anywhere'),
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

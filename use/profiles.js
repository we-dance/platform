import { useI18n } from '~/use/i18n'
import { useApp } from '~/use/app'
import { useAccounts } from '~/use/accounts'
import { useCommon } from '~/use/common'
import { useDoc } from '~/use/doc'
import { db } from '~/plugins/firebase'

export const useProfiles = () => {
  const { t } = useI18n()
  const { accountFields } = useAccounts()
  const { genderList } = useCommon()

  const { read, loading } = useApp()
  const { load } = useDoc('profiles')

  const getFullProfile = (uid) => load(uid) || {}
  const getProfile = (uid) => read('profiles', uid) || {}

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
      name: 'linkedin',
      label: 'LinkedIn',
      placeholder: 'https://linkedin.com/in/username',
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
      name: 'threads',
      label: 'Threads',
      placeholder: 'https://threads.net/@username',
    },
    {
      name: 'phone',
      label: 'Phone',
      placeholder: '+49 000 00000000',
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
      name: 'username',
      label: t('profile.username.label'),
      register: true,
      poster: true,
      required: true,
      component: 'TInputUsername',
      before: t('profile.username.before'),
      async validate(value, item) {
        if (!value) {
          return true
        }

        const profileRef = (
          await db
            .collection('profiles')
            .where('username', '==', value)
            .get()
        ).docs[0]

        if (profileRef?.exists && profileRef?.id !== item?.id) {
          return false
        }

        return true
      },
      validationError: 'This username is already taken',
    },
    {
      name: 'photo',
      label: t('profile.photo'),
      poster: true,
      component: 'TInputPhoto',
    },
    {
      name: 'name',
      label: t('profile.name.label'),
      placeholder: t('profile.name.placeholder'),
      before: t('profile.name.before'),
    },
    {
      name: 'gender',
      label: t('profile.pronounce.label'),
      component: 'TInputButtons',
      hideSearchBox: true,
      poster: true,
      register: true,
      options: genderList,
    },
    {
      name: 'type',
      label: t('profile.type'),
      component: 'TRichSelect',
      hideSearchBox: true,
      poster: true,
      options: typeList,
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
    },
    {
      name: 'learning',
      label: t('profile.learning.label'),
      component: 'TInputTextarea',
      labelPosition: 'top',
      description: t('profile.learning.description'),
    },
    {
      name: 'jobs',
      label: t('profile.jobs.label'),
      component: 'TInputTextarea',
      labelPosition: 'top',
      description: t('profile.jobs.description'),
    },
    {
      name: 'current',
      label: t('profile.current.label'),
      register: false,
      poster: true,
      component: 'TInputPlace',
      before: t('profile.current.before'),
    },
    {
      name: 'place',
      label: t('profile.place.label'),
      register: true,
      poster: true,
      component: 'TInputPlace',
      before: t('profile.place.before'),
    },
    {
      name: 'hometown',
      label: t('profile.hometown.label'),
      component: 'TInputPlace',
      before: t('profile.hometown.before'),
    },
    {
      name: 'locales',
      label: t('profile.locales'),
      component: 'TInputLanguages',
    },
    ...contactFields,
    {
      name: 'address',
      label: 'Address',
      labelPosition: 'top',
      component: 'TInputAddress',
      simple: true,
    },
    {
      name: 'team',
      component: 'TInputArray',
      children: {
        component: 'TInputProfile',
      },
      label: t('profile.teammembers.label'),
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
      placeholder: t('profile.pronounce.label'),
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

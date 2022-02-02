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
      label: 'Female',
      value: 'Female',
    },
    {
      label: 'Male',
      value: 'Male',
    },
    {
      label: 'Other',
      value: 'Other',
    },
  ]

  const days = [
    {
      label: 'Monday',
      value: 'Monday',
    },
    {
      label: 'Tuesday',
      value: 'Tuesday',
    },
    {
      label: 'Wednesday',
      value: 'Wednesday',
    },
    {
      label: 'Thursday',
      value: 'Thursday',
    },
    {
      label: 'Friday',
      value: 'Friday',
    },
    {
      label: 'Saturday',
      value: 'Saturday',
    },
    {
      label: 'Sunday',
      value: 'Sunday',
    },
  ]

  const meetingPlaces = [
    {
      label: 'My place',
      value: 'myPlace',
    },
    {
      label: 'Your place',
      value: 'yourPlace',
    },
    {
      label: 'Somewhere private',
      value: 'private',
    },
    {
      label: 'Somewhere public',
      value: 'public',
    },
  ]

  const typeList = [
    {
      label: 'Dancer',
      value: 'Dancer',
    },
    {
      label: 'Artist',
      value: 'Artist',
    },
    {
      label: 'Organiser',
      value: 'Organiser',
    },
    {
      label: 'Venue',
      value: 'Venue',
    },
    {
      label: 'City',
      value: 'City',
    },
  ]

  const objectivesList = [
    {
      label: 'Talk about dance',
      value: 'talk',
    },
    {
      label: 'Learn together',
      value: 'learn',
    },
    {
      label: 'Dance outdoors',
      value: 'outdoors',
    },
    {
      label: 'Dance indoors',
      value: 'indoors',
    },
    {
      label: 'Teach together',
      value: 'teach',
    },
    {
      label: 'Dance project',
      value: 'project',
    },
  ]

  const contactFields = [
    {
      name: 'instagram',
      label: 'instagram.com/',
      placeholder: 'username',
      when: (p) => p.contacts === 'Yes',
    },
    {
      name: 'facebook',
      label: 'fb.com/',
      placeholder: 'username',
      when: (p) => p.contacts === 'Yes',
    },
    {
      name: 'whatsapp',
      label: 'chat.whatsapp.com/',
      placeholder: 'whatsapp chat',
      when: (p) => p.contacts === 'Yes',
    },
    {
      name: 'telegram',
      label: 't.me/',
      placeholder: 'username',
      when: (p) => p.contacts === 'Yes',
    },
    {
      name: 'twitter',
      label: 'twitter.com/',
      placeholder: 'username',
      when: (p) => p.contacts === 'Yes',
    },
    {
      name: 'tiktok',
      label: 'tiktok.com/',
      placeholder: 'username',
      when: (p) => p.contacts === 'Yes',
    },
    {
      name: 'youtube',
      label: 'youtube.com/',
      placeholder: 'username',
      when: (p) => p.contacts === 'Yes',
    },
    {
      name: 'email',
      placeholder: 'for business requests',
      when: (p) => p.contacts === 'Yes',
    },
    {
      name: 'website',
      placeholder: 'for business requests',
      when: (p) => p.contacts === 'Yes',
    },
  ]

  const visibilityOptions = [
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

  const booleanOptions = [
    {
      label: 'Yes',
      value: 'Yes',
    },
    {
      label: 'No',
      value: 'No',
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
      label: 'Dances',
      labelPosition: 'top',
      poster: true,
      component: 'TInputStylesSelect2',
      tips:
        'Mark up to 4 favorite dances that will be highlighted in your poster',
    },
    {
      name: 'gender',
      key: 'profile.gender',
      component: 'TInputButtons',
      hideSearchBox: true,
      poster: true,
      options: genderList,
    },
    {
      name: 'type',
      key: 'profile.type',
      component: 'TRadioGroup',
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
      component: 'TInputUsername',
      before: 'Use only letters, numbers, underscores and periods.',
    },
    {
      name: 'place',
      label: 'Your city',
      register: true,
      poster: true,
      required: true,
      component: 'TInputPlace',
      placeholder: 'City',
    },
    {
      name: 'hometown',
      key: 'profile.hometown',
      required: true,
      component: 'TInputPlace',
      before: 'Where were you born and raised?',
    },
    {
      name: 'visibility',
      key: 'profile.visibility',
      poster: true,
      component: 'TInputButtons',
      options: visibilityOptions,
      description:
        '- Public profiles are searchable in Google and used in our social media to attract new members.\n- Members profile are only visible for logged-in users.\n- Unlisted profiles are possible to open with exact link, but they are not listed in members lists and search.',
    },
    {
      name: 'permission',
      label: 'Do you want free promo?',
      poster: true,
      component: 'TInputButtons',
      options: booleanOptions,
      description:
        'Send us link to your profile on [Instagram](https://instagram.com/wedancevip) and we will promote it on our social media channels: Telegram, Instagram, Facebook and Twitter.',
    },
    {
      name: 'name',
      key: 'profile.name',
      required: true,
      placeholder: '(Required)',
      before: 'If you want to remain anonym use your first name.',
    },
    {
      name: 'locales',
      key: 'profile.languages',
      component: 'TInputLanguages',
    },
    {
      name: 'objectives',
      key: 'profile.objectives',
      component: 'TInputMulti',
      options: objectivesList,
    },
    {
      name: 'bio',
      key: 'profile.bio',
      poster: true,
      component: 'TInputTextarea',
      labelPosition: 'top',
      before: 'Short introduction on top of your photo',
      max: 140,
    },
    {
      name: 'story',
      key: 'profile.story',
      component: 'TInputTextarea',
      labelPosition: 'top',
      placeholder: 'Text (markdown)',
      before:
        'Tell your dance story. Use can also use [widgets](https://wedance.vip/markdown), including images and videos',
      tips:
        'Pitch yourself: Who are you? What do you offer? What do you want?\n\nTips for effective pitch:\n- Uncomplicated: It should be catchy and roll off the tongue\n- Concise: It shouldn’t take more than a minute to say or read\n- Unique: It reflects your skills, goals, and desires\n- Storyline: It covers who you are, what you offer, and where you want to be\n- Appealing: Your elevator pitch is essentially a persuasive sales pitch; the emphasis should be on what you offer',
    },
    {
      name: 'learning',
      key: 'profile.topics',
      component: 'TInputTextarea',
      description: 'For example: Musicality in Salsa, Men Styling, etc.',
    },
    {
      name: 'jobs',
      label: 'I can help with',
      component: 'TInputTextarea',
      description:
        'How can you help our community? What are you good at? For example: design, programming, marketing, social media, etc.',
    },
    {
      name: 'partner',
      key: 'profile.partner',
      component: 'TInputButtons',
      options: booleanOptions,
    },
    {
      name: 'birthday',
      key: 'profile.birthday',
      when: (p) => p.partner === 'Yes',
      type: 'date',
      description: 'We will show only your age',
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
      description: "Leave this field blank if you think it's irrelevant.",
    },
    {
      name: 'partnerBio',
      label: 'Question',
      when: (p) => p.partner === 'Yes',
      component: 'TInputTextarea',
      description:
        'What is important in your partner? Put it as a question, for example: Do you love dogs?',
    },
    {
      name: 'meetingPlace',
      key: 'profile.place',
      when: (p) => p.partner === 'Yes',
      component: 'TInputMulti',
      options: meetingPlaces,
    },
    {
      name: 'days',
      key: 'profile.days',
      when: (p) => p.partner === 'Yes',
      component: 'TInputMulti',
      options: days,
    },
    {
      name: 'contacts',
      label: 'Do you use social media?',
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
      placeholder: 'City',
    },
    {
      name: 'dance',
      component: 'TInputStyle',
      hideLabel: true,
      placeholder: 'Style',
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
      placeholder: 'Objective',
    },
    {
      name: 'gender',
      component: 'TRichSelect',
      options: genderList,
      hideSearchBox: true,
      clearable: true,
      hideLabel: true,
      placeholder: 'Gender',
    },
  ]

  const profileSorts = [
    {
      value: 'username',
      label: 'Username',
    },
    {
      value: '-createdAt',
      label: 'Registered',
    },
    {
      value: '-lastLoginAt',
      label: 'Last seen',
    },
  ]

  const radiusOptions = [
    {
      label: 'around 10km',
      value: 10,
    },
    {
      label: 'around 20km',
      value: 20,
    },
    {
      label: 'around 50km',
      value: 50,
    },
    {
      label: 'around 100km',
      value: 100,
    },
    {
      label: 'around 500km',
      value: 500,
    },
    {
      label: 'around 1000km',
      value: 1000,
    },
    {
      label: 'Anywhere',
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

import { useApp } from '~/use/app'
import { accountFields } from '~/use/accounts'

export const genderList = [
  {
    label: 'Female',
    value: 'Female'
  },
  {
    label: 'Male',
    value: 'Male'
  },
  {
    label: 'Other',
    value: 'Other'
  }
]

export const days = [
  {
    label: 'Monday',
    value: 'Monday'
  },
  {
    label: 'Tuesday',
    value: 'Tuesday'
  },
  {
    label: 'Wednesday',
    value: 'Wednesday'
  },
  {
    label: 'Thursday',
    value: 'Thursday'
  },
  {
    label: 'Friday',
    value: 'Friday'
  },
  {
    label: 'Saturday',
    value: 'Saturday'
  },
  {
    label: 'Sunday',
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
  },
  {
    label: 'Somewhere private',
    value: 'private'
  },
  {
    label: 'Somewhere public',
    value: 'public'
  }
]

export const typeList = [
  {
    label: 'Dancer',
    value: 'Dancer'
  },
  {
    label: 'Artist',
    value: 'Artist'
  },
  {
    label: 'Organiser',
    value: 'Organiser'
  },
  {
    label: 'Venue',
    value: 'Venue'
  }
]

export const objectivesList = [
  {
    label: 'Talk about dance',
    value: 'talk'
  },
  {
    label: 'Learn together',
    value: 'learn'
  },
  {
    label: 'Dance outdoors',
    value: 'outdoors'
  },
  {
    label: 'Dance indoors',
    value: 'indoors'
  },
  {
    label: 'Teach together',
    value: 'teach'
  },
  {
    label: 'Dance project',
    value: 'project'
  }
]

export const contactFields = [
  {
    name: 'instagram',
    label: 'instagram.com/',
    placeholder: 'username',
    when: (p) => p.contacts === 'Yes'
  },
  {
    name: 'facebook',
    label: 'fb.com/',
    placeholder: 'username',
    when: (p) => p.contacts === 'Yes'
  },
  {
    name: 'whatsapp',
    label: 'chat.whatsapp.com/',
    placeholder: 'whatsapp chat',
    when: (p) => p.contacts === 'Yes'
  },
  {
    name: 'telegram',
    label: 't.me/',
    placeholder: 'username',
    when: (p) => p.contacts === 'Yes'
  },
  {
    name: 'twitter',
    label: 'twitter.com/',
    placeholder: 'username',
    when: (p) => p.contacts === 'Yes'
  },
  {
    name: 'tiktok',
    label: 'tiktok.com/',
    placeholder: 'username',
    when: (p) => p.contacts === 'Yes'
  },
  {
    name: 'youtube',
    label: 'youtube.com/',
    placeholder: 'username',
    when: (p) => p.contacts === 'Yes'
  },
  {
    name: 'email',
    placeholder: 'for business requests',
    when: (p) => p.contacts === 'Yes'
  },
  {
    name: 'website',
    placeholder: 'for business requests',
    when: (p) => p.contacts === 'Yes'
  }
]

export const visibilityOptions = [
  {
    label: 'Public',
    value: 'Public'
  },
  {
    label: 'Members',
    value: 'Members'
  },
  {
    label: 'Unlisted',
    value: 'Unlisted'
  }
]

export const booleanOptions = [
  {
    label: 'Yes',
    value: 'Yes'
  },
  {
    label: 'No',
    value: 'No'
  }
]

export const profileFields = [
  {
    name: 'photo',
    key: 'profile.photo',
    poster: true,
    type: 'photo'
  },
  {
    name: 'styles',
    label: 'Dances',
    labelPosition: 'top',
    poster: true,
    type: 'stylesSelect',
    tips: 'Mark up to 4 favorite dances that will be highlighted in your poster'
  },
  {
    name: 'gender',
    key: 'profile.gender',
    type: 'buttons',
    hideSearchBox: true,
    poster: true,
    options: genderList
  },
  {
    name: 'type',
    key: 'profile.type',
    type: 'radio',
    hideSearchBox: true,
    poster: true,
    options: typeList
  },
  {
    name: 'username',
    key: 'profile.username',
    register: true,
    validations: {
      required: true,
      minLength: 4,
      alphaNum: true,
      isUnique: true
    },
    poster: true,
    required: true,
    type: 'username',
    before: 'Use only letters, numbers, underscores and periods.'
  },
  {
    name: 'place',
    label: 'Your city',
    register: true,
    validations: {
      required: true
    },
    poster: true,
    required: true,
    type: 'place',
    placeholder: 'City'
  },
  {
    name: 'hometown',
    key: 'profile.hometown',
    required: true,
    type: 'place',
    before: 'Where were you born and raised?'
  },
  {
    name: 'visibility',
    key: 'profile.visibility',
    poster: true,
    type: 'buttons',
    options: visibilityOptions,
    description:
      '- Public profiles are searchable in Google and used in our social media to attract new members.\n- Members profile are only visible for logged-in users.\n- Unlisted profiles are possible to open with exact link, but they are not listed in members lists and search.'
  },
  {
    name: 'permission',
    label: 'Do you want free promo?',
    poster: true,
    type: 'buttons',
    options: booleanOptions,
    description:
      'Send us link to your profile on [Instagram](https://instagram.com/wedancevip) and we will promote it on our social media channels: Telegram, Instagram, Facebook and Twitter.'
  },
  {
    name: 'name',
    key: 'profile.name',
    required: true,
    placeholder: '(Required)',
    before: 'If you want to remain anonym use your first name.'
  },
  {
    name: 'locales',
    key: 'profile.languages',
    type: 'languages'
  },
  {
    name: 'objectives',
    key: 'profile.objectives',
    type: 'multi',
    options: objectivesList
  },
  {
    name: 'bio',
    key: 'profile.bio',
    poster: true,
    type: 'textarea',
    labelPosition: 'top',
    before: 'Short introduction on top of your photo',
    max: 140
  },
  {
    name: 'story',
    key: 'profile.story',
    type: 'textarea',
    labelPosition: 'top',
    placeholder: 'Text (markdown)',
    before:
      'Tell your dance story. Use can also use [widgets](https://wedance.vip/markdown), including images and videos',
    tips:
      'Pitch yourself: Who are you? What do you offer? What do you want?\n\nTips for effective pitch:\n- Uncomplicated: It should be catchy and roll off the tongue\n- Concise: It shouldn’t take more than a minute to say or read\n- Unique: It reflects your skills, goals, and desires\n- Storyline: It covers who you are, what you offer, and where you want to be\n- Appealing: Your elevator pitch is essentially a persuasive sales pitch; the emphasis should be on what you offer'
  },
  {
    name: 'learning',
    key: 'profile.topics',
    type: 'textarea',
    description: 'For example: Musicality in Salsa, Men Styling, etc.'
  },
  {
    name: 'jobs',
    label: 'I can help with',
    type: 'textarea',
    description:
      'How can you help our community? What are you good at? For example: design, programming, marketing, social media, etc.'
  },
  {
    name: 'partner',
    key: 'profile.partner',
    type: 'buttons',
    options: booleanOptions
  },
  {
    name: 'birthday',
    key: 'profile.birthday',
    when: (p) => p.partner === 'Yes',
    type: 'date',
    description: 'We will show only your age'
  },
  {
    name: 'height',
    key: 'profile.height',
    when: (p) => p.partner === 'Yes'
  },
  {
    name: 'weight',
    key: 'profile.weight',
    when: (p) => p.partner === 'Yes',
    description: "Leave this field blank if you think it's irrelevant."
  },
  {
    name: 'partnerBio',
    label: 'Question',
    when: (p) => p.partner === 'Yes',
    type: 'textarea',
    description:
      'What is important in your partner? Put it as a question, for example: Do you love dogs?'
  },
  {
    name: 'meetingPlace',
    key: 'profile.place',
    when: (p) => p.partner === 'Yes',
    type: 'multi',
    options: meetingPlaces
  },
  {
    name: 'days',
    key: 'profile.days',
    when: (p) => p.partner === 'Yes',
    type: 'multi',
    options: days
  },
  {
    name: 'contacts',
    label: 'Do you use social media?',
    type: 'buttons',
    options: booleanOptions
  },
  ...contactFields
]

const profilePosterFields = profileFields.filter((f) => f.poster)
const profileDetailFields = profileFields.filter((f) => !f.poster)

export const registerFields = [
  ...accountFields.filter((f) => f.register),
  ...profileFields.filter((f) => f.register)
]

export const profileFilters = [
  {
    name: 'place',
    type: 'place',
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
      item && item[field] && item[field][value] && item[field][value].selected,
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

export const profileSorts = [
  {
    value: 'username',
    label: 'Username'
  },
  {
    value: '-createdAt',
    label: 'Registered'
  },
  {
    value: '-lastLoginAt',
    label: 'Last seen'
  }
]

export const useProfiles = () => {
  const { read, loading } = useApp()
  const getProfile = (uid) => read('profiles', uid) || {}

  return {
    getProfile,
    profileFields,
    profilePosterFields,
    profileDetailFields,
    contactFields,
    loading,
    objectivesList,
    typeList,
    genderList
  }
}

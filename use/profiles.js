import { useApp } from '~/use/app'

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
    name: 'visibility',
    key: 'profile.visibility',
    poster: true,
    type: 'richselect',
    hideSearchBox: true,
    options: visibilityOptions,
    tips:
      '- Public profiles are searchable in Google and used in our social media to attract new members.\n- Members profile are only visible for logged-in users.\n- Unlisted profiles are possible to open with exact link, but they are not listed in members lists and search.'
  },
  {
    name: 'permission',
    label: 'Publish on social media?',
    poster: true,
    type: 'buttons',
    options: booleanOptions,
    before:
      'Would you like your profile to be published on WeDance account in Instagram, Facebook, Telegram, Twitter, TikTok?'
  },
  {
    name: 'username',
    key: 'profile.username',
    poster: true,
    required: true,
    placeholder: '(Required)',
    type: 'username',
    description:
      'Create a unique username, which will be a link to your profile. Allowed only letters and numbers.'
  },
  {
    name: 'bio',
    key: 'profile.bio',
    poster: true,
    type: 'textarea',
    labelPosition: 'top',
    description:
      'Introduce yourself. Make it short and attractive. Max 280 symbols.',
    placeholder: '280 symbols'
  },
  {
    name: 'community',
    label: 'Community',
    poster: true,
    required: true,
    type: 'collection',
    collection: 'cities',
    keyLabel: (i) => `${i.name}, ${i.location.country}`,
    keyValue: 'name',
    placeholder: 'City',
    tips:
      'Where do you dance the most? If you live in a small city, you probably go to dance to a bigger city, which one?'
  },
  {
    name: 'zipcode',
    label: 'Your zipcode',
    poster: true
  },
  {
    name: 'photo',
    key: 'profile.photo',
    poster: true,
    type: 'photo'
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
    name: 'styles',
    label: 'Dances',
    labelPosition: 'top',
    poster: true,
    type: 'stylesSelect',
    tips: 'Mark up to 4 favorite dances that will be highlighted in your poster'
  },
  {
    name: 'name',
    key: 'profile.name',
    required: true,
    placeholder: '(Required)',
    description: 'If you want to remain anonym use your first name.'
  },
  {
    name: 'location',
    key: 'profile.hometown',
    required: true,
    type: 'location',
    tips: 'Where were you born and raised?'
  },
  {
    name: 'locales',
    key: 'profile.languages',
    type: 'languages'
  },
  {
    name: 'story',
    key: 'profile.story',
    type: 'textarea',
    labelPosition: 'top',
    placeholder: 'Text (markdown)',
    description:
      'Use [widgets](https://wedance.vip/markdown), including images and videos',
    tips:
      'Pitch yourself: Who are you? What do you offer? What do you want?\n\nTips for effective pitch:\n- Uncomplicated: It should be catchy and roll off the tongue\n- Concise: It shouldn’t take more than a minute to say or read\n- Unique: It reflects your skills, goals, and desires\n- Storyline: It covers who you are, what you offer, and where you want to be\n- Appealing: Your elevator pitch is essentially a persuasive sales pitch; the emphasis should be on what you offer'
  },
  {
    name: 'jobs',
    label: 'Skills',
    type: 'textarea',
    tips:
      'What other skills would you like to share with dance community? For example: video editing, photography, copywriting, etc. It might be useful to exchange your skills for free passes.'
  },
  {
    name: 'teacher',
    key: 'profile.teacher',
    type: 'buttons',
    options: booleanOptions
  },
  {
    name: 'learning',
    key: 'profile.topics',
    type: 'textarea',
    description: 'For example: Musicality in Salsa, Men Styling, etc.'
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
    name: 'objectives',
    key: 'profile.objectives',
    when: (p) => p.partner === 'Yes',
    type: 'multi',
    options: objectivesList
  },
  {
    name: 'place',
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

export const profileFilters = [
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

export default () => {
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

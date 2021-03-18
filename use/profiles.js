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
    label: 'instagram.com/'
  },
  {
    name: 'facebook',
    label: 'fb.com/'
  },
  {
    name: 'telegram',
    label: 't.me/'
  },
  {
    name: 'twitter',
    label: 'twitter.com/'
  },
  {
    name: 'tiktok',
    label: 'tiktok.com/'
  },
  {
    name: 'youtube',
    label: 'youtube.com/'
  },
  {
    name: 'email'
  },
  {
    name: 'website'
  }
]

export const profileFields = [
  {
    name: 'type',
    key: 'profile.type',
    type: 'select',
    options: typeList
  },
  {
    name: 'gender',
    key: 'profile.gender',
    type: 'select',
    options: genderList
  },
  {
    name: 'teacher',
    key: 'profile.teacher',
    type: 'select',
    options: ['Yes', 'No']
  },
  {
    name: 'photo',
    key: 'profile.photo',
    type: 'photo'
  },
  {
    name: 'name',
    key: 'profile.name',
    required: true,
    placeholder: '(Required)',
    description:
      "Be careful when using your full name, it's only recommended for public figures. If you want to remain anonym use only your first name."
  },
  {
    name: 'username',
    key: 'profile.username',
    required: true,
    placeholder: '(Required)',
    type: 'username',
    description:
      'Create a unique username, which will be a link to your profile. Allowed only letters and numbers.'
  },
  {
    name: 'bio',
    key: 'profile.bio',
    type: 'textarea',
    description:
      'Introduce yourself. Make it short and attractive. Max 280 symbols.',
    placeholder: '280 symbols'
  },
  {
    name: 'story',
    key: 'profile.story',
    type: 'textarea',
    placeholder: 'Description (markdown)',
    description: 'Who are you? What do you offer? What do you want?',
    tips:
      'Tips for effective pitch:\n- Uncomplicated: It should be catchy and roll off the tongue\n- Concise: It shouldn’t take more than a minute to say or read\n- Unique: It reflects your skills, goals, and desires\n- Storyline: It covers who you are, what you offer, and where you want to be\n- Appealing: Your elevator pitch is essentially a persuasive sales pitch; the emphasis should be on what you offer\n- Use [Markdown](https://simplemde.com/markdown-guide)'
  },
  {
    name: 'zipcode',
    label: 'Your zipcode'
  },
  {
    name: 'community',
    key: 'profile.community',
    required: true,
    type: 'city'
  },
  {
    name: 'location',
    key: 'profile.hometown',
    required: true,
    type: 'location'
  },
  {
    name: 'styles',
    key: 'profile.styles',
    type: 'stylesSelect',
    tips: 'Mark up to 4 favorite dances that will be highlighted in your poster'
  },
  {
    name: 'locales',
    key: 'profile.languages',
    type: 'languages'
  },
  {
    name: 'jobs',
    key: 'profile.skills',
    type: 'textarea',
    description:
      'What other skills would you like to share with dance community? For example: video editing, photography, copywriting, etc. It might be useful to exchange your skills for free passes.'
  },
  {
    name: 'learning',
    key: 'profile.topics',
    type: 'textarea',
    description: 'For example: Musicality in Salsa, Men Styling, etc.'
  },
  {
    name: 'birthday',
    key: 'profile.birthday',
    type: 'date',
    description: 'We will show only your age'
  },
  {
    name: 'height',
    key: 'profile.height'
  },
  {
    name: 'weight',
    key: 'profile.weight',
    description: "Leave this field blank if you think it's irrelevant."
  },
  {
    name: 'partner',
    key: 'profile.partner',
    type: 'select',
    options: ['Yes', 'No']
  },
  {
    name: 'partnerBio',
    key: 'profile.partnerBio',
    type: 'textarea',
    description: 'What is important in your partner?'
  },
  {
    name: 'objectives',
    key: 'profile.objectives',
    type: 'multi',
    options: objectivesList
  },
  {
    name: 'place',
    key: 'profile.place',
    type: 'multi',
    options: meetingPlaces
  },
  {
    name: 'days',
    key: 'profile.days',
    type: 'multi',
    options: days
  },
  ...contactFields,
  {
    name: 'visibility',
    key: 'profile.visibility',
    type: 'select',
    options: ['Public', 'Members', 'Unlisted'],
    tips:
      '- Public profiles are searchable in Google and used in our social media to attract new members.\n- Members profile are only visible for logged-in users.\n- Unlisted profiles are possible to open with exact link, but they are not listed in members lists and search.'
  }
]

export default () => {
  const { read, loading } = useApp()
  const getProfile = (uid) => read('profiles', uid) || {}

  return {
    getProfile,
    profileFields,
    contactFields,
    loading,
    objectivesList,
    typeList,
    genderList
  }
}

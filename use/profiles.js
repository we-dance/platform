import { computed } from '@vue/composition-api'
import useCollection from '~/use/collection'
import useTags from '~/use/tags'

export default () => {
  const { getById } = useCollection('profiles')
  const { tagsOptions, addTag } = useTags()

  const preferencesFields = computed(() => [
    {
      name: 'tags',
      label: 'Tags',
      type: 'tags',
      description: 'Choose your interests',
      options: tagsOptions.value,
      listeners: {
        add: addTag
      }
    },
    {
      name: 'days',
      label: 'Days',
      type: 'tags',
      description: 'Choose best days for you to dance',
      options: [
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
    }
  ])

  const profileFields = [
    {
      name: 'photo',
      label: 'Photo',
      type: 'photo'
    },
    {
      name: 'username',
      label: 'Username',
      required: true,
      placeholder: '(Required)',
      trim: '[^a-z0-9]+',
      description:
        'It is a way to remain anonym, but still be able to differentiate between different people'
    },
    {
      name: 'name',
      label: 'Name',
      required: true,
      placeholder: '(Required)',
      description:
        "Be careful when using your full name, it's only recommended for public figures. If you want to remain anonym use only your first name."
    },
    {
      name: 'bio',
      label: 'About you',
      type: 'textarea',
      placeholder: "Say a few words about who you are and why you're here!"
    },
    {
      name: 'location',
      label: 'City',
      required: true,
      type: 'location'
    },
    {
      name: 'birthday',
      label: 'Birthday',
      type: 'date'
    },
    {
      name: 'gender',
      label: 'Gender',
      type: 'select',
      options: ['Male', 'Female', 'Other']
    },
    {
      name: 'skills',
      label: 'Your dance style and level',
      type: 'textarea',
      description:
        'For example: Salsa On2 Novice or Bachata Sensual Intermediate, Salsa Cubana Advanced, Urban Kiz Novice, Zouk Intermediate, Bachata Sensual Novice, Hip Hop Novice, etc.'
    },
    {
      name: 'learning',
      label: 'Which dance topics you are interested in?',
      type: 'textarea',
      description:
        'For example: Musicality in Salsa or Men Styling, etc. Leave blank if you are not interested in any sort of classes and workshops.'
    },
    {
      name: 'newsletter',
      label: 'What kind of updated would you like to receive weekly?',
      type: 'select',
      options: [
        {
          value: 'nothing',
          label: 'Nothing'
        },
        {
          value: 'party',
          label: 'Social/party events'
        },
        {
          value: 'class',
          label: 'Dance classes'
        },
        {
          value: 'workshop',
          label: 'Workshops and bootcamps'
        },
        {
          value: 'online',
          label: 'Online dance classes'
        },
        {
          value: 'festival',
          label: 'International festivals'
        }
      ]
    },
    {
      name: 'languages',
      label: 'Your languages',
      description: 'For example: English, German, etc.'
    },
    {
      name: 'jobs',
      label: 'Other Skills',
      type: 'textarea',
      description:
        'What other skills would you like to share with dance community? For example: video editing, photography, copywriting, etc. It might be useful to exchange your skills for free passes.'
    },
    {
      name: 'visibility',
      label: 'Your profile visibility',
      type: 'select',
      options: ['Public', 'Members', 'Unlisted'],
      description:
        'Public profiles will be searchable in Google. Members profile are only visible for logged-in users. Unlisted profiles are possible to open with exact link, but they are not listed in members lists and search.'
    },
    {
      name: 'partner',
      label: 'Are you looking for a dance partner?',
      type: 'select',
      options: ['Yes', 'No'],
      description:
        'Fill the fields below and you will get a dance partner recommendation as soon as we find a match for you.'
    },
    {
      name: 'height',
      label: 'Height (cm)'
    },
    {
      name: 'weight',
      label: 'Weight (kg)',
      description: "Leave this field blank if you think it's irrelevant."
    },
    {
      name: 'partnerBio',
      label: 'About your partner',
      type: 'textarea',
      description: 'What is important in your partner?'
    },
    {
      name: 'photoFull',
      label: 'Your full height photo',
      type: 'photo'
    }
  ]

  const contactFields = [
    {
      name: 'email'
    },
    {
      name: 'instagram'
    },
    {
      name: 'facebook'
    },
    {
      name: 'telegram'
    },
    {
      name: 'twitter'
    },
    {
      name: 'tiktok'
    },
    {
      name: 'youtube'
    },
    {
      name: 'website'
    }
  ]

  const getProfile = (uid) => getById(uid) || {}

  return {
    getProfile,
    preferencesFields,
    profileFields,
    contactFields
  }
}

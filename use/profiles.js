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
      'v-on:add': addTag
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
      label: 'Photo'
    },
    {
      name: 'username',
      label: 'Username',
      required: true,
      placeholder: '(Required)',
      trim: '[^a-z0-9]+',
      description:
        'It will be used for members to mention you and as a url to your profile'
    },
    {
      name: 'name',
      label: 'Name',
      required: true,
      placeholder: '(Required)'
    },
    {
      name: 'city',
      label: 'City',
      required: true,
      description: 'Search based on the name of your city.'
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
      name: 'bio',
      label: 'Bio',
      type: 'textarea',
      placeholder: "Say a few words about who you are and why you're here!"
    },
    {
      name: 'skills',
      label: 'Dance Skills',
      type: 'textarea',
      placeholder: 'What dances are you most experienced with?'
    },
    {
      name: 'learning',
      label: 'I am getting into',
      type: 'textarea',
      placeholder: 'What are you learning right now?'
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

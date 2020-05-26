import useCollection from '~/use/collection'
import TFieldTag from '~/components/TFieldTag'

export default () => {
  const { getById } = useCollection('profiles')

  const preferencesFields = [
    {
      name: 'tags',
      label: 'Which Days'
    },
    {
      name: 'days',
      label: 'Which Days'
    }
  ]

  const profileFields = [
    {
      name: 'username',
      label: 'Username',
      required: true,
      placeholder: '(Required)',
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
      name: 'tags',
      label: 'Tags',
      component: TFieldTag,
      description: 'Select tags that can help others find you'
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

import useCollection from '~/use/collection'

export default () => {
  const { getById, loading } = useCollection('profiles')

  const profileFields = [
    {
      name: 'type',
      label: 'Type',
      type: 'select',
      options: ['Dancer', 'Artist', 'Organiser', 'Venue', 'City']
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
      name: 'name',
      label: 'Name',
      required: true,
      placeholder: '(Required)',
      description:
        "Be careful when using your full name, it's only recommended for public figures. If you want to remain anonym use only your first name."
    },
    {
      name: 'username',
      label: 'Username',
      required: true,
      placeholder: '(Required)',
      type: 'username',
      description:
        'Create a unique username, which will be a link to your profile. Allowed only letters and numbers.'
    },
    {
      name: 'bio',
      label: 'About you',
      type: 'textarea',
      placeholder: "Say a few words about who you are and why you're here!"
    },
    {
      name: 'photo',
      label: 'Photo',
      type: 'photo'
    },
    {
      name: 'location',
      label: 'Hometown',
      required: true,
      type: 'location'
    },
    {
      name: 'community',
      label: 'Community',
      required: true,
      type: 'city',
      description: 'Dance community of which city would you like to join?'
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
      name: 'styles',
      label: 'Your dance styles and level',
      type: 'stylesSelect'
    },
    {
      name: 'story',
      label: 'Your dance story',
      type: 'textarea',
      description: 'Where did you learn dancing and why did you start?'
    },
    {
      name: 'languages',
      label: 'Your languages',
      type: 'textarea',
      description: 'For example: English, German, etc.'
    },
    {
      name: 'jobs',
      label: 'Non-dancing skills',
      type: 'textarea',
      description:
        'What other skills would you like to share with dance community? For example: video editing, photography, copywriting, etc. It might be useful to exchange your skills for free passes.'
    },
    {
      name: 'days',
      label: 'Days',
      type: 'multi',
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
    },
    {
      name: 'learning',
      label: 'Which dance topics you are interested in?',
      type: 'textarea',
      description: 'For example: Musicality in Salsa, Men Styling, etc.'
    },
    {
      name: 'newsletter',
      label: 'What kind of updated would you like to receive weekly?',
      type: 'multi',
      options: [
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
      name: 'teacher',
      label: 'Are you teaching?',
      type: 'select',
      options: ['Yes', 'No']
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
      label: 'Your height (cm)'
    },
    {
      name: 'weight',
      label: 'Your weight (kg)',
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
    profileFields,
    contactFields,
    loading
  }
}

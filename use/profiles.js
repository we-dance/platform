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
      name: 'gender',
      label: 'Gender',
      type: 'select',
      options: ['Male', 'Female', 'Other']
    },
    {
      name: 'teacher',
      label: 'Are you teaching?',
      type: 'select',
      options: ['Yes', 'No']
    },
    {
      name: 'photo',
      label: 'Photo',
      type: 'photo'
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
      label: 'Teaser',
      type: 'textarea',
      description:
        'Introduce yourself. Make it simple, short, unique, narative and attractive.',
      placeholder: '280 symbols'
    },
    {
      name: 'story',
      label: 'Description',
      type: 'textarea',
      placeholder: 'Description (markdown)',
      description: '[Markdown cheatsheet](https://simplemde.com/markdown-guide)'
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
      name: 'styles',
      label: 'Your dance styles and level',
      type: 'stylesSelect'
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
      name: 'partner',
      label: 'Are you looking for a dance partner?',
      type: 'select',
      options: ['Yes', 'No'],
      description:
        'Fill the fields below and you will get a dance partner recommendation as soon as we find a match for you.'
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
      name: 'birthday',
      label: 'Birthday',
      type: 'date',
      description: 'We will show only your age'
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
      name: 'photoFull',
      label: 'Full height photo',
      type: 'photo'
    },
    {
      name: 'partnerBio',
      label: 'About your partner',
      type: 'textarea',
      description: 'What is important in your partner?'
    },
    {
      name: 'visibility',
      label: 'Visibility',
      type: 'select',
      options: ['Public', 'Members', 'Unlisted'],
      description:
        'Public profiles are searchable in Google and used in our social media to attract new members. Members profile are only visible for logged-in users. Unlisted profiles are possible to open with exact link, but they are not listed in members lists and search.'
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

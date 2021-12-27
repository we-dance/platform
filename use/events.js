import { addMinutes, parseISO } from 'date-fns'
import { postTypeList } from '~/use/posts'

export const eventTypeList = [
  {
    label: 'Party',
    value: 'Party',
    icon: '🎵',
  },
  {
    label: 'Workshop',
    value: 'Workshop',
    icon: '📙',
  },
  {
    label: 'Course',
    value: 'Course',
    icon: '📚',
  },
  {
    label: 'Festival',
    value: 'Festival',
    icon: '🎁',
  },
  {
    label: 'Congress',
    value: 'Congress',
    icon: '🎁',
  },
  {
    label: 'Concert',
    value: 'Concert',
    icon: '🎷',
  },
  {
    label: 'Show',
    value: 'Show',
    icon: '🎭',
  },
  {
    label: 'Other',
    value: 'Other',
    icon: '❓',
  },
]

export const eventTypeListIcons = eventTypeList.map((type) => ({
  ...type,
  label: `${type.icon}  ${type.label}`,
}))

export function getEventIcon(eventType) {
  let typeOption =
    eventTypeListIcons.find((type) => type.value === eventType) || 'Other'

  return typeOption.icon
}

const updateEndDate = (e) => {
  if (!e.duration || e.duration === 'custom') {
    return
  }

  e.endDate = addMinutes(parseISO(e.startDate), e.duration)
}

const updatePlace = (e) => {
  if (e?.international === 'No') {
    return
  }

  e.place = ''
}

export const eventFields = [
  {
    name: 'name',
    hideLabel: true,
    placeholder: 'Event Name',
  },
  {
    name: 'description',
    hideLabel: true,
    type: 'textarea',
    placeholder: 'Details (markdown)',
    tips:
      'Pitch yourself: Who are you? What do you offer? What do you want?\n\nTips for effective pitch:\n- Uncomplicated: It should be catchy and roll off the tongue\n- Concise: It shouldn’t take more than a minute to say or read\n- Unique: It reflects your skills, goals, and desires\n- Storyline: It covers who you are, what you offer, and where you want to be\n- Appealing: Your elevator pitch is essentially a persuasive sales pitch; the emphasis should be on what you offer',
    description:
      'Use [widgets](https://wedance.vip/markdown), including images and videos',
  },
  {
    name: 'venue',
    label: 'Where?',
    labelPosition: 'top',
    type: 'venue',
  },
  {
    name: 'startDate',
    type: 'datetime',
    label: 'When?',
    onChange: updateEndDate,
  },
  {
    name: 'duration',
    label: 'How long?',
    onChange: updateEndDate,
    type: 'select',
    options: [
      {
        value: 30,
        label: '30 min',
      },
      {
        value: 60,
        label: '1 hour',
      },
      {
        value: 90,
        label: '1.5 hour',
      },
      {
        value: 120,
        label: '2 hours',
      },
      {
        value: 180,
        label: '3 hours',
      },
      {
        value: 240,
        label: '4 hours',
      },
      {
        value: 300,
        label: '5 hours',
      },
      {
        value: 'custom',
        label: 'Custom',
      },
    ],
  },
  {
    name: 'endDate',
    type: 'datetime',
    when: (e) => e.duration === 'custom',
  },
  {
    name: 'price',
    placeholder: 'Examples: 10EUR, 5USD, FREE',
    description: 'Examples: 10EUR, 5USD, FREE',
  },
  {
    name: 'styles',
    label: 'Dance styles',
    type: 'stylesSelect',
  },
  {
    name: 'eventType',
    type: 'select',
    options: eventTypeList,
  },
  {
    name: 'cover',
    type: 'photo',
    width: 500,
    height: 500,
    circle: false,
    hideLabel: true,
  },
  {
    name: 'visibility',
    type: 'buttons',
    options: ['Public', 'Members', 'Unlisted'],
    description: `- Public - searchable in Google.\n- Members - visible only for logged-in users.\n- Unlisted - possible to open with exact link, but they are not listed nor not shown in the search.`,
  },
  {
    name: 'claimed',
    label: 'Are you organiser?',
    type: 'buttons',
    options: ['Yes', 'No'],
    description: 'Are you the event organiser?',
  },
  {
    name: 'organiser',
    label: 'Organiser',
    description: 'Username on WeDance',
  },
  {
    name: 'online',
    label: 'Online?',
    type: 'buttons',
    options: ['Yes', 'No'],
    onChange: updatePlace,
    description: 'Streaming via Zoom, Google Meet, Instagram Live, etc.?',
  },
  {
    name: 'international',
    label: 'International?',
    type: 'buttons',
    options: ['Yes', 'No'],
    onChange: updatePlace,
    description: 'Is it a big event with >500 guests, like festival or online?',
  },
  {
    name: 'place',
    label: 'Community',
    type: 'place',
    clearable: true,
    when: (answers) => answers.international === 'No',
    description: 'Leave empty if you want your event to be shown in all cities',
  },
  {
    name: 'form',
    label: 'External registration?',
    before: 'Do you use external platform to register for your event?',
    type: 'buttons',
    options: ['Yes', 'No'],
  },
  {
    name: 'link',
    description:
      'Direct booking link on ticket platform (ti.to, Eventbrite, Google Form, etc.)',
  },
  {
    name: 'website',
    description: 'Link to your event or website',
  },
  {
    name: 'facebook',
    description: 'Link to original event (Facebook, Eventbrite, etc.)',
  },
  {
    name: 'promo',
    label: 'Do you want free promo?',
    type: 'buttons',
    options: ['Yes', 'No'],
    description:
      'Send us link to your event on [Instagram](https://instagram.com/wedancevip) and we will promote it on our social media channels: Telegram, Instagram, Facebook and Twitter.',
  },
  {
    name: 'confirmation',
    labelPosition: 'top',
    label: 'Confirmation email for guests',
    type: 'textarea',
    placeholder: 'Example: Dear guest, you are confirmed to our event.',
  },
  {
    name: 'type',
    admin: true,
    type: 'select',
    options: postTypeList,
  },
]

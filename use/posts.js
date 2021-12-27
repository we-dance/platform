export const postTypeList = [
  {
    label: 'Category',
    value: '',
  },
  {
    label: 'Looking for partner',
    value: 'needPartner',
  },
  {
    label: 'Looking for events',
    value: 'needEvents',
  },
  {
    label: 'Looking for instructor',
    value: 'needInstructor',
  },
  {
    label: 'Offering trip',
    value: 'trip',
  },
  {
    label: 'Event',
    value: 'event',
  },
  {
    label: 'Artist',
    value: 'artist',
  },
  {
    label: 'Venue',
    value: 'venue',
  },
  {
    label: 'App',
    value: 'app',
  },
  {
    label: 'Guide / How To',
    value: 'guide',
  },
  {
    label: 'Inspiration',
    value: 'inspiration',
  },
  {
    label: 'Question',
    value: 'question',
  },
]

export const postFilters = [
  {
    name: 'place',
    type: 'place',
    compare: (item, field, value) => !item[field] || item[field] === value,
    clearable: true,
    hideLabel: true,
    placeholder: 'City',
    when: () => false,
  },
  {
    name: 'dance',
    type: 'style',
    hideLabel: true,
    placeholder: 'Style',
    compare: (item, field, value) =>
      item && item[field] && item[field][value] && item[field][value].selected,
    mineOnly: true,
  },
]

export const postSorts = [
  {
    value: '-savedByCount',
    label: 'Popular',
  },
  {
    value: '-createdAt',
    label: 'Newest',
  },
]

export const postFields = [
  {
    name: 'type',
    type: 'select',
    options: postTypeList,
  },
  {
    name: 'title',
    hideLabel: true,
    placeholder: 'Title',
  },
  {
    name: 'description',
    hideLabel: true,
    type: 'textarea',
    placeholder: 'Text (markdown)',
    tips:
      'Pitch yourself: Who are you? What do you offer? What do you want?\n\nTips for effective pitch:\n- Uncomplicated: It should be catchy and roll off the tongue\n- Concise: It shouldn’t take more than a minute to say or read\n- Unique: It reflects your skills, goals, and desires\n- Storyline: It covers who you are, what you offer, and where you want to be\n- Appealing: Your elevator pitch is essentially a persuasive sales pitch; the emphasis should be on what you offer',
    description:
      'Use [widgets](https://wedance.vip/markdown), including images and videos',
  },
  {
    name: 'url',
    hideLabel: true,
    placeholder: 'Link',
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
    name: 'hideMeta',
    admin: true,
  },
  {
    name: 'hideComments',
    admin: true,
  },
  {
    name: 'hideReactions',
    admin: true,
  },
]

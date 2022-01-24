export const postTypeList = [
  {
    label: 'Choose category',
    key: 'feed.category',
    value: '',
  },
  {
    label: 'Looking for partner',
    key: 'feed.partner',
    value: 'needPartner',
  },
  {
    label: 'Looking for events',
    key: 'feed.events',
    value: 'needEvents',
  },
  {
    label: 'Looking for instructor',
    key: 'feed.instructor',
    value: 'needInstructor',
  },
  {
    label: 'Offering trip',
    key: 'feed.trip',
    value: 'trip',
  },
  {
    label: 'Event',
    key: 'feed.event',
    value: 'event',
  },
  {
    label: 'Artist',
    key: 'feed.artist',
    value: 'artist',
  },
  {
    label: 'Venue',
    key: 'feed.venue',
    value: 'venue',
  },
  {
    label: 'App',
    key: 'feed.app',
    value: 'app',
  },
  {
    label: 'Guide / How To',
    key: 'feed.help',
    value: 'guide',
  },
  {
    label: 'Inspiration',
    key: 'feed.inspiration',
    value: 'inspiration',
  },
  {
    label: 'Question',
    key: 'feed.question',
    value: 'question',
  },
  {
    label: 'Poll',
    key: 'feed.poll',
    value: 'poll',
  },
  {
    label: 'Post',
    key: 'feed.post',
    value: 'post',
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
    name: 'username',
    admin: true,
  },
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
    name: 'styles',
    label: 'Dance styles',
    type: 'stylesSelect',
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

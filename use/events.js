import { addMinutes, parseISO } from 'date-fns'
import { useI18n } from '~/use/i18n'
import { usePosts } from '~/use/posts'
import { useCities } from './cities'
import { getYmd } from '~/utils'

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

export const useEvents = () => {
  const { currentCity } = useCities()
  const { postTypeList } = usePosts()
  const { t } = useI18n()

  const eventTypeList = [
    {
      label: t('events.typelist.party'),
      value: 'Party',
      icon: '🎵',
    },
    {
      label: t('events.typelist.workshop'),
      value: 'Workshop',
      icon: '🎓',
    },
    {
      label: t('events.typelist.course'),
      value: 'Course',
      icon: '🎓',
    },
    {
      label: t('events.typelist.festival'),
      value: 'Festival',
      icon: '✈️',
    },
    {
      label: t('events.typelist.congress'),
      value: 'Congress',
      icon: '✈️',
    },
    {
      label: t('events.typelist.concert'),
      value: 'Concert',
      icon: '🎵',
    },
    {
      label: t('events.typelist.show'),
      value: 'Show',
      icon: '🎵',
    },
    {
      label: t('events.typelist.other'),
      value: 'Other',
      icon: '🎵',
    },
  ]

  const now = new Date()
  const startOfTodayString = getYmd(now)

  const isPublic = (item) => item.visibility !== 'Unlisted'

  const isUpcoming = (item) =>
    getYmd(item.startDate) >= startOfTodayString && isPublic(item)

  const isInSelectedCity = (item) => item.place === currentCity.value

  const eventCategoryOptions = [
    {
      label: t('event.category.meetup'),
      value: 'meetup',
      icon: '🎵',
      filter: (item) =>
        ['Party', 'Show', 'Concert', 'Other'].includes(item.eventType) &&
        isUpcoming(item) &&
        isInSelectedCity(item),
    },
    {
      label: t('event.category.lesson'),
      value: 'lesson',
      icon: '🎓',
      filter: (item) =>
        ['Workshop', 'Course'].includes(item.eventType) &&
        isUpcoming(item) &&
        isInSelectedCity(item),
    },
    {
      label: t('event.category.online'),
      value: 'online',
      icon: '📺',
      filter: (item) => item.online === 'Yes' && isUpcoming(item),
    },
    {
      label: t('event.category.travel'),
      value: 'travel',
      icon: '✈️',
      types: ['Festival', 'Congress'],
      filter: (item) =>
        ['Festival', 'Congress'].includes(item.eventType) && isUpcoming(item),
    },
  ]

  function addLabelIcons(options) {
    return options.map((type) => ({
      ...type,
      label: `${type.icon}  ${type.label}`,
    }))
  }

  const eventTypeListIcons = eventTypeList.map((type) => ({
    ...type,
    label: `${type.icon}  ${type.label}`,
  }))

  function getEventIcon(eventType) {
    const typeOption =
      eventTypeListIcons.find((type) => type.value === eventType) || 'Other'

    return typeOption.icon
  }

  const eventFields = [
    {
      name: 'name',
      hideLabel: true,
      placeholder: 'Event Name',
    },
    {
      name: 'description',
      hideLabel: true,
      component: 'TInputTextarea',
      placeholder: 'Details (markdown)',
      tips:
        'Pitch yourself: Who are you? What do you offer? What do you want?\n\nTips for effective pitch:\n- Uncomplicated: It should be catchy and roll off the tongue\n- Concise: It shouldn’t take more than a minute to say or read\n- Unique: It reflects your skills, goals, and desires\n- Storyline: It covers who you are, what you offer, and where you want to be\n- Appealing: Your elevator pitch is essentially a persuasive sales pitch; the emphasis should be on what you offer',
      description:
        'Use [widgets](https://wedance.vip/markdown), including images and videos',
    },
    {
      name: 'startDate',
      type: 'datetime-local',
      label: 'When?',
      labelPosition: 'top',
      simple: true,
      onChange: updateEndDate,
    },
    {
      name: 'venue',
      label: 'Where?',
      labelPosition: 'top',
      component: 'TInputVenue',
      simple: true,
    },
    {
      name: 'duration',
      label: 'How long?',
      onChange: updateEndDate,
      component: 'TInputSelect',
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
      type: 'datetime-local',
      when: (e) => e.duration === 'custom',
    },
    {
      name: 'price',
      labelPosition: 'top',
      placeholder: '',
      description: 'Please include currency, i.e. EUR, USD',
    },
    {
      name: 'styles',
      label: 'Dance styles',
      component: 'TInputStylesSelect2',
    },
    {
      name: 'eventType',
      component: 'TInputSelect',
      options: eventTypeList,
    },
    {
      name: 'cover',
      component: 'TInputPhoto',
      width: 500,
      height: 500,
      circle: false,
      hideLabel: true,
    },
    {
      name: 'visibility',
      component: 'TInputButtons',
      options: ['Public', 'Members', 'Unlisted'],
      description: `- Public - searchable in Google.\n- Members - visible only for logged-in users.\n- Unlisted - possible to open with exact link, but they are not listed nor not shown in the search.`,
    },
    {
      name: 'claimed',
      label: 'Are you organiser?',
      component: 'TInputButtons',
      options: ['Yes', 'No'],
      description: 'Are you the event organiser?',
    },
    {
      name: 'organiser',
      label: 'Organiser',
      description: 'Username on WeDance',
    },
    {
      name: 'username',
      admin: true,
    },
    {
      name: 'online',
      label: 'Online?',
      component: 'TInputButtons',
      options: ['Yes', 'No'],
      onChange: updatePlace,
      description: 'Streaming via Zoom, Google Meet, Instagram Live, etc.?',
    },
    {
      name: 'international',
      label: 'International?',
      component: 'TInputButtons',
      options: ['Yes', 'No'],
      onChange: updatePlace,
      description:
        'Is it a big event with >500 guests, like festival or online?',
    },
    {
      name: 'place',
      label: 'Community',
      component: 'TInputPlace',
      clearable: true,
      when: (answers) => answers.international === 'No',
      description:
        'Leave empty if you want your event to be shown in all cities',
    },
    {
      name: 'form',
      label: 'External registration?',
      before: 'Do you use external platform to register for your event?',
      component: 'TInputButtons',
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
      component: 'TInputButtons',
      options: ['Yes', 'No'],
      description:
        'Send us link to your event on [Instagram](https://instagram.com/wedancevip) and we will promote it on our social media channels: Telegram, Instagram, Facebook and Twitter.',
    },
    {
      name: 'confirmation',
      labelPosition: 'top',
      label: 'Confirmation email for guests',
      component: 'TInputTextarea',
      placeholder: 'Example: Dear guest, you are confirmed to our event.',
    },
    {
      name: 'type',
      admin: true,
      component: 'TInputSelect',
      options: postTypeList,
    },
  ]

  return {
    eventCategoryOptions,
    eventTypeList,
    eventTypeListIcons,
    getEventIcon,
    eventFields,
    addLabelIcons,
  }
}

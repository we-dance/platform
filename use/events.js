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

export const useEvents = () => {
  const { currentCity } = useCities()
  const { postTypeList } = usePosts()
  const { t } = useI18n()

  const eventRoleOptions = [
    {
      label: t('event.role.instructor'),
      value: 'instructor',
    },
    {
      label: t('event.role.dj'),
      value: 'dj',
    },
    {
      label: t('event.role.musician'),
      value: 'musician',
    },
    {
      label: t('event.role.taxi'),
      value: 'taxi',
    },
    {
      label: t('event.role.photographer'),
      value: 'photographer',
    },
    {
      label: t('event.role.organiser'),
      value: 'organiser',
    },
  ]

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
      name: 'cover',
      component: 'TInputPhoto',
      labelPosition: 'top',
      width: 500,
      height: 500,
      circle: false,
    },
    {
      name: 'eventType',
      labelPosition: 'top',
      component: 'TInputSelect',
      options: eventTypeList,
    },
    {
      name: 'styles',
      labelPosition: 'top',
      label: 'Dance styles',
      component: 'TInputStylesSelect2',
    },
    {
      name: 'name',
      labelPosition: 'top',
      placeholder: 'Event Name',
    },
    {
      name: 'description',
      labelPosition: 'top',
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
      labelPosition: 'top',
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
      name: 'visibility',
      labelPosition: 'top',
      component: 'TInputButtons',
      options: ['Public', 'Members', 'Unlisted'],
      description: `- Public - searchable in Google.\n- Members - visible only for logged-in users.\n- Unlisted - possible to open with exact link, but they are not listed nor not shown in the search.`,
    },
    {
      name: 'artists',
      component: 'TInputArray',
      children: {
        component: 'TInputProfile',
      },
      label: t('event.artists'),
      labelPosition: 'top',
    },
    {
      name: 'org',
      component: 'TInputProfile',
      label: 'Organiser',
      labelPosition: 'top',
    },
    {
      name: 'online',
      label: 'Online?',
      component: 'TInputButtons',
      options: ['Yes', 'No'],
      description: 'Streaming via Zoom, Google Meet, Instagram Live, etc.?',
      labelPosition: 'top',
    },
    {
      name: 'international',
      label: 'International?',
      labelPosition: 'top',
      component: 'TInputButtons',
      options: ['Yes', 'No'],
      description:
        'Is it a big event with >500 guests, like festival or congress?',
    },
    {
      name: 'place',
      label: 'Community',
      labelPosition: 'top',
      component: 'TInputPlace',
      clearable: true,
    },
    {
      name: 'form',
      label: 'External registration?',
      labelPosition: 'top',
      before: 'Do you use external platform to register for your event?',
      component: 'TInputButtons',
      options: ['Yes', 'No'],
    },
    {
      name: 'link',
      labelPosition: 'top',
      description:
        'Direct booking link on ticket platform (ti.to, Eventbrite, Google Form, etc.)',
    },
    {
      name: 'facebook',
      labelPosition: 'top',
      description: 'Facebook event',
    },
    {
      name: 'confirmation',
      labelPosition: 'top',
      label: 'Confirmation email for guests',
      component: 'TInputTextarea',
      placeholder: 'Example: Dear guest, you are confirmed to our event.',
    },
    {
      name: 'promo',
      label: 'Do you want free promo?',
      labelPosition: 'top',
      component: 'TInputButtons',
      options: ['Yes', 'No'],
      description:
        'Send us link to your event on [Instagram](https://instagram.com/wedancevip) and we will promote it on our social media channels: Telegram, Instagram, Facebook and Twitter.',
    },
  ]

  return {
    eventCategoryOptions,
    eventTypeList,
    eventTypeListIcons,
    getEventIcon,
    eventFields,
    addLabelIcons,
    eventRoleOptions,
  }
}

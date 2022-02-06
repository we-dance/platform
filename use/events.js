import { addMinutes, parseISO } from 'date-fns'
import { useCities } from './cities'
import { useI18n } from '~/use/i18n'
import { getYmd } from '~/utils'

const updateEndDate = (e) => {
  if (!e.duration || e.duration === 'custom') {
    return
  }

  e.endDate = addMinutes(parseISO(e.startDate), e.duration)
}

export const useEvents = () => {
  const { t } = useI18n()
  const { currentCity } = useCities()
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
      placeholder: t('event.name.placeholder'),
      label: t('event.name.label'),
    },
    {
      name: 'description',
      labelPosition: 'top',
      component: 'TInputTextarea',
      placeholder: t('profile.story.placeholder'),
      tips: t('profile.story.tips'),
      description: t('event.description'),
    },
    {
      name: 'startDate',
      type: 'datetime-local',
      label: t('event.when'),
      labelPosition: 'top',
      simple: true,
      onChange: updateEndDate,
    },
    {
      name: 'venue',
      label: t('event.where'),
      labelPosition: 'top',
      component: 'TInputVenue',
      simple: true,
    },
    {
      name: 'duration',
      label: t('event.duration'),
      labelPosition: 'top',
      onChange: updateEndDate,
      component: 'TInputSelect',
      options: [
        {
          value: 30,
          label: t('event.duration.thirtyMinutes'),
        },
        {
          value: 60,
          label: t('event.duration.oneHour'),
        },
        {
          value: 90,
          label: t('event.duration.ninetyMinutes'),
        },
        {
          value: 120,
          label: t('event.duration.twoHours'),
        },
        {
          value: 180,
          label: t('event.duration.threeHours'),
        },
        {
          value: 240,
          label: t('event.duration.fourHours'),
        },
        {
          value: 300,
          label: t('event.duration.fiveHours'),
        },
        {
          value: 'custom',
          label: t('event.duration.custom'),
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
      description: t('event.price.description'),
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
      label: t('event.org.label'),
      labelPosition: 'top',
    },
    {
      name: 'online',
      label: t('event.mode.online'),
      component: 'TInputButtons',
      options: ['Yes', 'No'],
      description: 'Streaming via Zoom, Google Meet, Instagram Live, etc.?',
      labelPosition: 'top',
    },
    {
      name: 'international',
      label: t('event.location.international'),
      labelPosition: 'top',
      component: 'TInputButtons',
      options: ['Yes', 'No'],
      description:
        'Is it a big event with >500 guests, like festival or congress?',
    },
    {
      name: 'place',
      label: t('event.place.community'),
      labelPosition: 'top',
      component: 'TInputPlace',
      clearable: true,
    },
    {
      name: 'form',
      label: t('event.external.registration'),
      labelPosition: 'top',
      before: 'Do you use external platform to register for your event?',
      component: 'TInputButtons',
      options: ['Yes', 'No'],
    },
    {
      name: 'link',
      labelPosition: 'top',
      description: t('event.link.description'),
    },
    {
      name: 'facebook',
      labelPosition: 'top',
      description: t('event.facebook.description'),
    },
    {
      name: 'confirmation',
      labelPosition: 'top',
      label: t('event.confirmation.email'),
      component: 'TInputTextarea',
      placeholder: t('event.confirmation.placeholder'),
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

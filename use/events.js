import { addMinutes, parseISO } from 'date-fns'
import { useCities } from './cities'
import { useI18n } from '~/use/i18n'
import { getYmd } from '~/utils'
import { useCommon } from '~/use/common'

const updateEndDate = (e) => {
  if (!e.duration || e.duration === 'custom') {
    return
  }

  e.endDate = addMinutes(parseISO(e.startDate), e.duration)
}

export const useEvents = () => {
  const { t } = useI18n()
  const { currentCity } = useCities()
  const { visibilityOptions, yesNoOptions } = useCommon()

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
      label: t('event.cover'),
      component: 'TInputPhoto',
      labelPosition: 'top',
      width: 500,
      height: 500,
      circle: false,
    },
    {
      name: 'eventType',
      label: t('event.type'),
      labelPosition: 'top',
      component: 'TInputSelect',
      options: eventTypeList,
      validation: (val) => !!val,
      validationError: 'please select event type',
    },
    {
      name: 'styles',
      labelPosition: 'top',
      label: t('event.styles'),
      component: 'TInputStylesSelect2',
    },
    {
      name: 'name',
      labelPosition: 'top',
      placeholder: t('event.name.placeholder'),
      label: t('event.name.label'),
      validation: (val) => !!val.trim(),
      validationError: 'please enter event name',
    },
    {
      name: 'description',
      label: t('event.description.label'),
      labelPosition: 'top',
      component: 'TInputTextarea',
      placeholder: t('event.description.placeholder'),
      tips: t('event.description.tips'),
      description: t('event.description.description'),
    },
    {
      name: 'startDate',
      type: 'datetime-local',
      labelPosition: 'top',
      label: t('event.startDate'),
      simple: true,
      onChange: updateEndDate,
      validation: (val) => !!val,
      validationError: 'please enter a valid event start date',
    },
    {
      name: 'venue',
      label: t('event.venue'),
      labelPosition: 'top',
      component: 'TInputVenue',
      simple: true,
    },
    {
      name: 'duration',
      label: t('event.duration.label'),
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
      label: t('event.price.label'),
      description: t('event.price.description'),
    },
    {
      name: 'visibility',
      labelPosition: 'top',
      component: 'TInputButtons',
      options: visibilityOptions,
      label: t('visibility.label'),
      description: t('visibility.description'),
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
      label: t('event.online.label'),
      component: 'TInputButtons',
      options: yesNoOptions,
      description: t('event.online.description'),
      labelPosition: 'top',
    },
    {
      name: 'international',
      label: t('event.international.label'),
      labelPosition: 'top',
      component: 'TInputButtons',
      options: yesNoOptions,
      description: t('event.international.description'),
    },
    {
      name: 'place',
      label: t('event.place.label'),
      labelPosition: 'top',
      component: 'TInputPlace',
      clearable: true,
    },
    {
      name: 'form',
      label: t('event.form.label'),
      labelPosition: 'top',
      before: t('event.form.before'),
      component: 'TInputButtons',
      options: yesNoOptions,
    },
    {
      name: 'link',
      labelPosition: 'top',
      description: t('event.link.description'),
      label: t('event.link.label'),
    },
    {
      name: 'facebook',
      labelPosition: 'top',
      description: t('event.facebook.description'),
      label: t('event.facebook.label'),
    },
    {
      name: 'confirmation',
      labelPosition: 'top',
      label: t('event.confirmation.label'),
      component: 'TInputTextarea',
      placeholder: t('event.confirmation.placeholder'),
    },
    {
      name: 'promo',
      label: t('event.promo.label'),
      labelPosition: 'top',
      component: 'TInputButtons',
      options: yesNoOptions,
      description: t('event.promo.description'),
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

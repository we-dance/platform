import { addMinutes, parseISO } from 'date-fns'
import { useCities } from './cities'
import { useI18n } from '~/use/i18n'
import { getYmd, toDatetimeLocal } from '~/utils'
import { useCommon } from '~/use/common'

const updateEndDate = (newItem, oldItem) => {
  if (oldItem?.endDate) {
    return
  }

  newItem.endDate = toDatetimeLocal(addMinutes(parseISO(newItem.startDate), 60))
}

export const useEvents = () => {
  const { t } = useI18n()
  const { currentCity } = useCities()
  const { yesNoOptions } = useCommon()

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
      filter: (item) => isUpcoming(item) && isInSelectedCity(item),
    },
    {
      label: t('event.category.lesson'),
      value: 'lesson',
      icon: '🎓',
      filter: (item) =>
        ['Workshop', 'Course'].includes(item.eventType) &&
        isUpcoming(item) &&
        (isInSelectedCity(item) || item.online === 'Yes'),
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
      name: 'org',
      component: 'TInputProfile',
      label: t('event.org.label'),
      labelPosition: 'top',
    },
    {
      name: 'name',
      labelPosition: 'top',
      placeholder: t('event.name.placeholder'),
      label: t('event.name.label'),
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
      name: 'startDate',
      type: 'datetime-local',
      labelPosition: 'top',
      label: t('event.startDate'),
      simple: true,
      onChange: updateEndDate,
    },
    {
      name: 'endDate',
      type: 'datetime-local',
      labelPosition: 'top',
      label: t('event.endDate'),
      simple: true,
    },
    {
      name: 'venue',
      label: t('event.venue'),
      labelPosition: 'top',
      component: 'TInputVenue',
      simple: true,
    },
    {
      name: 'place',
      label: t('event.place.label'),
      labelPosition: 'top',
      component: 'TInputPlace',
      clearable: true,
    },
    {
      name: 'price',
      labelPosition: 'top',
      label: t('event.price.label'),
      description: t('event.price.description'),
    },
    {
      name: 'eventType',
      label: t('event.type'),
      labelPosition: 'top',
      component: 'TInputSelect',
      options: eventTypeList,
    },
    {
      name: 'styles',
      labelPosition: 'top',
      label: t('event.styles'),
      component: 'TInputStylesSelect2',
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
      name: 'program',
      component: 'TInputArray',
      children: {
        component: 'TInputEvent',
      },
      labelPosition: 'top',
    },
    {
      name: 'description',
      label: t('event.description.label'),
      labelPosition: 'top',
      component: 'TInputTextarea',
      placeholder: t('event.description.placeholder'),
      max: 140,
    },
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
      name: 'confirmation',
      labelPosition: 'top',
      label: t('event.confirmation.label'),
      component: 'TInputTextarea',
      placeholder: t('event.confirmation.placeholder'),
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

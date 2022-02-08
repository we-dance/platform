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
  const { t } = useI18n()
  const { currentCity } = useCities()
  const { postTypeList } = usePosts()

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
      name: 'name',
      labelPosition: 'top',
      placeholder: t('events.edit.form.eventName'),
    },
    {
      name: 'description',
      labelPosition: 'top',
      component: 'TInputTextarea',
      placeholder: t('profile.story.placeholder'),
      tips: t('profile.story.tips'),
      description: t('events.edit.form.description'),
    },
    {
      name: 'startDate',
      type: 'datetime-local',
      label: t('events.edit.form.when'),
      labelPosition: 'top',
      simple: true,
      onChange: updateEndDate,
    },
    {
      name: 'venue',
      label: t('events.edit.form.where'),
      labelPosition: 'top',
      component: 'TInputVenue',
      simple: true,
    },
    {
      name: 'duration',
      label: t('events.edit.form.duration'),
      labelPosition: 'top',
      onChange: updateEndDate,
      component: 'TInputSelect',
      options: [
        {
          value: 30,
          label: t('events.edit.form.duration.thirtyMinutes'),
        },
        {
          value: 60,
          label: t('events.edit.form.duration.oneHour'),
        },
        {
          value: 90,
          label: t('events.edit.form.duration.ninetyMinutes'),
        },
        {
          value: 120,
          label: t('events.edit.form.duration.twoHours'),
        },
        {
          value: 180,
          label: t('events.edit.form.duration.threeHours'),
        },
        {
          value: 240,
          label: t('events.edit.form.duration.fourHours'),
        },
        {
          value: 300,
          label: t('events.edit.form.duration.fiveHours'),
        },
        {
          value: 'custom',
          label: t('events.edit.form.duration.custom'),
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
      description: t('events.edit.form.price.description'),
    },
    {
      name: 'styles',
      labelPosition: 'top',
      label: t('events.edit.form.styles'),
      component: 'TInputStylesSelect2',
    },
    {
      name: 'eventType',
      labelPosition: 'top',
      component: 'TInputSelect',
      options: eventTypeList,
    },
    {
      name: 'cover',
      component: 'TInputPhoto',
      labelPosition: 'top',
      width: 500,
      height: 500,
      circle: false,
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
      label: t('events.edit.form.organiser'),
      labelPosition: 'top',
    },
    {
      name: 'online',
      label: t('events.edit.form.mode.online'),
      component: 'TInputButtons',
      options: ['Yes', 'No'],
      onChange: updatePlace,
      description: t('events.edit.form.mode.description'),
      labelPosition: 'top',
    },
    {
      name: 'international',
      label: t('events.edit.form.location.international'),
      labelPosition: 'top',
      component: 'TInputButtons',
      options: ['Yes', 'No'],
      onChange: updatePlace,
      description: t('events.edit.form.location.description'),
    },
    {
      name: 'place',
      label: t('events.edit.form.place.community'),
      labelPosition: 'top',
      component: 'TInputPlace',
      clearable: true,
      when: (answers) => answers.international === 'No',
      description: t('events.edit.form.place.description'),
    },
    {
      name: 'form',
      label: t('events.edit.form.external.registration'),
      labelPosition: 'top',
      before: 'Do you use external platform to register for your event?',
      component: 'TInputButtons',
      options: ['Yes', 'No'],
    },
    {
      name: 'link',
      labelPosition: 'top',
      description: t('events.edit.form.link.description'),
    },
    {
      name: 'facebook',
      labelPosition: 'top',
      description: t('events.edit.form.facebook.description'),
    },
    {
      name: 'promo',
      label: t('events.edit.form.promo.free'),
      labelPosition: 'top',
      component: 'TInputButtons',
      options: ['Yes', 'No'],
      description: t('events.edit.form.promo.description'),
    },
    {
      name: 'confirmation',
      labelPosition: 'top',
      label: t('events.edit.form.confirmation.email'),
      component: 'TInputTextarea',
      placeholder: t('events.edit.form.confirmation.placeholder'),
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
    eventRoleOptions,
  }
}

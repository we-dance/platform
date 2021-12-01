export const useEvents = () => {
  const eventTypeList = [
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

  const eventTypeListIcons = eventTypeList.map((type) => ({
    ...type,
    label: `${type.icon}  ${type.label}`,
  }))

  return {
    eventTypeList,
    eventTypeListIcons,
  }
}

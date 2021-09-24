export const useEvents = () => {
  const eventTypeList = [
    {
      label: 'Party',
      value: 'Party',
    },
    {
      label: 'Workshop',
      value: 'Workshop',
    },
    {
      label: 'Course',
      value: 'Course',
    },
    {
      label: 'Festival',
      value: 'Festival',
    },
    {
      label: 'Congress',
      value: 'Congress',
    },
    {
      label: 'Concert',
      value: 'Concert',
    },
    {
      label: 'Show',
      value: 'Show',
    },
    {
      label: 'Other',
      value: 'Other',
    },
  ]

  return {
    eventTypeList,
  }
}

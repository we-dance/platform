export const useVenues = () => {
  const venueFields = [
    {
      name: 'name',
      label: 'Name',
    },
    {
      name: 'rooms',
      label: 'Areas/Rooms',
      component: 'TInputTextarea',
      description: 'One area per line',
    },
    {
      name: 'map',
      component: 'TInputPhoto',
      label: 'Venue map',
      width: 1280,
      height: 720,
    },
  ]
  return {
    venueFields,
  }
}

export const postFilters = [
  {
    name: 'community',
    type: 'collection',
    collection: 'cities',
    keyValue: 'name',
    keyLabel: (c) => `${c.name}, ${c.location.country}`,
    clearable: true,
    hideLabel: true,
    placeholder: 'City'
  },
  {
    name: 'dance',
    type: 'style',
    hideLabel: true,
    placeholder: 'Style',
    compare: (item, field, value) =>
      item[field][value] && item[field][value].selected,
    mineOnly: true
  }
]

export const postSorts = [
  {
    value: '-savedByCount',
    label: 'Popular'
  },
  {
    value: '-createdAt',
    label: 'Newest'
  }
]

export const postFilters = [
  {
    name: 'place',
    type: 'place',
    compare: (item, field, value) => !item[field] || item[field] === value,
    clearable: true,
    hideLabel: true,
    placeholder: 'City',
    when: () => false
  },
  {
    name: 'dance',
    type: 'style',
    hideLabel: true,
    placeholder: 'Style',
    compare: (item, field, value) =>
      item && item[field] && item[field][value] && item[field][value].selected,
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

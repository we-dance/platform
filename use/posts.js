import { useI18n } from '~/use/i18n'

export const usePosts = () => {
  const { t } = useI18n()

  const filterTypeList = [
    { label: 'Newest', value: 'Newest' },
    { label: 'Saved', value: 'Starred' },
    { label: 'Mine', value: 'Authored' },
  ]

  const postTypeList = [
    {
      label: t('feed.category'),
      value: '',
    },
    {
      label: t('feed.post'),
      value: 'post',
    },
  ]

  const postFilters = [
    {
      name: 'place',
      component: 'TInputPlace',
      compare: (item, field, value) => !item[field] || item[field] === value,
      clearable: true,
      hideLabel: true,
      placeholder: 'City',
      when: () => false,
    },
    {
      name: 'dance',
      component: 'TInputStyle',
      hideLabel: true,
      placeholder: 'Style',
      compare: (item, field, value) =>
        item &&
        item[field] &&
        item[field][value] &&
        item[field][value].selected,
      mineOnly: true,
    },
  ]

  const postSorts = [
    {
      value: '-savedByCount',
      label: 'Popular',
    },
    {
      value: '-createdAt',
      label: 'Newest',
    },
  ]

  const postFields = [
    {
      name: 'title',
      hideLabel: true,
      placeholder: t('postFields.title.placeholder'),
    },
    {
      name: 'description',
      hideLabel: true,
      component: 'TInputTextarea',
      placeholder: t('postFields.description.placeholder'),
      tips: t('postFields.description.tips'),
      description: t('postFields.description.description'),
    },
    {
      name: 'url',
      hideLabel: true,
      placeholder: t('postFields.url.placeholder'),
    },
    {
      name: 'cover',
      component: 'TInputPhoto',
      width: 500,
      height: 500,
      circle: false,
      hideLabel: true,
    },
    {
      name: 'styles',
      component: 'TInputStylesSelect2',
      label: t('postFields.styles.label'),
    },
  ]

  return {
    postTypeList,
    postFilters,
    postSorts,
    postFields,
    filterTypeList,
  }
}

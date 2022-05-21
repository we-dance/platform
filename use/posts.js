import { useI18n } from '~/use/i18n'

export const usePosts = () => {
  const { t } = useI18n()

  const filterTypeList = [
    { label: t('sort.newest'), value: 'Newest' },
    { label: t('sort.hot'), value: 'Hot' },
    { label: t('sort.popular'), value: 'Popular' },
    { label: t('sort.watching'), value: 'Watching' },
    { label: t('sort.starred'), value: 'Starred' },
    { label: t('sort.archived'), value: 'Archived' },
    { label: t('sort.yours'), value: 'Authored' },
  ]

  const postTypeList = [
    {
      label: t('feed.category'),
      value: '',
    },
    {
      label: t('feed.needPartner'),
      value: 'needPartner',
    },
    {
      label: t('feed.needEvents'),
      value: 'needEvents',
    },
    {
      label: t('feed.needInstructor'),
      value: 'needInstructor',
    },
    {
      label: t('feed.trip'),
      value: 'trip',
    },
    {
      label: t('feed.event'),
      value: 'event',
    },
    {
      label: t('feed.artist'),
      value: 'artist',
    },
    {
      label: t('feed.venue'),
      value: 'venue',
    },
    {
      label: t('feed.app'),
      value: 'app',
    },
    {
      label: t('feed.guide'),
      value: 'guide',
    },
    {
      label: t('feed.inspiration'),
      value: 'inspiration',
    },
    {
      label: t('feed.question'),
      value: 'question',
    },
    {
      label: t('feed.poll'),
      value: 'poll',
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
      name: 'type',
      component: 'TInputSelect',
      label: t('postFields.type.label'),
      options: postTypeList,
    },
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

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
      type: 'place',
      compare: (item, field, value) => !item[field] || item[field] === value,
      clearable: true,
      hideLabel: true,
      placeholder: 'City',
      when: () => false,
    },
    {
      name: 'dance',
      type: 'style',
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
      name: 'username',
      admin: true,
    },
    {
      name: 'type',
      type: 'select',
      options: postTypeList,
    },
    {
      name: 'title',
      hideLabel: true,
      placeholder: 'Title',
    },
    {
      name: 'description',
      hideLabel: true,
      type: 'textarea',
      placeholder: 'Text (markdown)',
      tips:
        'Pitch yourself: Who are you? What do you offer? What do you want?\n\nTips for effective pitch:\n- Uncomplicated: It should be catchy and roll off the tongue\n- Concise: It shouldn’t take more than a minute to say or read\n- Unique: It reflects your skills, goals, and desires\n- Storyline: It covers who you are, what you offer, and where you want to be\n- Appealing: Your elevator pitch is essentially a persuasive sales pitch; the emphasis should be on what you offer',
      description:
        'Use [widgets](https://wedance.vip/markdown), including images and videos',
    },
    {
      name: 'url',
      hideLabel: true,
      placeholder: 'Link',
    },
    {
      name: 'cover',
      type: 'photo',
      width: 500,
      height: 500,
      circle: false,
      hideLabel: true,
    },
    {
      name: 'styles',
      label: 'Dance styles',
      type: 'stylesSelect',
    },
    {
      name: 'hideMeta',
      admin: true,
    },
    {
      name: 'hideComments',
      admin: true,
    },
    {
      name: 'hideReactions',
      admin: true,
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

import { useI18n } from '~/use/i18n'

export const useCommon = () => {
  const { t } = useI18n()

  const yesNoOptions = [
    {
      label: t('yes'),
      value: 'Yes',
    },
    {
      label: t('no'),
      value: 'No',
    },
  ]

  const visibilityOptions = [
    {
      label: t('visibility.public'),
      value: 'Public',
    },
    {
      label: t('visibility.members'),
      value: 'Members',
    },
    {
      label: t('visibility.unlisted'),
      value: 'Unlisted',
    },
  ]

  return {
    yesNoOptions,
    visibilityOptions,
  }
}

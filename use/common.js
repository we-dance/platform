import { useI18n } from '~/use/i18n'

export const useCommon = () => {
  const { t } = useI18n()

  const booleanOptions = [
    {
      label: t('profile.booleanOptions.yes'),
      value: 'Yes',
    },
    {
      label: t('profile.booleanOptions.no'),
      value: 'No',
    },
  ]

  return {
    booleanOptions,
  }
}

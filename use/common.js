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

  return {
    yesNoOptions,
  }
}

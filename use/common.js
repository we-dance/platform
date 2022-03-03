import { useI18n } from '~/use/i18n'

export const useCommon = () => {
  const { t } = useI18n()

  const yesNoOptions = [
    {
      label: t('common.yes'),
      value: 'Yes',
    },
    {
      label: t('common.no'),
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

  const genderList = [
    {
      label: t('common.female'),
      value: 'Female',
    },
    {
      label: t('common.male'),
      value: 'Male',
    },
    {
      label: t('common.other'),
      value: 'Other',
    },
  ]

  const days = [
    {
      label: t('common.Monday'),
      value: 'Monday',
    },
    {
      label: t('common.Tuesday'),
      value: 'Tuesday',
    },
    {
      label: t('common.Wednesday'),
      value: 'Wednesday',
    },
    {
      label: t('common.Thursday'),
      value: 'Thursday',
    },
    {
      label: t('common.Friday'),
      value: 'Friday',
    },
    {
      label: t('common.Saturday'),
      value: 'Saturday',
    },
    {
      label: t('common.Sunday'),
      value: 'Sunday',
    },
  ]

  return {
    yesNoOptions,
    visibilityOptions,
    genderList,
    days,
  }
}

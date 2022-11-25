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
      label: t('Monday'),
      value: 'Monday',
    },
    {
      label: t('Tuesday'),
      value: 'Tuesday',
    },
    {
      label: t('Wednesday'),
      value: 'Wednesday',
    },
    {
      label: t('Thursday'),
      value: 'Thursday',
    },
    {
      label: t('Friday'),
      value: 'Friday',
    },
    {
      label: t('Saturday'),
      value: 'Saturday',
    },
    {
      label: t('Sunday'),
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

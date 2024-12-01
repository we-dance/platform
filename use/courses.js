import firebase from 'firebase/app'
import 'firebase/firestore'
import { useCities } from '~/use/cities'
import { useI18n } from '~/use/i18n'
import { getYmd } from '~/utils'
import { useCommon } from '~/use/common'
import { useAuth } from '~/use/auth'

export const useCourses = () => {
  const { t } = useI18n()
  const { currentCity } = useCities()
  const { yesNoOptions } = useCommon()
  const { isAdmin } = useAuth()

  const courseFields = [
    {
      name: 'name',
      labelPosition: 'top',
      placeholder: 'Course name',
      label: t('event.name.label'),
      required: true,
    },
    {
      name: 'styles',
      labelPosition: 'top',
      label: t('event.styles.label'),
      description: t('event.styles.description'),
      component: 'TInputStylesSelect2',
    },
    {
      name: 'price',
      labelPosition: 'top',
      label: t('event.price.label'),
      description: t('event.price.description'),
      validate(value) {
        if (!value) {
          return true
        }

        if (isNaN(value)) {
          return true
        }
      },
      validationError: 'Please add currency',
    },
    {
      name: 'description',
      label: t('event.description.label'),
      description: t('event.description.description'),
      labelPosition: 'top',
      component: 'TInputTextarea',
      placeholder: t('event.description.placeholder'),
      max: 280,
    },
    {
      name: 'org',
      component: 'TInputProfile',
      label: t('event.org.label'),
      before: t('event.org.description'),
      labelPosition: 'top',
    },
  ]

  return {
    courseFields,
  }
}

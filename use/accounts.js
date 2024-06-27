import moment from 'moment-timezone'
import { useDoc } from '~/use/doc'
import { useI18n } from '~/use/i18n'

export const useAccounts = () => {
  const { t } = useI18n()
  const { load } = useDoc('accounts')

  const getAccount = (uid) => load(uid) || {}
  const getAccountByEmail = (email) => find('email', email)

  const accountFields = [
    {
      name: 'name',
      label: t('account.name'),
      required: true,
      event: true,
    },
    {
      name: 'email',
      label: t('account.email'),
      register: true,
      required: true,
      event: true,
    },
    {
      name: 'phone',
      label: t('account.phone'),
      register: false,
      required: true,
      event: true,
    },
    {
      name: 'password',
      type: 'password',
      label: t('account.password'),
      register: true,
      required: true,
    },
    {
      name: 'zone',
      label: t('account.zone'),
      component: 'TRichSelect',
      options: moment.tz.names(),
    },
    {
      name: 'emailConsent',
      label: t('account.emailConsent'),
      component: 'TCheckbox',
      register: true,
      hideLabel: true,
      validate(value) {
        return value
      },
      validationError: t('account.emailConsentError'),
    },
  ]

  return {
    getAccount,
    getAccountByEmail,
    accountFields,
  }
}

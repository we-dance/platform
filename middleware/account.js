import ls from 'local-storage'
import useAuth from '~/use/auth'

export default async ({ route, redirect }) => {
  const { getAccount, confirmedAccount } = useAuth()

  await getAccount()

  if (!confirmedAccount.value) {
    ls('target', route.fullPath)
    redirect('/account')
  }
}

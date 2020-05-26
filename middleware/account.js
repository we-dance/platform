import ls from 'local-storage'
import useAuth from '~/use/auth'

export default async ({ route, redirect }) => {
  const { getAccount, isAccountConfirmed } = useAuth()

  await getAccount()

  if (!isAccountConfirmed() && route.name !== 'settings') {
    ls('target', route.fullPath)
    redirect('/settings')
  }
}

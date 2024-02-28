import { useAuth } from '~/use/auth'

export default async ({ route, redirect }) => {
  const { getAccount, loadProfile, username } = useAuth()

  await getAccount()
  await loadProfile()

  const routes = ['/onboarding', '/signout', '/signin']

  if (!username.value && !routes.includes(route.path)) {
    redirect('/onboarding')
  }
}

import { useAuth } from '~/use/auth'

export default async ({ route, redirect }) => {
  const { getAccount, username } = useAuth()

  await getAccount()

  const routes = ['/onboarding', '/signout', '/signin']

  if (!username.value && !routes.includes(route.path)) {
    redirect('/onboarding')
  }
}

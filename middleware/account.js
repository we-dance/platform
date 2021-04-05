import { useAuth } from '~/use/auth'

export default async ({ route, redirect }) => {
  const { getAccount, uid } = useAuth()

  await getAccount()

  const routes = ['/onboarding', '/signout']

  if (!uid.value && !routes.includes(route.path)) {
    redirect('/onboarding')
  }
}

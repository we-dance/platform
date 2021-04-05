import accountMiddleware from './account'
import { useAuth } from '~/use/auth'

export default async ({ route, redirect }) => {
  const { uid } = useAuth()

  if (uid.value) {
    await accountMiddleware({ route, redirect })
  }
}

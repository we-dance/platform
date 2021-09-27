import ls from 'local-storage'
import { useAuth } from '~/use/auth'

export default function({ route, redirect }) {
  const { uid } = useAuth()

  if (!uid.value) {
    ls('target', route.fullPath)
    redirect('/signin')
  }
}

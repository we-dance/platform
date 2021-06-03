import { useAuth } from '~/use/auth'

export default function({ redirect }) {
  const { isAdmin } = useAuth()

  if (!isAdmin()) {
    redirect('/')
  }
}

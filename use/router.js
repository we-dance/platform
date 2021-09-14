import { getRouter } from '~/plugins/router'

export const useRouter = () => {
  const router = getRouter()
  const route = router.currentRoute
  const params = route.params

  return {
    router,
    route,
    params,
  }
}

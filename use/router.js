import { useRouter } from '~/plugins/router'

export default () => {
  const router = useRouter()
  const route = router.currentRoute
  const params = route.params

  return {
    router,
    route,
    params
  }
}

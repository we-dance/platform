let router

export default ({ app }) => {
  router = app.router
}

export const useRouter = () => {
  return router
}

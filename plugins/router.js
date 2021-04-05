let router

export default ({ app }) => {
  router = app.router
}

export const getRouter = () => {
  return router
}

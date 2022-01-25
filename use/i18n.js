import { useContext } from '@nuxtjs/composition-api'

export const useI18n = () => {
  const { app } = useContext()
  const t = app.i18n.t.bind(app.i18n)

  return {
    t,
  }
}

import { computed } from '@vue/composition-api'
import useCollection from '~/use/collection'
import useDoc from '~/use/doc'

export default () => {
  const { docs, getById } = useCollection('tags')
  const { set } = useDoc('tags')

  const tagsOptions = computed(() =>
    docs.value.map((doc) => ({ value: doc.id, label: doc.id }))
  )

  const addTag = (val) => {
    if (!getById(val)) {
      set(val, {
        label: val
      })
    }
  }

  return {
    addTag,
    tagsOptions
  }
}

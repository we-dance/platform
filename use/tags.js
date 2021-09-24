import { computed } from '@nuxtjs/composition-api'
import { useCollection } from '~/use/collection'
import { useDoc } from '~/use/doc'

export const useTags = (selectedCollection) => {
  const collection = selectedCollection || 'tags'

  const { docs, getById } = useCollection(collection)
  const { set } = useDoc(collection)

  const tagsOptions = computed(() =>
    docs.value.map((doc) => ({ value: doc.id, label: doc.id }))
  )

  const addTag = (val) => {
    if (!getById(val)) {
      set(val, {
        label: val,
      })
    }
  }

  return {
    addTag,
    tagsOptions,
  }
}

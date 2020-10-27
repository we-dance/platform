import Vue from 'vue'
import { computed, useContext } from '@nuxtjs/composition-api'

const state = Vue.observable({
  collection: []
})

export default () => {
  const { $content } = useContext()

  const load = async () => {
    state.collection = await $content('styles')
      .sortBy('id')
      .fetch()
  }

  if (!state.collection.length) {
    load()
  }

  const getStyles = (selected) => {
    return Object.keys(selected).map((id) => {
      return {
        ...getStyle(id),
        ...selected[id]
      }
    })
  }

  const levels = [
    {
      value: 'Interested',
      label: 'Interested'
    },
    {
      value: 'Beginner',
      label: 'Beginner'
    },
    {
      value: 'Intermediate',
      label: 'Intermediate'
    },
    {
      value: 'Advanced',
      label: 'Advanced'
    }
  ]

  const getStyle = (id) => {
    return state.collection.find((item) => item.id === id)
  }

  const getStyleName = (id) => {
    const style = getStyle(id)

    if (!style) {
      return ''
    }

    return style.name
  }

  const styles = computed(() => {
    return state.collection
  })

  const categories = computed(() => {
    if (!styles.value) {
      return []
    }

    const result = styles.value.map((item) => item.region)
    const uniqueCategories = [...new Set(result)]
    return uniqueCategories.sort()
  })

  return {
    categories,
    styles,
    getStyle,
    getStyleName,
    levels,
    getStyles
  }
}

import Vue from 'vue'
import { computed, useContext } from '@nuxtjs/composition-api'
import { sortBy } from '~/utils'

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

  const levels = [
    {
      value: 'Interested',
      label: 'Interested',
      weight: 0
    },
    {
      value: 'Beginner',
      label: 'Beginner',
      weight: 1
    },
    {
      value: 'Intermediate',
      label: 'Intermediate',
      weight: 2
    },
    {
      value: 'Advanced',
      label: 'Advanced',
      weight: 3
    }
  ]

  const getStyles = (selected, level = 0, onlyRoot = false, limit = 0) => {
    if (!selected) {
      return []
    }

    let result = Object.keys(selected).map((id) => {
      return {
        ...getStyle(id),
        ...selected[id],
        levelMeta: levels.find((item) => item.value === selected[id].level)
      }
    })

    result = result.filter(
      (item) =>
        item.levelMeta.weight >= level &&
        (onlyRoot ? item.root === 'yes' : true)
    )

    result = result.sort(sortBy('name'))

    const count = result.length

    if (limit && count > limit) {
      result = result.slice(0, limit - 1)

      const newCount = result.length
      const diff = count - newCount

      if (newCount < count) {
        result.push({
          id: 'more',
          name: `and ${diff} more`
        })
      }
    }

    return result
  }

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

  const getAllStyles = (filters) => {
    let result = state.collection

    if (filters) {
      const fields = Object.keys(filters)
      for (const field of fields) {
        result = result.filter((item) => item[field] === filters[field])
      }
    }

    return result.map((item) => ({
      value: item.id,
      label: item.name + (item.synonyms ? ' (' + item.synonyms + ')' : '')
    }))
  }

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
    getStyles,
    getAllStyles
  }
}

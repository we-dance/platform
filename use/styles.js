import Vue from 'vue'
import { computed, useContext } from '@nuxtjs/composition-api'
import { sortBy, search } from '~/utils'

const state = Vue.observable({
  collection: [],
})

export const useStyles = () => {
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
      weight: 0,
    },
    {
      value: 'Beginner',
      label: 'Beginner',
      weight: 1,
    },
    {
      value: 'Intermediate',
      label: 'Intermediate',
      weight: 2,
    },
    {
      value: 'Advanced',
      label: 'Advanced',
      weight: 3,
    },
  ]

  const levelOptions = levels

  const getStylesDropdown = (selected) => {
    const isSelected = selected && Object.keys(selected).length > 0

    if (isSelected) {
      return getStyles(selected).map((item) => ({
        value: item.id,
        label: item.name,
      }))
    }

    return getAllStyles({ root: 'yes' }).results
  }

  const getStyles = (selected, level = 0, highlighted = false, limit = 0) => {
    if (!selected) {
      return []
    }

    let result = Object.keys(selected).map((id) => {
      return {
        ...getStyle(id),
        ...selected[id],
        levelMeta: levels.find((item) => item.value === selected[id].level),
      }
    })

    const highlightedCount = result.filter((i) => i.highlighted).length

    result = result.filter(
      (item) =>
        item.levelMeta.weight >= level &&
        (highlightedCount && highlighted ? item.highlighted : true)
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
          name: `and ${diff} more`,
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

  const getAllStyles = (q, filters) => {
    let results = state.collection

    if (filters) {
      const fields = Object.keys(filters)
      for (const field of fields) {
        results = results.filter((item) => item[field] === filters[field])
      }
    }

    if (q) {
      results = results.filter(
        (i) => search(i.name, q) || search(i.synonyms, q)
      )
    }

    results = results.map((item) => ({
      value: item.id,
      label: item.name,
    }))

    return { results }
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
    levelOptions,
    getStyles,
    getAllStyles,
    getStylesDropdown,
  }
}

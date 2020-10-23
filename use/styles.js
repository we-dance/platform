import { computed } from '@nuxtjs/composition-api'
import { sortBy } from '~/utils'
import stylesAsset from '~/assets/content/styles'

export default () => {
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
    const values = stylesAsset

    if (!values) {
      return {}
    }

    return values[id]
  }

  const getStyleName = (id) => {
    const style = getStyle(id)

    if (!style) {
      return ''
    }

    return style.name
  }

  const styles = computed(() => {
    const values = stylesAsset
    const result = []

    for (const [key, value] of Object.entries(values)) {
      result.push({
        id: key,
        ...value
      })
    }

    return result.sort(sortBy('id'))
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

import { computed } from '@vue/composition-api'
import useDoc from '~/use/doc'
import { sortBy } from '~/utils'

export default () => {
  const { doc, load } = useDoc('settings')

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
    if (!doc.value) {
      return {}
    }

    return doc.value[id]
  }

  const getStyleName = (id) => {
    const style = getStyle(id)

    if (!style) {
      return ''
    }

    return style.name
  }

  const styles = computed(() => {
    if (!doc.value) {
      return []
    }

    return Object.values(doc.value)
      .filter((item) => item?.id)
      .sort(sortBy('id'))
  })

  const categories = computed(() => {
    if (!styles.value) {
      return []
    }

    const result = styles.value.map((item) => item.region)
    const uniqueCategories = [...new Set(result)]
    return uniqueCategories.sort()
  })

  load('styles')

  return {
    categories,
    styles,
    getStyle,
    getStyleName,
    levels,
    getStyles
  }
}

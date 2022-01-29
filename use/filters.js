import { computed, ref } from '@nuxtjs/composition-api'
import { sortBy } from '~/utils'
import { useFullItems } from '~/use/app'

export const useFilters = (docs, fields, defaultFilter, sorting) => {
  const filters = ref(defaultFilter)
  const { items } = useFullItems(docs)

  const results = computed(() => {
    let results = [...items.value]

    if (fields && fields.length && filters.value) {
      const fieldNames = Object.keys(filters.value)

      for (const fieldName of fieldNames) {
        const field = fields.find((f) => f.name === fieldName)

        if (!field) {
          continue
        }

        const defaultCompareFn = (item, field, value) => item[field] === value

        const compareFn = field.compare || defaultCompareFn

        results = results.filter((item) =>
          compareFn(item, fieldName, filters.value[fieldName])
        )
      }
    }

    if (sorting.value) {
      results = results.sort(sortBy(sorting.value))
    }

    return results
  })

  return {
    filters,
    results,
  }
}

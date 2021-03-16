import { computed, ref } from '@vue/composition-api'

export default (items, fields, defaultFilter) => {
  const filters = ref(defaultFilter)

  const results = computed(() => {
    if (!fields || !fields.length) {
      return items.value
    }

    let results = items.value

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

    return results
  })

  return {
    filters,
    results
  }
}

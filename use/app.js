import useDoc from '~/use/doc'

export default () => {
  const { doc, load, loading } = useDoc('app')

  load('latest')

  const read = (collection, id, field) => {
    if (
      !doc.value ||
      !collection ||
      !id ||
      !doc.value[collection] ||
      !doc.value[collection][id]
    ) {
      return ''
    }

    if (!field) {
      return doc.value[collection][id]
    }

    return doc.value[collection][id][field]
  }

  return {
    read,
    loading,
    cache: doc
  }
}

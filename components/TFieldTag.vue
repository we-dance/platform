<template>
  <VueTagsInput
    v-model="tag"
    :tags="val"
    :autocomplete-items="filteredItems"
    class="border px-2 py-1 rounded w-full"
    @tags-changed="onTagsChanged"
  />
</template>

<script>
import VueTagsInput from '@johmun/vue-tags-input'
import { computed } from '@vue/composition-api'
import useCollection from '~/use/collection'
import useDoc from '~/use/doc'

export default {
  components: {
    VueTagsInput
  },
  setup() {
    const { docs, getById } = useCollection('tags')
    const { set } = useDoc('tags')

    const tags = computed(() => docs.value.map((doc) => ({ text: doc.id })))

    return {
      tags,
      set,
      getById
    }
  },
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  },
  data: () => ({
    tag: ''
  }),
  computed: {
    val() {
      return Object.keys(this.value).map((key) => ({ text: key }))
    },
    filteredItems() {
      return this.tags.filter((i) => {
        return i.text.toLowerCase().includes(this.tag.toLowerCase())
      })
    }
  },
  methods: {
    onTagsChanged(tags) {
      const result = {}
      tags.forEach((tag) => {
        if (!this.getById(tag.text)) {
          this.set(tag.text, {
            label: tag.text
          })
        }
        result[tag.text] = true
      })

      this.$emit('input', result)
    }
  }
}
</script>

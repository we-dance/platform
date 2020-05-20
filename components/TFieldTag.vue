<template>
  <div class="border px-2 py-1 rounded w-full">
    <div>
      <div
        v-for="tag in selectedTags"
        :key="tag.value"
        class="px-2 py-1 cursor-pointer mr-1 mb-1 rounded-full inline-block bg-gray-200 "
        @click="remove(tag.value)"
      >
        <div class="flex items-center justify-center">
          <div>{{ tag.label }}</div>
          <div
            class="ml-1 text-white inline-block w-4 h-4 flex items-center justify-center text-red-500"
          >
            <TIcon name="close" />
          </div>
        </div>
      </div>

      <input
        v-model="input"
        placeholder="Add a tag"
        class="focus:outline-none"
        @keyup.enter="add(filteredTags[selectedIndex].value)"
        @keyup.up="dec"
        @keyup.down="inc"
        @keyup.delete="removeLast"
        @focus="showTypeHead = true"
      />
    </div>
    <div class="my-2" v-if="showTypeHead">
      <div
        v-for="(tag, tagIndex) in filteredTags"
        :key="tag.value"
        class="px-2 py-1 cursor-pointer inline-block mr-1 mb-1 text-blue-500 underline"
        :class="tagIndex === selectedIndex ? 'bg-gray-200' : ''"
        @click="add(tag.value)"
      >
        {{ tag.label }}
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from '@vue/composition-api'
import useCollection from '~/use/collection'
import useDoc from '~/use/doc'
import TIcon from '~/components/TIcon'

export default {
  components: {
    TIcon
  },
  setup() {
    const { docs, getById } = useCollection('tags')
    const { set } = useDoc('tags')

    const tags = computed(() =>
      docs.value.map((doc) => ({ value: doc.id, label: doc.id }))
    )

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
    input: '',
    selectedIndex: 0,
    showTypeHead: false
  }),
  computed: {
    escapedInput() {
      return this.input.replace(/[^a-z0-9]/gim, '')
    },
    selectedTags() {
      return Object.keys(this.value).map((key) => ({
        label: key,
        value: key
      }))
    },
    filteredTags() {
      const result = this.tags.filter((tag) => {
        return (
          tag.value.toLowerCase().includes(this.escapedInput.toLowerCase()) &&
          !this.value[tag.value]
        )
      })

      if (
        this.escapedInput &&
        !this.tags.find(
          (tag) => tag.value.toLowerCase() === this.escapedInput.toLowerCase()
        )
      ) {
        result.push({
          label: this.escapedInput,
          value: this.escapedInput,
          new: true
        })
      }

      return result
    }
  },
  watch: {
    input() {
      this.selectedIndex = 0
    }
  },
  methods: {
    removeLast() {
      if (this.selectedTags.length) {
        this.remove(this.selectedTags[this.selectedTags.length - 1].value)
      }
    },
    inc() {
      if (this.selectedIndex < this.filteredTags.length - 1) {
        this.selectedIndex += 1
      } else {
        this.selectedIndex = 0
      }
    },
    dec() {
      if (this.selectedIndex > 0) {
        this.selectedIndex -= 1
      } else {
        this.selectedIndex = this.filteredTags.length - 1
      }
    },
    add(val) {
      const result = { ...this.value }

      result[val] = true

      if (!this.getById(val)) {
        this.set(val, {
          label: val
        })
      }

      this.$emit('input', result)
      this.input = ''
      this.selectedIndex = 0
    },
    remove(val) {
      const result = { ...this.value }
      delete result[val]

      this.$emit('input', result)
      this.selectedIndex = 0
    }
  }
}
</script>

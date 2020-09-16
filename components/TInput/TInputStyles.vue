<template>
  <div class="text-center">
    <div v-for="category in categories" :key="category" class="mb-4">
      <h4 class="font-bold text-lg">{{ category }}</h4>
      <div class="text-center">
        <template v-for="style in styles(category)">
          <div
            :key="style.id"
            :class="{ 'bg-primary text-white': contains(style.id) }"
            class="rounded px-2 py-1 border m-1 inline-block cursor-pointer"
            @click="trigger(style.id)"
          >
            <span>{{ style.name }}</span>
          </div>
          <template v-if="contains(style.id)">
            <template v-for="kid in children(style.name)">
              <div
                :key="kid.id"
                :class="{ 'bg-primary text-white': contains(kid.id) }"
                class="rounded bg-red-200 px-2 py-1 border m-1 inline-block cursor-pointer"
                @click="trigger(kid.id)"
              >
                <span>{{ kid.name }}</span>
              </div>
            </template>
          </template>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import useCollection from '~/use/collection'

export default {
  setup() {
    const { docs: data } = useCollection('styles')

    return {
      data
    }
  },
  props: {
    value: {
      type: [Object, String],
      default: () => ({})
    }
  },
  data: () => ({
    showPopup: false
  }),
  computed: {
    categories() {
      return _.chain(this.data)
        .map((item) => item.danceStyleRegion)
        .uniq()
        .value()
    }
  },
  methods: {
    styles(category) {
      return _.values(this.data).filter(
        (item) =>
          item &&
          item.danceStyleRegion &&
          item.danceStyleRegion === category &&
          item.root === 'yes'
      )
    },
    children(parentName) {
      return _.values(this.data).filter(
        (item) =>
          item &&
          item.danceStyleFamily &&
          item.danceStyleFamily === parentName &&
          parentName !== item.name
      )
    },
    contains(val) {
      if (!this.value) {
        return false
      }
      return this.value[val]
    },
    trigger(val) {
      const newValue = { ...this.value }
      newValue[val] = !newValue[val]
      this.$emit('input', newValue)
    }
  }
}
</script>

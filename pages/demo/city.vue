<template>
  <div class="space-y-4">
    <pre class="p-4 bg-gray-100">city: {{ city }}</pre>
    <TField v-model="city" type="city" label="City" auto-select />
    <TField v-model="city" v-bind="field" />
  </div>
</template>

<script>
import { profileFields } from '~/use/profiles'

export default {
  data: () => ({
    city: ''
  }),
  setup() {
    return {
      field: profileFields.find((f) => f.name === 'community')
    }
  }
}
</script>

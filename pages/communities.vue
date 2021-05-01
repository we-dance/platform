<template>
  <div>
    <TInputPlace v-model="currentCity" clearable />
  </div>
</template>

<script>
import { useCities } from '~/use/cities'

export default {
  setup() {
    const { currentCity } = useCities()

    return { currentCity }
  }
}
</script>

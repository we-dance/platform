<template>
  <span>{{ typeLabel }}</span>
</template>

<script>
import { computed } from 'vue-demi'
import { useProfiles } from '~/use/profiles'

export default {
  name: 'TVenueType',
  props: {
    type: {
      type: String,
    },
  },
  setup(props) {
    const { venueTypes } = useProfiles()

    const typeLabel = computed(
      () =>
        venueTypes.find((option) => option.value === props.type)?.label || ''
    )

    return {
      typeLabel,
    }
  },
}
</script>

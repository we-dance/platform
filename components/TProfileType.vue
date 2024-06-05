<template>
  <span>{{ typeLabel }}</span>
</template>

<script>
import { computed } from 'vue-demi'
import { useProfiles } from '~/use/profiles'

export default {
  name: 'TProfileType',
  props: {
    type: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const { typeList } = useProfiles()

    const typeLabel = computed(
      () => typeList.find((option) => option.value === props.type)?.label || ''
    )

    return {
      typeLabel,
    }
  },
}
</script>

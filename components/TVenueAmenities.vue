<template>
  <ul class="ml-4">
    <li v-for="amenity in amenitiesList" :key="amenity.value" class="list-disc">
      {{ amenity.label }}
    </li>
  </ul>
</template>

<script>
import { useProfiles } from '~/use/profiles'

export default {
  name: 'TVenueAmenities',
  props: {
    amenities: {
      type: Array,
      required: true,
    },
  },
  setup(props) {
    const { amenitiesOptions } = useProfiles()

    const amenitiesList = amenitiesOptions.filter((option) =>
      props.amenities.includes(option.value)
    )

    return {
      amenitiesList,
    }
  },
}
</script>

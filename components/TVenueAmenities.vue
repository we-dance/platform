<template>
  <ul :class="wrapperClass">
    <li
      v-for="amenity in amenitiesList"
      :key="amenity.value"
      :class="itemClass"
    >
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
    wrapperClass: {
      type: String,
      default: 'ml-4',
    },
    itemClass: {
      type: String,
      default: 'list-disc',
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

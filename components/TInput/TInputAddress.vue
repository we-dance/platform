<template>
  <div>
    <div
      v-if="value"
      class="bg-gray-100 rounded p-4 flex items-center space-x-4"
    >
      <div>
        <img :src="value.icon" class="w-8 h-8" alt="" />
      </div>
      <div class="flex-grow">
        <div class="font-bold">{{ value.name }}</div>
        <a
          :href="value.url"
          target="_blank"
          class="underline text-blue-500 hover:no-underline"
          >{{ value.formatted_address }}</a
        >
      </div>
      <div class="w-10">
        <TButton
          type="nav"
          icon="close"
          @click="
            text = ''
            $emit('input', '')
          "
        />
      </div>
    </div>
    <input
      v-show="!value && autocomplete"
      ref="autocomplete"
      v-model="text"
      type="text"
      :placeholder="placeholder"
      autocomplete="off"
      class="w-full px-3 py-2 bg-gray-50 text-sm rounded border focus:outline-none focus:shadow-outline border-gray-300"
    />
    <div v-if="!autocomplete" class="text-gray-500">Loading...</div>
  </div>
</template>

<script>
import { getGoogle } from '~/use/google'

export default {
  name: 'TInputAddress',
  props: {
    value: {
      type: [String, Object],
      default: '',
    },
    placeholder: {
      type: String,
      default: 'Search place or address',
    },
  },
  data: () => ({
    autocomplete: null,
    text: '',
  }),
  async mounted() {
    const google = await getGoogle()

    const options = {
      fields: [
        'place_id',
        'formatted_address',
        'address_components',
        'geometry',
        'icon',
        'name',
        'url',
        'website',
        'international_phone_number',
      ],
    }

    this.autocomplete = new google.maps.places.Autocomplete(
      this.$refs.autocomplete,
      options
    )

    this.autocomplete.addListener('place_changed', () => {
      const place = this.autocomplete.getPlace()

      this.$emit('input', place)
    })
  },
}
</script>

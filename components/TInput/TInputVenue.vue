<template>
  <div>
    <TInputAddress v-model="internalValue" />

    <div v-if="venue" class="p-4">
      <div v-if="rooms">
        <TField
          v-model="room"
          component="TRichSelect"
          :options="rooms"
          label="Area/Room"
        />
        <img v-if="venue.map" :src="venue.map" alt="Map" class="mt-4" />
      </div>

      <TPopupEdit
        label="Edit Map and Areas"
        type="link"
        collection="venues"
        title="Edit Venue"
        :fields="venueFields"
        :item="venue"
        class="mt-4"
        @save="load"
      />
    </div>
  </div>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/firestore'
import { useVenues } from '~/use/venues'

export default {
  name: 'TInputVenue',
  setup() {
    const { venueFields } = useVenues()

    return {
      venueFields,
    }
  },
  components: {
    TField: () =>
      import(/* webpackChunkName: "TField" */ '~/components/TField'),
    TPopupEdit: () =>
      import(/* webpackChunkName: "TPopupEdit" */ '~/components/TPopupEdit'),
  },
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
    venue: null,
  }),
  computed: {
    room: {
      get() {
        return this.value?.room || ''
      },
      set(room) {
        const newVal = this.value
        newVal.map = this.venue?.map || ''
        newVal.room = room

        this.$emit('input', newVal)
      },
    },
    internalValue: {
      get() {
        return this.value
      },
      set(val) {
        if (!val) {
          this.venue = null
          this.$emit('input', '')

          return
        }

        const newVal = JSON.parse(JSON.stringify(val))
        this.$emit('input', newVal)
      },
    },
    rooms() {
      if (!this.venue?.rooms) {
        return []
      }

      return this.venue.rooms
        .split('\n')
        .map((room) => ({ value: room, label: room }))
    },
  },
  watch: {
    value: 'load',
  },
  async mounted() {
    await this.load()
  },
  methods: {
    async load() {
      if (!this.value?.place_id) {
        return
      }

      const firestore = firebase.firestore()
      const collection = firestore.collection('venues')

      let doc = await collection.doc(this.value.place_id).get()

      if (!doc.exists) {
        await collection.doc(this.value.place_id).set({
          name: this.value.name,
          id: this.value.place_id,
          rooms: '',
          map: '',
          address: this.value,
          createdAt: Date.now(),
        })

        doc = await collection.doc(this.value.place_id).get()
      }

      this.venue = doc.data()
    },
  },
}
</script>

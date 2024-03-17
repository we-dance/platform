<template>
  <div>
    <WProfile
      v-if="venue && venue.username"
      :username="venue.username"
      hide-role
      hide-buttons
    >
      <template v-slot:right>
        <TButton
          allow-guests
          type="nav"
          icon="close"
          @click="internalValue = ''"
        />
      </template>
      <div></div>
    </WProfile>
    <TInputAddress v-else v-model="internalValue" />

    <div v-if="venue && venue.rooms" class="p-4">
      <div v-if="rooms && !hideAreas">
        <TField
          v-model="room"
          component="TRichSelect"
          :options="rooms"
          label="Area/Room"
        />
        <img v-if="venue.map" :src="venue.map" alt="Map" class="mt-4" />
      </div>
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
    hideAreas: {
      type: Boolean,
      default: false,
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
    'venue.username'(username) {
      const newVal = this.value
      newVal.username = username

      this.$emit('input', newVal)
    },
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
      const collection = firestore.collection('profiles')

      async function loadBy(field, value) {
        const docs = (await collection.where(field, '==', value).get()).docs

        return docs.length ? docs[0].data() : null
      }

      let doc = await loadBy('address.place_id', this.value.place_id)

      const website = this.value.website || ''

      if (!doc) {
        doc = await loadBy('website', website)

        if (doc) {
          collection.doc(doc.id).update({
            phone: this.value.international_phone_number || '',
            address: this.value,
            updateAt: Date.now(),
          })

          doc = await loadBy('address.place_id', this.value.place_id)
        }
      }

      if (!doc) {
        let username = website.replace(/https?:\/\//, '').replace('/', '')

        if (!username) {
          username = this.value.name
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '')
            .substring(0, 20)
        }

        await collection.add({
          name: this.value.name,
          username,
          website: website || this.value.url || '',
          phone: this.value.international_phone_number || '',
          rooms: '',
          map: '',
          gender: 'Other',
          address: this.value,
          type: 'Venue',
          createdAt: Date.now(),
          updateAt: Date.now(),
        })

        doc = await loadBy('address.place_id', this.value.place_id)
      }

      this.venue = doc
    },
  },
}
</script>

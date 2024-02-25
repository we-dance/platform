<template>
  <div>
    <div class="p-4">
      <h1 class="text-2xl font-bold">
        {{ $t('explore.tips.header', { city: city.name }) }}
      </h1>
      <div class="text-sm">
        {{ $t('explore.tips.subheader', { city: city.name }) }}
      </div>
    </div>

    <div class="border-b border-t p-4">
      <form class="flex flex-col gap-4 w-full" @submit.prevent="saveItem">
        <div class="flex gap-4">
          <TField
            v-model="item.style"
            label-position="top"
            placeholder="Any Dance"
            component="TInputStyle"
            popular-only
          />
          <TButton
            v-if="!showForm"
            type="primary"
            class="flex-grow w-full"
            @click="showForm = true"
            >Ask for recommendations</TButton
          >
        </div>
        <TField
          v-if="showForm"
          v-model="item.description"
          required
          label-position="top"
          component="TInputTextarea"
          :placeholder="`Ask for recommendations in ${city.name}`"
        />
        <div v-if="showForm" class="flex justify-end gap-2">
          <TButton xtype="submit" variant="primary">Post</TButton>
        </div>
      </form>
    </div>

    <TStories
      :key="item.style"
      :place="place"
      :city="city"
      :no-place="noPlace"
      :filter-dance="item.style"
    />

    <div class="border-t flex justify-center py-4">
      <TButton
        type="primary"
        :to="`/reviews/add?city=${city.cityPlaceId}`"
        label="Add Recommendation"
      />
    </div>
  </div>
</template>

<script>
import { ref } from '@nuxtjs/composition-api'
import firebase from 'firebase/app'
import 'firebase/firestore'
import { useAuth } from '~/use/auth'

export default {
  name: 'ExploreTips',
  props: {
    place: {
      type: String,
      default: '',
    },
    createdBy: {
      type: String,
      default: '',
    },
    city: {
      type: Object,
      default: () => ({}),
    },
    noPlace: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    async saveItem() {
      let data = this.item
      this.item = {}

      data = {
        ...data,
        place: this.place,
        createdAt: +new Date(),
        createdBy: this.uid,
        username: this.profile.username,
        type: 'ask-for-recommendations',
      }

      const firestore = firebase.firestore()
      await firestore.collection('stories').add(data)
    },
  },
  setup() {
    const { uid, profile } = useAuth()
    const item = ref({})
    const showForm = ref(false)

    return {
      showForm,
      item,
      profile,
      uid,
    }
  },
  head() {
    return {
      title: this.$t('explore.tips.title', { city: this.city.name }),
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.$t('explore.tips.description', {
            city: this.name,
          }),
        },
      ],
    }
  },
}
</script>

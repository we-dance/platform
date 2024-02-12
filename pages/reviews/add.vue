<template>
  <div class="bg-dark md:py-4 min-h-screen">
    <div
      class="mx-auto w-full max-w-lg md:rounded md:border md:shadow bg-white"
    >
      <form class="flex flex-col gap-4 p-4" @submit.prevent="saveItem">
        <TField
          v-model="item.place"
          label="Which city?"
          component="TInputPlace"
          label-position="top"
        />
        <TField
          v-model="item.style"
          label="Dance style"
          label-position="top"
          component="TInputStyle"
          popular-only
        />
        <TField
          v-model="item.receiver"
          component="TInputProfile"
          label="Who you want to recommend?"
          placeholder="Search on WeDance or paste a link to Instagram/Facebook"
          label-position="top"
        />
        <TField
          v-model="item.stars"
          placeholder="stars"
          hide-label
          component="TRatingInput"
        />
        <TField
          v-model="item.description"
          label-position="top"
          component="TInputTextarea"
        />
        <div class="flex justify-end gap-2">
          <TButton variant="secondary" @click="cancel">Cancel</TButton>
          <TButton v-if="id" variant="secondary" @click="remove"
            >Delete</TButton
          >
          <TButton xtype="submit" variant="primary">Submit</TButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { onMounted, ref } from '@nuxtjs/composition-api'
import firebase from 'firebase/app'
import 'firebase/firestore'
import { until } from '@vueuse/core'
import { useAuth } from '~/use/auth'
import { useCities } from '~/use/cities'

export default {
  name: 'ReviewAdd',
  layout: 'empty',
  middleware: ['auth'],
  methods: {
    cancel() {
      this.$router.go(-1)
    },
    async remove() {
      const receiver = this.item.receiver.username

      const firestore = firebase.firestore()
      await firestore
        .collection('stories')
        .doc(this.id)
        .delete()

      if (receiver) {
        this.$router.push(`/${this.item.receiver.username}?view=reviews#tabs`)
      } else {
        this.$router.push(`/${this.profile.username}`)
      }
    },
    async saveItem() {
      let data = this.item

      if (!data.receiver?.username) {
        return
      }

      data = {
        ...data,
        city: this.$route.query.city || '',
        createdBy: this.uid,
        username: this.profile.username,
        type: 'review',
      }

      const firestore = firebase.firestore()
      if (this.id) {
        data.updatedAt = +new Date()

        await firestore
          .collection('stories')
          .doc(this.id)
          .update(data)
      } else {
        data.createdAt = +new Date()

        await firestore.collection('stories').add(data)
      }

      this.$router.push(`/${this.item.receiver.username}?view=reviews#tabs`)
    },
  },
  setup(props, { root }) {
    const item = ref({})
    const id = ref(null)
    const { profile, uid } = useAuth()
    const { currentCity } = useCities()

    onMounted(async () => {
      item.value = {}

      const receiver = root.$route.query.receiver

      await until(profile).not.toBeNull()

      if (currentCity.value) {
        Vue.set(item.value, 'place', currentCity.value)
      }

      if (root.$route.query.city) {
        Vue.set(item.value, 'place', root.$route.query.city)
      }

      if (root.$route.query.style) {
        Vue.set(item.value, 'style', root.$route.query.style)
      }

      if (receiver) {
        Vue.set(item.value, 'receiver', { username: receiver })

        const firestore = firebase.firestore()
        const myReviewsRef = await firestore
          .collection('stories')
          .where('createdBy', '==', uid.value)
          .get()

        const myReviews = myReviewsRef.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))

        const thisReview = myReviews.find(
          (review) => review.receiver?.username === receiver
        )

        if (thisReview) {
          item.value = thisReview
          id.value = thisReview.id
        }
      }
    })

    return {
      item,
      profile,
      id,
      uid
    }
  },
}
</script>

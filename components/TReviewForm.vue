<template>
  <div>
    <tw-tabs
      :tabs="[
        {
          name: 'Profile',
          value: 'profile',
          to: '?type=',
          current: !$route.query.type,
        },
        {
          name: 'Place',
          value: 'place',
          to: '?type=place',
          current: $route.query.type === 'place',
        },
        {
          name: 'Link',
          value: 'link',
          to: '?type=link',
          current: $route.query.type === 'link',
        },
      ]"
    />
    <form class="flex flex-col gap-4 p-4" @submit.prevent="saveItem">
      <TField
        v-if="!$route.query.type"
        v-model="item.receiver"
        component="TInputProfile"
        placeholder="Search on WeDance"
        description="If you can't find a profile, use Place or Link tab"
        hide-label
      />
      <TField
        v-if="$route.query.type === 'place'"
        v-model="item.venue"
        component="TInputVenue"
        hide-areas
        placeholder="Search on Google Maps"
        description="Better use a name of the place, rather than an address"
        hide-label
      />
      <TField
        v-if="$route.query.type === 'link'"
        v-model="item.link"
        component="TInput"
        type="url"
        required
        placeholder="https://"
        description="Link to a website, Instagram, Facebook page, Whatsapp group, etc."
        hide-label
      />
      <TField
        v-if="!hidePlace"
        v-model="item.place"
        label="Which city?"
        component="TInputPlace"
        label-position="top"
        global
      />
      <TField
        v-if="!hideDance"
        v-model="item.style"
        label="Dance style"
        label-position="top"
        component="TInputStyle"
        popular-only
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
        placeholder="Share your experience"
      />
      <div class="flex justify-end gap-2">
        <TButton v-if="!hideCancel" variant="secondary" @click="cancel"
          >Cancel</TButton
        >
        <TButton v-if="id" variant="secondary" @click="remove">Delete</TButton>
        <TButton xtype="submit" variant="primary">Submit</TButton>
      </div>
    </form>
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
  name: 'TReviewForm',
  props: {
    place: {
      type: String,
      default: '',
    },
    dance: {
      type: String,
      default: '',
    },
    hidePlace: {
      type: Boolean,
      default: false,
    },
    hideDance: {
      type: Boolean,
      default: false,
    },
    hideCancel: {
      type: Boolean,
      default: false,
    },
    question: {
      type: String,
      default: '',
    },
  },
  methods: {
    cancel() {
      this.$router.go(-1)
    },
    async remove() {
      const firestore = firebase.firestore()
      await firestore
        .collection('stories')
        .doc(this.id)
        .delete()

      this.$router.push(`/${this.profile.username}`)
    },
    async saveItem() {
      let data = this.item

      if (!data.receiver?.username && !data.link && !data.venue?.place_id) {
        this.$toast.error('Please choose a profile, place or link.')
        return
      }

      data = {
        ...data,
        dances: Object.keys(data.style),
        receiver: data.receiver?.username ? data.receiver : '',
        link: data.link || '',
        venue: data.venue || '',
        question: this.question || '',
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

        const newStory = await firestore.collection('stories').add(data)
        if (this.question) {
          await firestore
            .collection('stories')
            .doc(this.question)
            .update({
              replies: firebase.firestore.FieldValue.arrayUnion(newStory.id),
            })
        }
      }

      this.$router.push(`/${this.profile.username}`)
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

      if (props.place) {
        Vue.set(item.value, 'place', props.place)
      }

      if (root.$route.query.style) {
        Vue.set(item.value, 'style', root.$route.query.style)
      }

      if (props.dance) {
        Vue.set(item.value, 'style', props.dance)
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
      uid,
    }
  },
}
</script>

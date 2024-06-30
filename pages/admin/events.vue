<template>
  <div>
    <div class="p-4 flex space-x-4 border-b">
      <div>{{ events.length }} events</div>
      <t-rich-select
        v-model="orderBy"
        placeholder="Sort"
        :options="[
          {
            label: 'Created At',
            value: 'createdAt',
          },
          {
            label: 'Start Date',
            value: 'startDate',
          },
          {
            label: 'Views Count',
            value: 'viewsCount',
          },
        ]"
        hide-search-box
      />
    </div>
    <div>
      <div v-for="item in events" :key="item.id" class="w-full border-b">
        <TEventText2 :item="item" show-date>
          <TEventCreator :doc="item" class="pt-4" />
        </TEventText2>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/firestore'
import { onMounted, ref, watch } from 'vue-demi'

export default {
  middleware: ['auth'],
  setup() {
    const orderBy = ref('createdAt')

    const events = ref([])

    const firestore = firebase.firestore()

    const load = () => {
      let collection = firestore
        .collection('posts')
        .orderBy(orderBy.value, 'desc')

      collection = collection.limit(100)

      collection.get().then((snapshot) => {
        const docs = snapshot.docs
          .map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }))
          .filter((i) => !i.createdAt.toDate)
        events.value = docs
      })
    }

    watch(orderBy, load)

    onMounted(load)

    return {
      events,
      orderBy,
    }
  },
}
</script>

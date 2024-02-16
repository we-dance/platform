<template>
  <div>
    <THeader title="NFC cards" />
    <main class="p-4">
      <form
        class="flex flex-col gap-4 p-4 bg-gray-100 border rounded"
        @submit.prevent="addCard"
      >
        <div class="flex justify-end">
          <TButton xtype="submit" variant="primary" label="Add" />
        </div>
      </form>

      <TLoader v-if="loading" />
      <section v-else>
        <div
          v-for="card in cards"
          :key="card.id"
          class="border p-4 rounded my-4"
        >
          <div class="flex justify-between gap-4">
            <div>
              <h2 class="font-bold">
                <router-link
                  :to="`/nfc/${card.id}`"
                  class="underline hover:no-underline"
                  >{{ card.id }}</router-link
                >
              </h2>
              <p class="text-xs font-bold">{{ card.state }}</p>

              <p v-if="card.username" class="text-xs">
                Connected to: {{ card.username }}
              </p>
              <p class="text-xs">Created at: {{ getYmdHms(card.createdAt) }}</p>
              <p v-if="card.connectedAt" class="text-xs">
                Connected at: {{ getYmdHms(card.connectedAt) }}
              </p>
            </div>
            <div>
              <TDropdown>
                <TButton
                  icon="delete"
                  label="Remove"
                  type="context"
                  @click="remove(card.id)"
                />
              </TDropdown>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/firestore'
import { ref, onMounted } from '@nuxtjs/composition-api'
import { getYmdHms } from '~/utils'

export default {
  middleware: 'auth',
  setup() {
    const loading = ref(true)
    const cards = ref([])
    const firestore = firebase.firestore()

    function refresh(id, state) {
      firestore
        .collection('cards')
        .doc(id)
        .update({
          state,
        })
    }

    function remove(id) {
      firestore
        .collection('cards')
        .doc(id)
        .delete()
    }

    function addCard() {
      firestore.collection('cards').add({
        createdAt: +new Date(),
        state: 'new',
      })
    }

    onMounted(() => {
      const collection = firestore.collection('cards')

      collection.orderBy('createdAt', 'asc').onSnapshot((snapshot) => {
        cards.value = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))

        loading.value = false
      })
    })

    return {
      loading,
      cards,
      addCard,
      getYmdHms,
      refresh,
      remove,
    }
  },
}
</script>

<template>
  <div>
    <div class="p-4 flex space-x-4 border-b">
      <div>{{ profiles.length }} profiles</div>
      <t-rich-select
        v-model="orderBy"
        placeholder="Sort"
        :options="[
          {
            label: 'Created At',
            value: 'createdAt',
          },
          {
            label: 'Last Login At',
            value: 'lastLoginAt',
          },
          {
            label: 'Days Used',
            value: 'daysUsed',
          },
        ]"
        hide-search-box
      />
    </div>

    <div>
      <NuxtLink
        v-for="item in profiles"
        :key="item.id"
        :to="localePath(`/id@${item.id}`)"
        class="border-b p-4 flex items-center hover:bg-blue-200"
      >
        <div class="w-12 flex-shrink-0">
          <TProfilePhoto2 size="sm" :src="item.photo" />
        </div>
        <div class="flex-grow">
          <div class="block leading-tight font-semibold">{{ item.name }}</div>
          <div class="block text-xs leading-tight">
            {{ item.type }} • @{{ item.username }} •
            {{ item.owned ? 'Owned' : 'Not Owned' }} •
            <TCityLink :place="item.current" />
          </div>
          <div class="block text-xs leading-tight">
            {{ getYmdHms(item.createdAt) }} •
            {{ getYmdHms(item.lastLoginAt) || 'never' }} •
            {{ item.daysUsed || 0 }} days
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/firestore'
import { onMounted, ref, watch } from 'vue-demi'
import { getYmdHms } from '~/utils'

export default {
  middleware: ['auth'],
  setup() {
    const orderBy = ref('createdAt')
    const profiles = ref([])

    const firestore = firebase.firestore()

    const load = () => {
      let collection = firestore
        .collection('profiles')
        .orderBy(orderBy.value, 'desc')

      collection = collection.limit(10)

      collection.get().then((snapshot) => {
        profiles.value = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
          owned: doc.data().createdBy === doc.id,
        }))
      })
    }

    onMounted(load)
    watch(orderBy, load)

    return {
      profiles,
      orderBy,
      getYmdHms,
    }
  },
}
</script>

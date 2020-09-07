<template>
  <div>
    <div class="flex items-baseline justify-between mb-8">
      <h1 class="text-4xl font-bold">Community</h1>
    </div>

    <div>
      <TInputSelect class="mb-4" v-model="tab" :options="tabs" />

      <div v-if="!uid" class="my-4 border rounded bg-white text-sm text-center">
        <TIcon name="undraw_work_chat" class="p-4" />
        <div>
          <h1 class="font-bold">
            {{ itemsPartner.length }} people are looking for a dance partner in
            {{ city }}
          </h1>
          <p>Publish your profile so that others can find you as well</p>
        </div>
        <div class="flex justify-center">
          <TButton class="mt-2" type="primary" to="/signin?target=/people"
            >Create profile</TButton
          >
        </div>
      </div>
      <TCardProfile
        v-for="item in items"
        :key="item.id"
        class="mb-4"
        :uid="item.createdBy"
      />
      <div v-if="!uid" class="m-4 font-bold text-center">
        {{ itemsPartner.length - itemsPartnerPublic.length }} other dancers show
        their profiles only for members
      </div>
      <div
        v-if="!uid"
        class="mt-4 bg-dark-gradient text-white p-4 rounded text-center"
      >
        <div>Become a member of WeDance Community to get full access.</div>
        <TButton class="mt-2" type="primary" to="/signin?target=/people"
          >Join Now</TButton
        >
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from '@vue/composition-api'
import useAuth from '~/use/auth'
import useCollection from '~/use/collection'

export default {
  name: 'PeopleIndex',
  setup() {
    const { uid } = useAuth()

    const city = 'Munich'

    const { docs } = useCollection('profiles')

    const tabs = [
      {
        value: 'partner',
        label: 'Looking for dance partner'
      },
      {
        value: 'community',
        label: 'All members'
      }
    ]

    const tab = ref('partner')

    const itemsAll = computed(() => {
      return docs.value.filter((item) => item.username)
    })

    const itemsAllPublic = computed(() => {
      return docs.value.filter(
        (item) => item.username && item.visibility === 'Public'
      )
    })

    const itemsPartner = computed(() => {
      return docs.value.filter(
        (item) => item.username && item.partner === 'Yes'
      )
    })

    const itemsPartnerPublic = computed(() => {
      return docs.value.filter(
        (item) =>
          item.username &&
          item.partner === 'Yes' &&
          item.visibility === 'Public'
      )
    })

    const items = computed(() => {
      if (tab.value === 'partner') {
        return docs.value.filter(
          (item) =>
            item.username &&
            item.partner === 'Yes' &&
            (uid.value || item.visibility === 'Public')
        )
      }

      if (tab.value === 'community') {
        return docs.value.filter(
          (item) => item.username && (uid.value || item.visibility === 'Public')
        )
      }
    })

    return {
      city,
      items,
      uid,
      tabs,
      tab,
      itemsAll,
      itemsAllPublic,
      itemsPartner,
      itemsPartnerPublic
    }
  }
}
</script>

<template>
  <div>
    <h1 class="text-xl font-extrabold p-4 text-center border-b">
      Find Matches
    </h1>
    <div
      class="sticky bg-white p-4 border-b z-40 top-0 shadow flex justify-between items-center"
    >
      <h1 v-if="!selectedCount()">
        Select up to 5 profiles
      </h1>
      <h1 v-else>{{ selectedCount() }} of 5 profiles selected</h1>

      <TButton type="primary" to="/find-partner/success"
        >Send Invitations</TButton
      >
    </div>

    <div v-if="!response.nbHits" class="p-4 flex justify-center items-center">
      <div>
        There are no profiles yet. Wait for someone to join and try again later.
      </div>
    </div>

    <div class="space-y-2 p-4">
      <div v-for="profile in response.hits" :key="`artist-${profile.username}`">
        <TSearchProfile :fallback="profile">
          <div class="flex space-x-2 mt-4">
            <TButton
              :type="isSelected(profile.id) ? 'success' : 'primary'"
              @click="select(profile.id)"
            >
              {{ isSelected(profile.id) ? 'Selected' : 'Select' }}
            </TButton>
          </div>
        </TSearchProfile>
      </div>
    </div>

    <div
      v-if="response.nbPages > 1 && response.page < response.nbPages"
      class="my-4 flex justify-center"
    >
      <TButton label="Load More" type="primary" @click="loadMore" />
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { until } from '@vueuse/core'
import { computed, onMounted, ref } from 'vue-demi'
import { getExcerpt } from '~/utils'
import { useAlgolia } from '~/use/algolia'
import { useProfiles } from '~/use/profiles'
import { useAuth } from '~/use/auth'
import { db } from '~/plugins/firebase'

export default {
  name: 'FindPartnerList',
  setup() {
    const selected = ref({})
    const radius = ref(10)
    const query = ref('')
    const profileType = ref('')
    const currentPage = ref(1)
    const filters = ref({})
    const { uid, profile } = useAuth()
    const { radiusOptions } = useProfiles()

    function isSelected(id) {
      return selected.value[id]
    }

    function selectedCount() {
      return Object.keys(selected.value).length
    }

    function select(id) {
      if (selected.value[id]) {
        Vue.delete(selected.value, id)
      } else {
        if (selectedCount() >= 5) {
          alert('You can only select up to 5 profiles')
          return
        }

        Vue.set(selected.value, id, true)
      }
    }

    const { search, response, loadMore } = useAlgolia('profiles')

    const filterQuery = computed(() => {
      if (!profile.value?.searchStyle) {
        return ''
      }

      return `partner:Yes AND style:${profile.value.searchStyle} AND gender:${
        profile.value.role === 'leader' ? 'Female' : 'Male'
      }`
    })

    onMounted(async () => {
      await until(profile).not.toBeNull()

      const placeId = profile.value.place
      const cityRef = await db
        .collection('profiles')
        .where('cityPlaceId', '==', placeId)
        .get()
      const city = cityRef.docs[0].data()

      search('', {
        filters: filterQuery.value,
        page: 0,
        aroundLatLng: radius.value
          ? `${city.location.latitude}, ${city.location.longitude}`
          : '',
        aroundRadius: radius.value * 1000 || 1,
        hitsPerPage: 5,
      })
    })

    return {
      radiusOptions,
      uid,
      getExcerpt,
      search,
      query,
      response,
      filters,
      currentPage,
      profileType,
      radius,
      selected,
      select,
      isSelected,
      selectedCount,
      loadMore,
    }
  },
}
</script>

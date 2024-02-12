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
        There are no profiles yet. Ask locals.
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

    <t-pagination
      v-if="response.nbPages > 1 && !$route.query.search"
      v-model="currentPage"
      :total-items="response.nbHits"
      :per-page="response.hitsPerPage"
      class="my-4"
    />
  </div>
</template>

<script>
import Vue from 'vue'
import { computed, onMounted, ref, watch } from 'vue-demi'
import { getExcerpt } from '~/utils'
import { useAlgolia } from '~/use/algolia'
import { useProfiles } from '~/use/profiles'
import { useAuth } from '~/use/auth'
import { useCities } from '~/use/cities'
import { useApp } from '~/use/app'

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
    const { city, currentCity, cityName } = useCities()
    const { getCity } = useApp()
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

    if (!currentCity.value) {
      return
    }

    const { search, response } = useAlgolia('profiles')

    function load() {
      filters.value = {}
      query.value = ''
    }
    onMounted(load)

    const filterQuery = computed(() => {
      if (!profile.value?.searchStyle) {
        return ''
      }

      return `partner:Yes AND style:${profile.value.searchStyle} AND gender:${
        profile.value.role === 'leader' ? 'Female' : 'Male'
      }`
    })

    watch([filterQuery, currentPage, radius, city], () => {
      if (!city.value?.location) {
        return
      }
      if (!filterQuery.value) {
        return
      }
      search('', {
        filters: filterQuery.value,
        page: 0,
        aroundLatLng: radius.value
          ? `${city.value.location.latitude}, ${city.value.location.longitude}`
          : '',
        aroundRadius: radius.value * 1000 || 1,
        hitsPerPage: 100,
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
      load,
      getCity,
      cityName,
      selected,
      select,
      isSelected,
      selectedCount,
    }
  },
}
</script>

<template>
  <div>
    <portal to="title">
      <h1 class="ml-1 font-lato text-lg font-bold">Ramble</h1>
    </portal>

    <div class="mt-4 max-w-sm mx-auto">
      <router-link
        v-for="item in response.hits"
        :key="item.id"
        :to="`/${item.username}`"
        class="hover:opacity-75"
      >
        <TSharePreviewPost
          :type="item.type"
          collection="profiles"
          :username="item.username"
          :description="getExcerpt(item.bio)"
          :color="item.partner === 'Yes' ? 'bg-green-400' : 'bg-red-400'"
          :photo="item.photo"
          :styles="item.styles"
          size="sm"
        />
      </router-link>
      <div class="mt-4 flex justify-between">
        <TButton label="Archive" />
        <TButton type="primary" label="Save for later" @click="currentPage++" />
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref, watch } from 'vue-demi'
import { until } from '@vueuse/core'
import { getExcerpt } from '~/utils'
import { useAlgolia } from '~/use/algolia'
import { useAuth } from '~/use/auth'

export default {
  name: 'ProfilesIndex',
  setup() {
    const currentPage = ref(1)
    const { uid, profile } = useAuth()

    const { search, response } = useAlgolia('profiles')

    const myFilter = computed(() => {
      if (!uid.value) {
        return ''
      }

      let parts = []

      if (profile.value.styles) {
        parts.push(Object.keys(profile.value.styles).join(' OR '))
      }

      if (profile.value.objectives) {
        parts.push(
          Object.keys(profile.value.objectives)
            .map((objective) => `objectives:${objective}`)
            .join(' OR '),
        )
      }

      if (profile.value.locales) {
        parts.push(
          Object.keys(profile.value.locales)
            .map((locale) => `locales:${locale}`)
            .join(' OR '),
        )
      }

      parts.push(
        `gender:${profile.value.gender === 'Male' ? 'Female' : 'Male'}`,
      )

      parts = parts.map((part) => `(${part})`)

      return parts.join(' AND ')
    })

    onMounted(async () => {
      if (uid.value) {
        await until(profile).not.toBeNull()
      }

      await search('', {
        filters: myFilter.value,
        hitsPerPage: 1,
        aroundLatLngViaIP: true,
        aroundRadius: 50000,
      })
    })

    watch(currentPage, () => {
      search('', {
        filters: myFilter.value,
        hitsPerPage: 1,
        page: currentPage.value - 1,
        aroundLatLngViaIP: true,
        aroundRadius: 50000,
      })
    })

    return {
      getExcerpt,
      search,
      response,
      currentPage,
    }
  },
}
</script>

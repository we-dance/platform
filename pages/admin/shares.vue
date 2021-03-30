<template>
  <div>
    <div>
      <TInputPlace v-model="currentCity" clearable />
    </div>

    <TCardList
      collection="shares"
      title="Shares"
      :fields="fields"
      :filters="states"
      class="mt-4"
    >
      <template v-slot:empty>
        <div class="text-center mt-4">
          No scheduled posts.
        </div>
      </template>
      <template v-slot:default="{ item }">
        <div class="rounded bg-white mb-4 shadow border overflow-hidden">
          <div class="p-4 space-y-2">
            <div class="flex justify-between">
              <div>{{ item.city || 'Everywhere' }}</div>
              <TInputSelect
                :value="item.state"
                :options="states"
                @input="(val) => changeState(item.id, val)"
              />
            </div>
            <div class="flex justify-between">
              <div class="flex space-x-2">
                <span>Created by</span>
                <TAvatar :uid="item.createdBy" name />
              </div>
              <div>{{ getDateTime(item.createdAt) }}</div>
            </div>
            <div v-if="item.publishedBy" class="flex justify-between">
              <div class="flex space-x-2">
                <span>Published by</span>
                <TAvatar :uid="item.publishedBy" name />
              </div>
              <div>{{ getDateTime(item.publishedAt) }}</div>
            </div>
            <div v-if="item.cancelledBy" class="flex justify-between">
              <div class="flex space-x-2">
                <span>Cancelled by</span>
                <TAvatar :uid="item.cancelledBy" name />
              </div>
              <div>{{ getDateTime(item.cancelledAt) }}</div>
            </div>
            <div>
              <a :href="item.url" class="underline hover:no-underline">{{
                item.url
              }}</a>
            </div>
          </div>
          <img :src="item.image" />
        </div>
      </template>
    </TCardList>
  </div>
</template>

<script>
import useAuth from '~/use/auth'
import { getDateTime } from '~/utils'
import useCities from '~/use/cities'

export default {
  name: 'PageAdminShares',
  setup() {
    const { currentCity } = useCities()
    const { uid } = useAuth()
    const fields = [
      {
        name: 'state'
      },
      {
        name: 'collection'
      },
      {
        name: 'contentId'
      },
      {
        name: 'image'
      },
      {
        name: 'url'
      },
      {
        name: 'place'
      }
    ]

    const thisCityFilter = (item) =>
      item.place && currentCity.value ? item.place === currentCity.value : true

    const states = [
      {
        label: 'New',
        name: 'new',
        value: 'new',
        filter: (item) => item.state === 'new' && thisCityFilter(item),
        sort: 'createdAt',
        default: true
      },
      {
        label: 'Published',
        name: 'published',
        value: 'published',
        filter: (item) => item.state === 'published' && thisCityFilter(item),
        sort: 'createdAt'
      },
      {
        label: 'Cancelled',
        name: 'cancelled',
        value: 'cancelled',
        filter: (item) => item.state === 'cancelled' && thisCityFilter(item),
        sort: 'createdAt'
      }
    ]

    return {
      fields,
      getDateTime,
      states,
      uid,
      currentCity
    }
  },
  methods: {
    async changeState(id, state) {
      await this.$fire.firestore
        .collection('shares')
        .doc(id)
        .update({
          state,
          [`${state}At`]: +new Date(),
          [`${state}By`]: this.uid
        })
    }
  }
}
</script>

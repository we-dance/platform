<script>
import useAuth from '~/use/auth'

export default {
  setup() {
    const { uid } = useAuth()

    return {
      uid
    }
  }
}
</script>

<template>
  <div v-if="!uid" class="mt-4 mx-auto max-w-md p-4 text-sm">
    <TIcon name="undraw_having_fun" class="p-4" />
    <div>
      List of dancers communities.
    </div>
    <div v-if="!uid" class="mt-8 bg-gray-400 p-4 rounded text-center">
      <div>Sign in to access</div>
      <TButton class="mt-2" to="/signin?target=/trips">Sign in</TButton>
    </div>
  </div>
  <div v-else>
    <TCardList
      :collection="collection"
      title="Groups"
      add="Add a group"
      :fields="fields"
      :filters="filters"
      :map="map"
    >
      <template v-slot:default="{ item }">
        <div class="mb-4 bg-white max-w-sm">
          <div class="bg-white p-4 max-w-sm">
            <div class="text-sm flex items-center">
              <div>
                <div class="font-bold">
                  {{ item.name }}
                </div>
                <div class="text-xs">
                  {{ item.location }}
                </div>
              </div>
            </div>

            <div class="flex justify-between px-4 mb-4 items-center">
              <div>
                {{ item.description }}
              </div>
              <TButton :href="item.url">Join</TButton>
            </div>

            <div class="mt-4 flex justify-between">
              <TTagsPreview :value="item.tags" />

              <div class="flex">
                <div class="text-green-500 flex justify-center">
                  <button
                    class="text-center hover:text-green-500"
                    :class="{ 'text-green-700': item.response === 'up' }"
                    @click="updateRsvp(item.id, collection, 'up')"
                  >
                    <TIcon name="up" class="h-6 w-6" />
                  </button>
                  <div>
                    {{ item.upVotes }}
                  </div>
                </div>
                <div class="text-red-500 flex ml-2 justify-center">
                  <button
                    class="text-center hover:text-primary"
                    :class="{ 'text-red-700': item.response === 'down' }"
                    @click="updateRsvp(item.id, collection, 'down')"
                  >
                    <TIcon name="down" class="h-6 w-6 hover:text-primary" />
                  </button>
                  <div>
                    {{ item.downVotes }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </TCardList>
  </div>
</template>

<script>
import TFieldTag from '~/components/TFieldTag'
import { getDateTime } from '~/utils'
import useAuth from '~/use/auth'
import useRSVP from '~/use/rsvp'

export default {
  setup() {
    const collection = 'groups'

    const fields = [
      {
        name: 'name',
        label: 'Name'
      },
      {
        name: 'description',
        label: 'Description'
      },
      {
        name: 'location',
        label: 'Location'
      },
      {
        name: 'type',
        label: 'Type'
      },
      {
        name: 'tags',
        label: 'Tags',
        component: TFieldTag
      },
      {
        name: 'url',
        label: 'Url'
      }
    ]

    const { getCount, getRsvpResponse, updateRsvp } = useRSVP()

    const map = (item) => {
      const upVotes = getCount(item.id, 'up')
      const downVotes = getCount(item.id, 'down')
      const votes = upVotes - downVotes
      const response = getRsvpResponse(item.id)
      const multi = !response ? 3 : response === 'up' ? 2 : 1
      const order = multi * 100 + votes

      return {
        ...item,
        upVotes,
        downVotes,
        votes,
        response,
        order
      }
    }

    const { uid } = useAuth()

    const filters = [
      {
        name: 'all',
        label: 'All',
        default: true
      },
      {
        name: 'mine',
        label: 'Mine',
        filter: (item) => item.createdBy === uid.value
      }
    ]

    return {
      collection,
      fields,
      getDateTime,
      filters,
      uid,
      map,
      updateRsvp
    }
  }
}
</script>

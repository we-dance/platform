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
    <TIcon name="undraw_house_searching" class="p-4" />
    <div>
      Dance venues directory.
    </div>
    <div v-if="!uid" class="mt-8 bg-gray-400 p-4 rounded text-center">
      <div>Sign in to access</div>
      <TButton class="mt-2" to="/signin?target=/trips">Sign in</TButton>
    </div>
  </div>
  <div v-else>
    <TCardList
      :collection="collection"
      title="Venues"
      add="Add a venue"
      :fields="fields"
      :filters="filters"
      :map="map"
    >
      <template v-slot:default="{ item }">
        <div class="mb-4 bg-white max-w-sm">
          <div class="bg-white p-4 max-w-sm">
            <div class="items-center">
              <div>
                <div class="font-bold">
                  {{ item.name }}
                </div>
                <div class="text-xs">
                  {{ item.location }}
                </div>
              </div>
            </div>

            <div class="text-sm mt-2">
              <dl v-if="item.website" class="mt-2 flex">
                <dt class="font-bold mr-1 w-32 text-right">Website:</dt>
                <dd class="text-blue-600 hover:underline">
                  <a :href="item.website">
                    {{ item.website }}
                  </a>
                </dd>
              </dl>
              <dl v-if="item.phone" class="mt-2 flex">
                <dt class="font-bold mr-1 w-32 text-right">Phone:</dt>
                <dd class="text-blue-600 hover:underline">
                  <a :href="`tel:${item.phone}`">
                    {{ item.phone }}
                  </a>
                </dd>
              </dl>

              <dl v-if="item.email" class="mt-2 flex">
                <dt class="font-bold mr-1 w-32 text-right">Email:</dt>
                <dd class="text-blue-600 hover:underline">
                  <a :href="`mailto:${item.email}`">
                    {{ item.email }}
                  </a>
                </dd>
              </dl>
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
          <div class="flex justify-center bg-black">
            <img class="h-12" :src="item.logo" />
          </div>
        </div>
      </template>
    </TCardList>
  </div>
</template>

<script>
import { getDateTime } from '~/utils'
import useAuth from '~/use/auth'
import useRSVP from '~/use/rsvp'

export default {
  setup() {
    const collection = 'venues'

    const fields = [
      {
        name: 'name',
        label: 'Name'
      },
      {
        name: 'logo',
        label: 'Logo'
      },
      {
        name: 'tags',
        label: 'Tags',
        type: 'tags'
      },
      {
        name: 'phone',
        label: 'Phone'
      },
      {
        name: 'website',
        label: 'Website'
      },
      {
        name: 'email',
        label: 'Email'
      },
      {
        name: 'location',
        label: 'Location'
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

<template>
  <div>
    <TCardList
      :collection="collection"
      title="Endorsements"
      add="Add a dance"
      :fields="fields"
      :filters="filters"
    >
      <template v-slot:empty>
        <div class="mt-4 mx-auto max-w-md p-4 text-sm">
          <TIcon name="undraw_online_dating" class="p-4" />
          <div>
            Endorsements help other dancers know what to expect from you both on
            and off the floor.
          </div>
          <div class="mt-2">
            Write an endorsement for another dancer and they’ll be prompted to
            write one for you.
          </div>
          <div class="mt-2">
            Once you have both completed your endorsements, they will be
            displayed on your profile so that other users know how awesome you
            are!
          </div>
          <div v-if="!uid" class="mt-8 bg-gray-400 p-4 rounded text-center">
            <div>Sign in to continue</div>
            <TButton class="mt-2" to="/signin?target=/trips">Sign in</TButton>
          </div>
        </div>
      </template>
      <template v-slot:default="{ item }">
        <div class="rounded bg-white mb-4 shadow border p-4">
          <router-link
            :to="`/endorsements/${item.id}`"
            class="underline hover:no-underline"
            >{{ item.name }} on {{ getDateTime(item.when) }}</router-link
          >
        </div>
      </template>
    </TCardList>
  </div>
</template>

<script>
import { getDateTime } from '~/utils'
import useAuth from '~/use/auth'

export default {
  name: 'EndorsementIndex',
  setup() {
    const collection = 'endorsements'

    const fields = [
      {
        name: 'name',
        label: 'Name of dance partner'
      },
      {
        name: 'when',
        label: 'When?',
        type: 'datetime-local'
      },
      {
        name: 'genre',
        label: 'What did you dance?',
        type: 'tags'
      },
      {
        name: 'like',
        label: 'What did you like?',
        type: 'tags'
      }
    ]

    const { uid } = useAuth()

    const filters = [
      {
        name: 'mine',
        default: true,
        filter: (item) => item.createdBy === uid.value
      }
    ]

    return {
      collection,
      fields,
      getDateTime,
      filters,
      uid
    }
  }
}
</script>

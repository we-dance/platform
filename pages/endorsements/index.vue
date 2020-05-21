<template>
  <div class="flex-grow p-4 bg-gray-200 rounded mx-4">
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
            Endorsements will be added to your profile so that people will see
            them.
          </div>
          <div class="mt-2">
            Receive endorsements from other dancers by giving them your
            endorsement first.
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
import TFieldTag from '~/components/TFieldTag'
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
        component: TFieldTag
      },
      {
        name: 'like',
        label: 'What did you like?',
        component: TFieldTag
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

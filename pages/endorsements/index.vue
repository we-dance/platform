<template>
  <div class="flex-grow p-4 bg-gray-200 rounded mr-4">
    <TCardList
      :collection="collection"
      title="Endorsements"
      add="Add a dance"
      :fields="fields"
      :filters="filters"
    >
      <template v-slot:empty>
        <div class="text-center mt-4">
          Create your first endorsement.
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
import TCardList from '~/components/TCardList'
import TFieldTag from '~/components/TFieldTag'
import { getDateTime } from '~/utils'
import useAuth from '~/use/auth'

export default {
  name: 'EndorsementIndex',
  components: {
    TCardList
  },
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
      filters
    }
  }
}
</script>

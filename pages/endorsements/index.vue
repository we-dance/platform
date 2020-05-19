<template>
  <div class="p-4 max-w-lg mx-auto">
    <TCardList
      :collection="collection"
      title="Endorsements"
      add="Add a dance"
      :fields="fields"
    >
      <template v-slot:empty>
        <div class="text-center mt-4">
          Create your first endorsement.
        </div>
      </template>
      <template v-slot:default="{ item }">
        <div class="card-item border p-4">
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

    return {
      collection,
      fields,
      getDateTime
    }
  }
}
</script>

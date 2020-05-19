<template>
  <div class="p-4">
    <TCardList
      :collection="collection"
      title="Tags"
      add="Add a tag"
      :fields="fields"
    >
      <template v-slot:empty>
        <div class="text-center mt-4">
          There are no tags yet.
        </div>
      </template>
      <template v-slot:default="{ item }">
        <div class="card-item border">
          <div class="p-4">
            {{ item.label }}
          </div>
        </div>
      </template>
    </TCardList>
  </div>
</template>

<script>
import TCardList from '~/components/TCardList'

export default {
  name: 'TagsIndex',
  components: {
    TCardList
  },
  setup() {
    const collection = 'tags'

    const fields = [
      {
        name: 'type',
        label: 'Type'
      }
    ]

    return {
      collection,
      fields
    }
  }
}
</script>

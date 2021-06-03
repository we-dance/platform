<template>
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
      <div class="rounded bg-white mb-4 shadow border">
        <div class="p-4">
          {{ item.label }}
        </div>
      </div>
    </template>
  </TCardList>
</template>

<script>
export default {
  middleware: ['auth'],
  name: 'TagsIndex',
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

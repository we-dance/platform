<template>
  <TCardList
    :collection="collection"
    :title="title"
    :add="add"
    :fields="fields"
  >
    <template v-slot:empty>
      <div class="text-center my-16">There are no {{ collection }} yet.</div>
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
  name: 'SkillsIndex',
  setup() {
    const collection = 'skills'
    const add = 'Add skill'
    const title = 'Skills'

    const fields = [
      {
        name: 'label',
        label: 'Label'
      }
    ]

    return {
      collection,
      fields,
      add,
      title
    }
  }
}
</script>

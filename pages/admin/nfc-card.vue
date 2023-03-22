<template>
  <TCardList v-bind="config">
    <template v-slot="{ item }">
      <div class="p-4 border rounded mb-4 bg-white">
        <div class="flex justify-between items-start">
          <div>
            <div class="font-bold text-lg">
              {{ item.username }}
            </div>
            <div>
              Link:
              <span class="text-xs font-mono bg-gray-200 p-1 rounded">https://wedance.vip/nfc/{{
                item.id
              }}</span>
            </div>
            <div>
                To:  
                <span class="text-xs font-mono bg-gray-200 p-1 rounded">  https://wedance.vip/{{
                  item.username
                }}</span>
              </div>
          </div>
          <div>
            <div
             class="text-xs font-bold p-1 "
            >
              State: {{ item.state }}
            </div>
          </div>
        </div>

        <TPopupEdit
          :fields="config.fields"
          label="Edit"
          show-remove
          :collection="config.collection"
          :item="item"
          class="mt-2"
        />
      </div>
    </template>
  </TCardList>
</template>

<script>

export default {
  middleware: ['auth'],
  
  setup() {
    const config = {
      collection: 'nfc-card',
      title: 'NFC Card',
      empty: 'Nothing here',
      add: 'Add',
      fields: [
        {
          name: 'username',
        },
        {
          name: 'state',
          component: 'TInputSelect',
          options: ['unused', 'used'],
        },
      ],
    }

    return {
      config,
    }
  },
}
</script>

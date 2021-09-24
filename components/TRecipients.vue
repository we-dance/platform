<template>
  <TPopup
    title="Recipients"
    class="p-4 border rounded mb-4"
    @close="$emit('close')"
  >
    <div class="w-64 py-4 h-64 overflow-y-scroll">
      <div v-for="(items, folder) in folders" :key="folder" class="mb-2">
        <div
          v-if="items.length"
          class="px-2 py-1 rounded font-bold cursor-pointer"
          :class="states[folder]"
          @click="current === folder ? (current = '') : (current = folder)"
        >
          {{ folderNames[folder] }} ({{ items.length }}) –
          {{ percent(items.length) }}%
        </div>
        <div v-if="current === folder" class="mb-4 ml-4">
          <div
            v-for="(recipient, uid) in items"
            :key="uid"
            class="flex items-center my-1"
          >
            <div class="mr-4">
              <div class="text-xs text-gray-500 leading-none">
                {{ getDateTime(recipient[folder]) }}
              </div>
              <div>{{ recipient.name || recipient.email }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </TPopup>
</template>

<script>
import { getDateTime } from '~/utils'

export default {
  props: {
    recipients: {
      type: Object,
      default: () => ({}),
    },
  },
  data: () => ({
    current: '',
    states: {
      deliveredAt: 'bg-green-500',
      openedAt: 'bg-green-500',
      clickedAt: 'bg-green-500',
      failedAt: 'bg-red-500',
      spammedAt: 'bg-orange-500',
      unsubscribedAt: 'bg-orange-500',
    },
    folderNames: {
      deliveredAt: 'Unread',
      openedAt: 'Opened',
      clickedAt: 'Clicked',
      failedAt: 'Failed',
      spammedAt: 'Spammed',
      unsubscribedAt: 'Unsubscribed',
    },
  }),
  setup() {
    return { getDateTime }
  },
  computed: {
    itemsList() {
      return Object.keys(this.recipients).map((i) => this.recipients[i])
    },
    folders() {
      if (!this.recipients) {
        return {}
      }

      const recipients = this.itemsList

      return {
        failedAt: recipients.filter(
          (item) => item.failedAt && !item.deliveredAt
        ),
        spammedAt: recipients.filter((item) => item.spammedAt),
        unsubscribedAt: recipients.filter((item) => item.unsubscribedAt),
        clickedAt: recipients.filter((item) => item.clickedAt),
        openedAt: recipients.filter((item) => item.openedAt && !item.clickedAt),
        deliveredAt: recipients.filter(
          (item) =>
            item.deliveredAt &&
            !item.openedAt &&
            !item.unsubscribedAt &&
            !item.spammedAt &&
            !item.clickedAt
        ),
      }
    },
  },
  methods: {
    percent(count) {
      const round = (val) => Math.round(val)

      return round((count / this.itemsList.length) * 100)
    },
  },
}
</script>

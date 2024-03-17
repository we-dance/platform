<template>
  <div>
    <TButton
      :type="type"
      :icon="icon"
      label="Account"
      @click="
        load(id)
        isReportShown = true
      "
    />
    <TPopup
      v-if="isReportShown"
      title="Account Info"
      @close="isReportShown = false"
    >
      <div class="p-4">
        <pre>ID: {{ id }}</pre>
        <pre>{{ account }}</pre>
      </div>
    </TPopup>
  </div>
</template>

<script>
import { useDoc } from '~/use/doc'

export default {
  name: 'TCardActions',
  setup() {
    const { doc: account, load } = useDoc('accounts')

    return { load, account }
  },
  props: {
    id: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'base',
    },
    icon: {
      type: String,
      default: 'tune',
    },
  },
  data: () => ({
    isReportShown: false,
  }),
}
</script>

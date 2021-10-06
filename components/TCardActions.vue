l<template>
  <div>
    <TButton type="base" @click="isReportShown = true">Report</TButton>
    <TPopup v-if="isReportShown" title="Report" @close="isReportShown = false">
      <div class="p-4">
        <TField
          v-model="reportCategory"
          label="Reason"
          type="select"
          :options="['spam', 'other']"
        />
        <TField
          v-model="reportReason"
          class="mt-2"
          label="Comments"
          type="textarea"
        />
        <div class="mt-4 flex justify-end">
          <TButton class="mr-2" @click="cancelReport">Cancel</TButton>
          <TButton type="danger" @click="report">Report</TButton>
        </div>
      </div>
    </TPopup>
  </div>
</template>

<script>
import { useDoc } from '~/use/doc'

export default {
  setup() {
    const { create: createReport } = useDoc('reports')

    return {
      createReport,
    }
  },
  props: {
    id: {
      type: String,
      default: '',
    },
    collection: {
      type: String,
      default: '',
    },
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  data: () => ({
    isReportShown: false,
    reportCategory: 'spam',
    reportReason: '',
  }),
  methods: {
    cancelReport() {
      this.reportId = 0
      this.reportReason = ''
      this.reportCategory = 'other'
      this.isReportShown = false
    },
    report() {
      this.createReport({
        state: 'open',
        documentId: this.id,
        category: this.reportCategory,
        collection: this.collection,
        reason: this.reportReason,
        documentData: this.item,
      })
      this.cancelReport()
    },
  },
}
</script>

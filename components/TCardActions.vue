<template>
  <div>
    <TButton
      :type="type"
      icon="fire"
      :label="$t('post.report')"
      @click="isReportShown = true"
    />
    <TPopup
      v-if="isReportShown"
      :title="$t('post.report')"
      @close="isReportShown = false"
    >
      <div class="p-4">
        <TField
          v-model="reportCategory"
          :label="$t('TCardActions.Reason')"
          component="TInputSelect"
          :options="[
            { value: 'spam', label: $t('TCardActions.options.spam') },
            { value: 'other', label: $t('TCardActions.options.other') },
          ]"
        />
        <TField
          v-model="reportReason"
          class="mt-2"
          :label="$t('comments.label')"
          component="TInputTextarea"
        />
        <div class="mt-4 flex justify-end">
          <TButton class="mr-2" @click="cancelReport">{{
            $t('form.cancel')
          }}</TButton>
          <TButton type="danger" @click="report">{{
            $t('post.report')
          }}</TButton>
        </div>
      </div>
    </TPopup>
  </div>
</template>

<script>
import { useDoc } from '~/use/doc'

export default {
  name: 'TCardActions',
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
    type: {
      type: String,
      default: 'base',
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

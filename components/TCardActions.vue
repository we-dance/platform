<template>
  <div class="float-right -mr-2">
    <TMenu>
      <template v-slot:button>
        <TIcon
          class="cursor-pointer rounded-full hover:bg-gray-200 p-1"
          name="more_vert"
        />
      </template>
      <template v-slot:menu="{ closeMenu }">
        <div class="w-32 py-2 bg-white rounded-lg shadow-xl border">
          <TButton
            type="context"
            @click="
              isReportShown = true
              closeMenu()
            "
            >Report</TButton
          >
        </div>
      </template>
    </TMenu>
    <TPopup v-if="isReportShown" title="Report a post">
      <TSelect
        v-model="reportCategory"
        label="Category"
        type="select"
        :options="['other', 'spam']"
      />
      <TField v-model="reportReason" class="mt-2" label="Reason" />
      <div class="mt-4 flex justify-end">
        <TButton class="mr-2" @click="cancelReport">Cancel</TButton>
        <TButton type="danger" @click="report">Report</TButton>
      </div>
    </TPopup>
  </div>
</template>

<script>
import useDoc from '~/use/doc'

export default {
  setup() {
    const { create: createReport } = useDoc('reports')

    return {
      createReport
    }
  },
  props: {
    id: {
      type: String,
      default: ''
    },
    collection: {
      type: String,
      default: ''
    },
    item: {
      type: Object,
      default: () => ({})
    }
  },
  data: () => ({
    isReportShown: false,
    reportCategory: 'spam',
    reportReason: ''
  }),
  methods: {
    cancelReport() {
      this.reportId = 0
      this.reportReason = ''
      this.reportCategory = 'other'
    },
    report(item) {
      this.createReport({
        state: 'open',
        documentId: this.id,
        category: this.reportCategory,
        collection: this.collection,
        reason: this.reportReason,
        documentData: this.item
      })
      this.cancelReport()
    }
  }
}
</script>

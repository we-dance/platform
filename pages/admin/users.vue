<template>
  <div class="flex flex-col" style="height: 100vh">
    <TInputButtons
      v-model="includeMarketing"
      :options="includeMarketingOptions"
    />
    <ag-grid-vue
      class="ag-theme-alpine mt-4"
      style="width: 100%; height: 100%"
      :column-defs="columns"
      :row-data="accounts"
      @grid-ready="onGridReady"
    />
  </div>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/firestore'
import { computed, onMounted, ref, watch } from 'vue-demi'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'
import { AgGridVue } from 'ag-grid-vue'
import { getDateTime } from '~/utils'
import { useApp } from '~/use/app'

export default {
  layout: 'empty',
  middleware: ['auth'],
  components: {
    AgGridVue,
  },
  setup() {
    const { getCity } = useApp()

    const includeMarketing = ref(false)
    const includeMarketingOptions = [
      { value: false, label: 'Profiles' },
      { value: true, label: 'Marketing' },
    ]
    const columns = computed(() => [
      { field: 'id' },
      {
        field: 'username',
        cellRenderer: (params) =>
          `<a target="blank" href="/${
            params.data.username
          }" class="underline text-primary">${params.data.username || ''}</a>`,
      },
      { field: 'jobs', resizable: true },
      {
        field: 'photo',
        valueGetter: (params) => (params.data.photo ? 'Yes' : 'No'),
      },
      {
        field: 'city',
        valueGetter: (params) => getCity(params.data.place),
      },
      {
        field: 'registrationDate',
        valueGetter: (params) => getDateTime(params.data.createdAt),
      },
      {
        field: 'lastLoginAt',
        valueGetter: (params) => getDateTime(params.data.lastLoginAt),
      },
      { field: 'daysUsed' },
      { field: 'visibility' },
      {
        field: 'languages',
        valueGetter: (params) => Object.keys(params.data.locales).join(', '),
      },
      { field: 'instagram' },
      { field: 'telegram' },
      {
        field: 'sessionStart',
        valueGetter: (params) => getDateTime(params.data.marketing?.updatedAt),
        hide: !includeMarketing.value,
      },
      {
        field: 'campaign',
        valueGetter: (params) => params.data.marketing?.utms?.utm_campaign,
        hide: !includeMarketing.value,
      },
      {
        field: 'source',
        valueGetter: (params) => params.data.marketing?.utms?.utm_source,
        hide: !includeMarketing.value,
      },
      {
        field: 'medium',
        valueGetter: (params) => params.data.marketing?.utms?.utm_medium,
        hide: !includeMarketing.value,
      },
      {
        field: 'ref',
        valueGetter: (params) => params.data.marketing?.ref,
        hide: !includeMarketing.value,
      },
      {
        field: 'referrer',
        valueGetter: (params) => params.data.marketing?.referrer,
        hide: !includeMarketing.value,
      },
      {
        field: 'fbclid',
        valueGetter: (params) => params.data.marketing?.fbclid,
        hide: !includeMarketing.value,
      },
      {
        field: 'gclid',
        valueGetter: (params) => params.data.marketing?.gclid,
        hide: !includeMarketing.value,
      },
    ])

    const api = ref(null)
    const accounts = ref([])

    const firestore = firebase.firestore()

    const onGridReady = (params) => {
      api.value = params.api
    }

    const load = () => {
      firestore
        .collection('profiles')
        .limit(100)
        .orderBy('createdAt', 'desc')
        .get()
        .then((snapshot) => {
          accounts.value = snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }))

          if (includeMarketing.value) {
            snapshot.docs.forEach((doc) => {
              firestore
                .collection('marketing')
                .where('uid', '==', doc.id)
                .orderBy('updatedAt', 'asc')
                .limit(1)
                .get()
                .then((snapshot) => {
                  if (snapshot.docs.length) {
                    const marketing = snapshot.docs[0].data()

                    accounts.value.find(
                      (account) => account.id === marketing.uid
                    ).marketing = marketing
                  }

                  api.value.redrawRows()
                })
            })
          }
        })
    }

    watch(includeMarketing, load)

    onMounted(load)

    return {
      accounts,
      columns,
      onGridReady,
      includeMarketing,
      includeMarketingOptions,
    }
  },
}
</script>

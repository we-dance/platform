<template>
  <ag-grid-vue
    style="height: 100vh; width: 100%"
    class="ag-theme-alpine"
    :column-defs="columns"
    :row-data="accounts"
    @grid-ready="onGridReady"
  />
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/firestore'
import { onMounted, ref } from 'vue-demi'
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

    const api = ref(null)
    const accounts = ref([])
    const columns = [
      { field: 'id' },
      {
        field: 'username',
        cellRenderer: (params) =>
          `<a target="blank" href="/${
            params.data.username
          }" class="underline text-primary">${params.data.username || ''}</a>`,
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
      {
        field: 'sessionStart',
        valueGetter: (params) => getDateTime(params.data.marketing?.updatedAt),
      },
      { field: 'daysUsed' },
      { field: 'visibility' },
      { field: 'jobs' },
      {
        field: 'languages',
        valueGetter: (params) => Object.keys(params.data.locales).join(', '),
      },
      { field: 'instagram' },
      { field: 'telegram' },
      {
        field: 'campaign',
        valueGetter: (params) => params.data.marketing?.utms?.utm_campaign,
      },
      {
        field: 'source',
        valueGetter: (params) => params.data.marketing?.utms?.utm_source,
      },
      {
        field: 'medium',
        valueGetter: (params) => params.data.marketing?.utms?.utm_medium,
      },
      {
        field: 'ref',
        valueGetter: (params) => params.data.marketing?.ref,
      },
      {
        field: 'referrer',
        valueGetter: (params) => params.data.marketing?.referrer,
      },
      {
        field: 'fbclid',
        valueGetter: (params) => params.data.marketing?.fbclid,
      },
      {
        field: 'gclid',
        valueGetter: (params) => params.data.marketing?.gclid,
      },
    ]

    const firestore = firebase.firestore()

    const onGridReady = (params) => {
      api.value = params.api
    }

    onMounted(() => {
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
        })
    })

    return {
      accounts,
      columns,
      onGridReady,
    }
  },
}
</script>

<template>
  <div class="flex flex-col" style="height: 100vh">
    <div class="p-4 flex space-x-4">
      <div>{{ profiles.length }} profiles</div>
      <TInputButtons v-model="onlyLast" :options="onlyLastOptions" />
      <TInputButtons v-model="view" :options="viewOptions" />
    </div>

    <ag-grid-vue
      class="ag-theme-alpine mt-4"
      style="width: 100%; height: 100%"
      :column-defs="columns"
      :row-data="profiles"
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

    const view = ref('profiles')
    const viewOptions = [
      { value: 'profiles', label: 'Profiles' },
      { value: 'marketing', label: 'Marketing' },
    ]

    const onlyLast = ref(true)
    const onlyLastOptions = [
      { value: false, label: 'All' },
      { value: true, label: 'Last 100' },
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
        field: 'partner',
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
        field: 'permission',
      },
      {
        field: 'languages',
        valueGetter: (params) => Object.keys(params.data.locales).join(', '),
      },
      { field: 'instagram' },
      { field: 'telegram' },
      {
        field: 'sessionStart',
        valueGetter: (params) => getDateTime(params.data.marketing?.updatedAt),
        hide: view.value !== 'marketing',
      },
      {
        field: 'campaign',
        valueGetter: (params) => params.data.marketing?.utms?.utm_campaign,
        hide: view.value !== 'marketing',
      },
      {
        field: 'source',
        valueGetter: (params) => params.data.marketing?.utms?.utm_source,
        hide: view.value !== 'marketing',
      },
      {
        field: 'medium',
        valueGetter: (params) => params.data.marketing?.utms?.utm_medium,
        hide: view.value !== 'marketing',
      },
      {
        field: 'start',
        valueGetter: (params) => params.data.marketing?.start,
        hide: view.value !== 'marketing',
        resizable: true,
      },
      {
        field: 'target',
        valueGetter: (params) => params.data.marketing?.target,
        hide: view.value !== 'marketing',
        resizable: true,
      },
      {
        field: 'from',
        valueGetter: (params) => params.data.marketing?.from,
        hide: view.value !== 'marketing',
      },
      {
        field: 'promo',
        valueGetter: (params) => params.data.marketing?.promo,
        hide: view.value !== 'marketing',
      },
      {
        field: 'ref',
        valueGetter: (params) => params.data.marketing?.ref,
        hide: view.value !== 'marketing',
      },
      {
        field: 'referrer',
        valueGetter: (params) => params.data.marketing?.referrer,
        hide: view.value !== 'marketing',
        resizable: true,
      },
      {
        field: 'fbclid',
        valueGetter: (params) => params.data.marketing?.fbclid,
        hide: view.value !== 'marketing',
        resizable: true,
      },
      {
        field: 'gclid',
        valueGetter: (params) => params.data.marketing?.gclid,
        hide: view.value !== 'marketing',
        resizable: true,
      },
    ])

    const api = ref(null)
    const profiles = ref([])

    const firestore = firebase.firestore()

    const onGridReady = (params) => {
      api.value = params.api
    }

    const load = () => {
      let collection = firestore
        .collection('profiles')
        .orderBy('createdAt', 'desc')

      if (onlyLast.value) {
        collection = collection.limit(100)
      }

      collection.get().then((snapshot) => {
        profiles.value = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))

        if (view.value === 'marketing') {
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

                  profiles.value.find(
                    (account) => account.id === marketing.uid
                  ).marketing = marketing
                }

                api.value.redrawRows()
              })
          })
        }
      })
    }

    watch(view, load)
    watch(onlyLast, load)

    onMounted(load)

    return {
      profiles,
      columns,
      onGridReady,
      view,
      viewOptions,
      onlyLast,
      onlyLastOptions,
    }
  },
}
</script>

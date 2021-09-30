<template>
  <div class="flex flex-col" style="height: 100vh">
    <ag-grid-vue
      class="ag-theme-alpine mt-4"
      style="width: 100%; height: 100%"
      :column-defs="columns"
      :row-data="events"
      @grid-ready="onGridReady"
    />
  </div>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/firestore'
import { computed, onMounted, ref } from 'vue-demi'
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

    const columns = computed(() => [
      { field: 'id' },
      {
        field: 'name',
        cellRenderer: (params) =>
          `<a target="blank" href="/events/${
            params.data.id
          }" class="underline text-primary">${params.data.name || ''}</a>`,
        resizable: true,
      },
      {
        field: 'organiser',
      },
      {
        field: 'cover',
        valueGetter: (params) => (params.data.cover ? 'Yes' : 'No'),
      },
      {
        field: 'address',
        valueGetter: (params) => params.data.venue?.formatted_address || '',
        resizable: true,
      },
      {
        field: 'community',
        valueGetter: (params) =>
          params.data.place ? getCity(params.data.place) : 'International',
      },
      {
        field: 'link',
        valueGetter: (params) => (params.data.link ? 'Yes' : 'No'),
      },
      {
        field: 'createdAt',
        valueGetter: (params) => getDateTime(params.data.createdAt),
      },
      {
        field: 'startDate',
        valueGetter: (params) => getDateTime(params.data.startDate),
      },
      {
        field: 'endDate',
        valueGetter: (params) => getDateTime(params.data.endDate),
      },
      {
        field: 'price',
      },
      {
        field: 'type',
      },
      {
        field: 'promo',
        valueGetter: (params) => params.data.promo,
      },
      { field: 'visibility' },
    ])

    const api = ref(null)
    const events = ref([])

    const firestore = firebase.firestore()

    const onGridReady = (params) => {
      api.value = params.api
    }

    const load = () => {
      firestore
        .collection('events')
        .limit(100)
        .orderBy('createdAt', 'desc')
        .get()
        .then((snapshot) => {
          events.value = snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }))
        })
    }

    onMounted(load)

    return {
      events,
      columns,
      onGridReady,
    }
  },
}
</script>

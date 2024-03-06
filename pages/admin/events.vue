<template>
  <div class="flex flex-col" style="height: 100vh">
    <div class="p-4 flex space-x-4">
      <div>{{ events.length }} events</div>
      <t-rich-select
        v-model="orderBy"
        placeholder="Sort"
        :options="[
          {
            label: 'Created At',
            value: 'createdAt',
          },
          {
            label: 'Start Date',
            value: 'startDate',
          },
          {
            label: 'Views Count',
            value: 'viewsCount',
          },
        ]"
        hide-search-box
      />
    </div>
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

    const orderBy = ref('createdAt')

    const columns = computed(() => [
      { field: 'id' },
      {
        field: 'name',
        cellRenderer: (params) =>
          `<a target="blank" href="/events/${
            params.data.id
          }" class="underline text-primary">${params.data.name ||
            params.data.title ||
            ''}</a>`,
        resizable: true,
      },
      {
        field: 'organiser',
        valueGetter: (params) => params.data.org?.username || '',
      },
      {
        field: 'viewsCount',
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
        field: 'city',
        valueGetter: (params) =>
          params.data.place ? getCity(params.data.place) : 'International',
      },
      {
        field: 'link',
        valueGetter: (params) => (params.data.link ? 'Yes' : 'No'),
      },
      {
        field: 'source',
      },
      {
        field: 'provider',
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
    ])

    const api = ref(null)
    const events = ref([])

    const firestore = firebase.firestore()

    const onGridReady = (params) => {
      api.value = params.api
    }

    const load = () => {
      let collection = firestore
        .collection('posts')
        .orderBy(orderBy.value, 'desc')

      collection = collection.limit(100)

      collection.get().then((snapshot) => {
        events.value = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
      })
    }

    watch(orderBy, load)

    onMounted(load)

    return {
      events,
      columns,
      onGridReady,
      orderBy,
    }
  },
}
</script>

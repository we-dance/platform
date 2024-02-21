<template>
  <div class="flex flex-col" style="height: 100vh">
    <div class="p-4 flex space-x-4">
      <div>{{ profiles.length }} profiles</div>
      <t-rich-select
        v-model="orderBy"
        placeholder="Sort"
        :options="[
          {
            label: 'Created At',
            value: 'createdAt',
          },
          {
            label: 'Last Login At',
            value: 'lastLoginAt',
          },
          {
            label: 'Days Used',
            value: 'daysUsed',
          },
        ]"
        hide-search-box
      />
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

export default {
  layout: 'empty',
  middleware: ['auth'],
  components: {
    AgGridVue,
  },
  setup() {
    const columns = computed(() => [
      { field: 'id', resizable: true },
      {
        field: 'username',
        cellRenderer: (params) =>
          `<a target="blank" href="/${
            params.data.username
          }" class="underline text-primary">${params.data.username || ''}</a>`,
      },
      { field: 'type', resizable: true },
      { field: 'jobs', resizable: true },
      {
        field: 'owned',
        valueGetter: (params) =>
          params.data.id === params.data.createdBy ? 'Yes' : 'No',
      },
      {
        field: 'photo',
        valueGetter: (params) => (params.data.photo ? 'Yes' : 'No'),
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
      {
        field: 'languages',
        valueGetter: (params) =>
          params.data.locales
            ? Object.keys(params.data.locales).join(', ')
            : '',
      },
      { field: 'instagram', resizable: true },
      { field: 'telegram', resizable: true },
    ])

    const orderBy = ref('createdAt')
    const api = ref(null)
    const profiles = ref([])

    const firestore = firebase.firestore()

    const onGridReady = (params) => {
      api.value = params.api
    }

    const load = () => {
      let collection = firestore
        .collection('profiles')
        .orderBy(orderBy.value, 'desc')

      collection = collection.limit(100)

      collection.get().then((snapshot) => {
        profiles.value = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
      })
    }

    onMounted(load)
    watch(orderBy, load)

    return {
      profiles,
      columns,
      onGridReady,
      orderBy,
    }
  },
}
</script>

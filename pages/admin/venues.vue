<template>
  <div class="flex flex-col" style="height: 100vh">
    <div class="p-4 flex space-x-4">
      <div>{{ venues.length }} venues</div>
      <TInputButtons v-model="onlyLast" :options="onlyLastOptions" />
    </div>
    <ag-grid-vue
      class="ag-theme-alpine mt-4"
      style="width: 100%; height: 100%"
      :column-defs="columns"
      :row-data="venues"
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

export default {
  layout: 'empty',
  middleware: ['auth'],
  components: {
    AgGridVue,
  },
  setup() {
    const onlyLast = ref(true)
    const onlyLastOptions = [
      { value: false, label: 'All' },
      { value: true, label: 'Last 100' },
    ]

    const columns = computed(() => [
      { field: 'id', resizable: true },
      {
        field: 'name',
        resizable: true,
      },
      {
        field: 'address',
        valueGetter: (params) => params.data.address?.formatted_address || '',
        resizable: true,
      },
      {
        field: 'rooms',
        resizable: true,
      },
    ])

    const api = ref(null)
    const venues = ref([])

    const firestore = firebase.firestore()

    const onGridReady = (params) => {
      api.value = params.api
    }

    const load = () => {
      let collection = firestore.collection('venues').orderBy('name', 'asc')

      if (onlyLast.value) {
        collection = collection.limit(100)
      }

      collection.get().then((snapshot) => {
        venues.value = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
      })
    }

    watch(onlyLast, load)

    onMounted(load)

    return {
      venues,
      columns,
      onGridReady,
      onlyLast,
      onlyLastOptions,
    }
  },
}
</script>

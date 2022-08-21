<template>
  <TForm v-model="data" :fields="schema" class="p-10" />
</template>

<script>
import { ref } from '@nuxtjs/composition-api'
export default {
  setup() {
    const data = ref({
      name: 'Salsa Party',
      schedule: [
        {
          name: 'Check-in',
          startDate: '19:00',
          endDate: '2022-08-16 20:00',
          description: '',
        },
        {
          name: 'Doors close',
          startDate: '23:59',
          description: 'This is a test description',
        },
      ],
    })
    const schema = [
      {
        name: 'name',
        component: 'TInput',
      },
      {
        name: 'schedule',
        component: 'TInputArray',
        children: {
          component: 'TInputEvent',
        },
      },
    ]
    return { data, schema }
  },
}
</script>

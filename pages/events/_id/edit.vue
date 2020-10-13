<template>
  <div class="mx-auto w-full max-w-lg">
    <div class="flex justify-between m-4">
      <div class="font-bold">Add event</div>
      <button class="cursor-pointer" @click="$router.back()">
        <TIcon name="close" class="cursor-pointer w-4 h-4" />
      </button>
    </div>

    <TForm
      v-model="item"
      :fields="fields"
      vertical
      :show-cancel="!!id"
      :show-remove="!!id"
      :submit-label="id ? 'Save' : 'Add'"
      class="bg-real-white p-4"
      @save="saveItem"
      @cancel="cancelItem"
      @remove="removeItem"
    />
  </div>
</template>

<script>
import { computed } from '@nuxtjs/composition-api'
import ls from 'local-storage'
import { getDateObect, toDatetimeLocal } from '~/utils'
import useAuth from '~/use/auth'
import useDoc from '~/use/doc'
import useRouter from '~/use/router'

export default {
  name: 'EventEdit',
  layout: 'empty',
  middleware: ['auth'],
  data: () => ({
    selectedType: 'event'
  }),
  computed: {
    fields() {
      return this.types.find((f) => f.value === this.selectedType).fields
    }
  },
  mounted() {
    const city = ls('city')
    this.item = this.item || {
      city,
      visibility: 'Public',
      form: 'No',
      type: 'Course'
    }
  },
  methods: {
    cancelItem() {
      if (this.id) {
        this.$router.push(`/events/${this.id}`)
      } else {
        this.$router.push(`/events`)
      }
    },
    async saveItem(data) {
      if (!data.name) {
        return
      }

      if (data.id) {
        await this.update(data.id, data)
      } else {
        await this.create(data)
      }

      this.cancelItem()
    },
    async removeItem(id) {
      await this.remove(id)
      this.cancelItem()
    }
  },
  setup() {
    const { can } = useAuth()
    const { params } = useRouter()

    const collection = 'events'

    const { doc: item, id, load, update, remove, create } = useDoc(collection)

    const types = computed(() => [
      {
        label: 'Event',
        value: 'event',
        fields: [
          {
            name: 'name',
            hideLabel: true,
            placeholder: 'Name'
          },
          {
            name: 'description',
            hideLabel: true,
            type: 'textarea',
            placeholder: 'Description'
          },

          {
            name: 'city',
            type: 'city'
          },
          {
            name: 'cover',
            type: 'photo',
            width: 500,
            height: 500,
            circle: false
          },
          {
            name: 'organiser'
          },
          {
            name: 'address',
            label: 'Street, house',
            type: 'address',
            description:
              'Please do not include here anything else except street and house number. You can add all additional information in the description.'
          },
          {
            name: 'form',
            label: 'External registration?',
            type: 'select',
            options: ['Yes', 'No']
          },
          {
            name: 'link',
            description: 'URL of your registration form',
            when: (answers) => answers.form === 'Yes'
          },
          {
            name: 'type',
            type: 'select',
            options: ['Party', 'Course']
          },
          {
            name: 'startDate',
            type: 'datetime',
            set: (val) => {
              if (!val) return ''
              return new Date(val)
            },
            get: (val) => {
              if (!val) return ''
              return toDatetimeLocal(getDateObect(val))
            }
          },
          {
            name: 'endDate',
            type: 'datetime',
            set: (val) => {
              if (!val) return ''
              return new Date(val)
            },
            get: (val) => {
              if (!val) return ''
              return toDatetimeLocal(getDateObect(val))
            }
          },
          {
            name: 'styles',
            type: 'stylesSelect'
          },
          {
            name: 'visibility',
            type: 'select',
            options: ['Public', 'Members', 'Unlisted'],
            description:
              'Public - searchable in Google. Members - visible for logged-in users. Unlisted - possible to open with exact link, but they are not listed and not shown in search.'
          }
        ]
      }
    ])

    if (params.id !== '-') {
      load(params.id)
    }

    return {
      item,
      id,
      can,
      collection,
      update,
      remove,
      create,
      types
    }
  }
}
</script>

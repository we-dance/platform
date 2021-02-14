<template>
  <div class="bg-dark md:py-4">
    <div
      class="mx-auto w-full max-w-lg md:rounded md:border md:shadow bg-white"
    >
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
        :show-remove="!!id"
        :show-copy="!!id"
        :submit-label="id ? 'Save' : 'Add'"
        class="bg-white p-4"
        @copy="copyItem"
        @save="saveItem"
        @cancel="cancelItem"
        @remove="removeItem"
      />
    </div>
  </div>
</template>

<script>
import { addMinutes, parseISO } from 'date-fns'
import { computed } from '@nuxtjs/composition-api'
import ls from 'local-storage'
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
  watch: {
    loading(loading) {
      if (!loading && this.item) {
        if (!this.can('edit', 'events', this.item)) {
          this.$nuxt.error({ statusCode: 405 })
        }
      }
    }
  },
  computed: {
    fields() {
      return this.types.find((f) => f.value === this.selectedType).fields
    }
  },
  mounted() {
    if (!this.can('edit', 'events', this.item)) {
      this.error({ statusCode: 405 })
    }

    const city = ls('city')
    this.item = this.item || {
      city,
      visibility: 'Public',
      form: 'No',
      type: 'Course',
      duration: 60,
      price: 'FREE',
      cover: this.profile?.photo || '',
      organiser: this.profile?.username || ''
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
    async copyItem(data) {
      if (!data.name) {
        return
      }

      const doc = await this.create(data)

      this.$router.push(`/events/${doc.id}`)
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
    const { can, profile, isAdmin } = useAuth()
    const { params } = useRouter()

    const collection = 'events'

    const { doc: item, id, load, update, remove, create, loading } = useDoc(
      collection
    )

    const updateEndDate = (e) => {
      if (!e.duration || e.duration === 'custom') {
        return
      }

      e.endDate = addMinutes(parseISO(e.startDate), e.duration)
    }

    const types = computed(() => [
      {
        label: 'Event',
        value: 'event',
        fields: [
          {
            name: 'cover',
            type: 'photo',
            width: 500,
            height: 500,
            circle: false,
            hideLabel: true
          },
          {
            name: 'name',
            hideLabel: true,
            placeholder: 'Event Name'
          },
          {
            name: 'description',
            hideLabel: true,
            type: 'textarea',
            placeholder: 'Event Description (markdown)',
            description:
              '[Markdown cheatsheet](https://simplemde.com/markdown-guide)'
          },
          {
            name: 'price'
          },
          {
            name: 'address',
            label: 'Where?',
            type: 'address'
          },
          {
            name: 'startDate',
            type: 'datetime',
            label: 'When?',
            onChange: updateEndDate
          },
          {
            name: 'duration',
            label: 'How long?',
            onChange: updateEndDate,
            type: 'select',
            options: [
              {
                value: 30,
                label: '30 min'
              },
              {
                value: 60,
                label: '1 hour'
              },
              {
                value: 90,
                label: '1.5 hour'
              },
              {
                value: 120,
                label: '2 hours'
              },
              {
                value: 'custom',
                label: 'Custom'
              }
            ]
          },
          {
            name: 'endDate',
            type: 'datetime',
            when: (e) => e.duration === 'custom'
          },
          {
            name: 'styles',
            label: 'What?',
            type: 'stylesSelect'
          },
          {
            name: 'type',
            type: 'select',
            options: ['Party', 'Course']
          },
          {
            name: 'visibility',
            type: 'select',
            options: ['Public', 'Members', 'Unlisted'],
            tip: `- Public - searchable in Google.\n- Members - visible only for logged-in users.\n- Unlisted - possible to open with exact link, but they are not listed nor not shown in the search.`
          },
          {
            name: 'form',
            label: 'Do you have a link?',
            type: 'select',
            options: ['Yes', 'No']
          },
          {
            name: 'link',
            description: 'URL of your registration form',
            when: (answers) => answers.form === 'Yes'
          },
          {
            name: 'city',
            label: 'Community',
            type: 'city'
          },
          {
            name: 'createdBy',
            label: 'Owner',
            type: 'account',
            when: () => isAdmin()
          }
        ]
      }
    ])

    if (params.id !== '-') {
      load(params.id)
    }

    return {
      loading,
      item,
      id,
      can,
      collection,
      update,
      remove,
      create,
      types,
      profile
    }
  }
}
</script>

<template>
  <div class="bg-dark md:py-4 min-h-screen">
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
        :edit-creator="isAdmin()"
        :fields="fields"
        vertical
        :show-remove="!!item.id"
        :show-copy="!!item.id"
        submit-label="Save"
        class="bg-white p-4 space-y-4"
        @copy="copyItem"
        @save="saveItem"
        @cancel="view(item.id)"
        @remove="removeItem"
      />
    </div>
  </div>
</template>

<script>
import { pickBy } from 'lodash'
import { addMinutes, parseISO } from 'date-fns'
import { computed } from '@nuxtjs/composition-api'
import { useAuth } from '~/use/auth'
import { useDoc } from '~/use/doc'
import { useRouter } from '~/use/router'
import { useEvents } from '~/use/events'

export default {
  name: 'EventEdit',
  layout: 'empty',
  middleware: ['auth'],
  props: {
    id: {
      type: String,
      default: '-',
    },
  },
  data: () => ({
    selectedType: 'event',
  }),
  computed: {
    fields() {
      return this.types.find((f) => f.value === this.selectedType).fields
    },
  },
  watch: {
    loading(loading) {
      if (!loading && this.item) {
        if (!this.can('edit', 'events', this.item)) {
          this.$nuxt.error({ statusCode: 405 })
        }
      }
    },
  },
  mounted() {
    if (this.id === '-') {
      this.item = {
        place: this.profile?.place,
        visibility: 'Public',
        form: 'No',
        online: 'No',
        international: 'No',
        claimed: 'No',
        type: 'Party',
        duration: 60,
        price: '0',
        styles: {},
        cover: '',
        organiser: this.profile?.username || '',
        promoter: this.profile?.username || '',
      }
    }
  },
  methods: {
    view(id) {
      if (id && id !== '-') {
        this.$router.push(`/events/${id}`)
      } else {
        this.$router.push(`/events`)
      }
    },
    async copyItem(data) {
      if (!data.name) {
        return
      }

      this.$fire.analytics.logEvent('copy_event')
      const doc = await this.create(data)

      this.$router.push(`/events/${doc.id}`)
    },
    async saveItem(data) {
      if (!data.name) {
        return
      }

      data.organisedBy = this.uid
      data.promotedBy = this.uid

      if (data.claimed === 'No') {
        data.organiser = ''
        data.organisedBy = ''
      }

      data = pickBy(data, (v) => v !== undefined)

      if (data.id) {
        this.$fire.analytics.logEvent('update_event')
        await this.update(data.id, data)
        this.view(data.id)
      } else {
        this.$fire.analytics.logEvent('create_event')
        const result = await this.create(data)
        this.view(result.id)
      }
    },
    async removeItem(id) {
      this.$fire.analytics.logEvent('delete_event')
      await this.remove(id)
      this.view()
    },
  },
  setup() {
    const { can, profile, isAdmin, uid } = useAuth()
    const { params } = useRouter()
    const { eventTypeList } = useEvents()

    const collection = 'events'

    const { doc: item, load, update, remove, create, loading } = useDoc(
      collection
    )

    const updateEndDate = (e) => {
      if (!e.duration || e.duration === 'custom') {
        return
      }

      e.endDate = addMinutes(parseISO(e.startDate), e.duration)
    }

    const updatePlace = (e) => {
      if (e?.international === 'No') {
        return
      }

      e.place = ''
    }

    const types = computed(() => [
      {
        label: 'Event',
        value: 'event',
        fields: [
          {
            name: 'name',
            hideLabel: true,
            placeholder: 'Event Name',
          },
          {
            name: 'description',
            hideLabel: true,
            type: 'textarea',
            placeholder: 'Details (markdown)',
            tips:
              'Pitch yourself: Who are you? What do you offer? What do you want?\n\nTips for effective pitch:\n- Uncomplicated: It should be catchy and roll off the tongue\n- Concise: It shouldn’t take more than a minute to say or read\n- Unique: It reflects your skills, goals, and desires\n- Storyline: It covers who you are, what you offer, and where you want to be\n- Appealing: Your elevator pitch is essentially a persuasive sales pitch; the emphasis should be on what you offer',
            description:
              'Use [widgets](https://wedance.vip/markdown), including images and videos',
          },
          {
            name: 'venue',
            label: 'Where?',
            labelPosition: 'top',
            type: 'venue',
          },
          {
            name: 'startDate',
            type: 'datetime',
            label: 'When?',
            onChange: updateEndDate,
          },
          {
            name: 'duration',
            label: 'How long?',
            onChange: updateEndDate,
            type: 'select',
            options: [
              {
                value: 30,
                label: '30 min',
              },
              {
                value: 60,
                label: '1 hour',
              },
              {
                value: 90,
                label: '1.5 hour',
              },
              {
                value: 120,
                label: '2 hours',
              },
              {
                value: 180,
                label: '3 hours',
              },
              {
                value: 240,
                label: '4 hours',
              },
              {
                value: 300,
                label: '5 hours',
              },
              {
                value: 'custom',
                label: 'Custom',
              },
            ],
          },
          {
            name: 'endDate',
            type: 'datetime',
            when: (e) => e.duration === 'custom',
          },
          {
            name: 'price',
            type: 'price',
            placeholder: 'Examples: 10, 5, FREE',
            description: 'Examples: 10, 5, FREE',
            defaultPrice: {
              amount: 0,
              currency: 'EUR',
            },
            options: [
              { name: 'EUR' },
              { name: 'USD' },
              { name: 'GBP' },
              { name: 'JPY' },
            ],
          },
          {
            name: 'styles',
            label: 'Dance styles',
            type: 'stylesSelect',
          },
          {
            name: 'type',
            type: 'select',
            options: eventTypeList,
          },
          {
            name: 'cover',
            type: 'photo',
            width: 500,
            height: 500,
            circle: false,
            hideLabel: true,
          },
          {
            name: 'visibility',
            type: 'buttons',
            options: ['Public', 'Members', 'Unlisted'],
            description: `- Public - searchable in Google.\n- Members - visible only for logged-in users.\n- Unlisted - possible to open with exact link, but they are not listed nor not shown in the search.`,
          },
          {
            name: 'claimed',
            label: 'Are you organiser?',
            type: 'buttons',
            options: ['Yes', 'No'],
            description: 'Are you the event organiser?',
          },
          {
            name: 'organiser',
            label: 'Organiser',
            description: 'Username on WeDance',
          },
          {
            name: 'online',
            label: 'Online?',
            type: 'buttons',
            options: ['Yes', 'No'],
            onChange: updatePlace,
            description:
              'Streaming via Zoom, Google Meet, Instagram Live, etc.?',
          },
          {
            name: 'international',
            label: 'International?',
            type: 'buttons',
            options: ['Yes', 'No'],
            onChange: updatePlace,
            description:
              'Is it a big event with >500 guests, like festival or online?',
          },
          {
            name: 'place',
            label: 'Community',
            type: 'place',
            clearable: true,
            when: (answers) => answers.international === 'No',
            description:
              'Leave empty if you want your event to be shown in all cities',
          },
          {
            name: 'form',
            label: 'External registration?',
            before: 'Do you use external platform to register for your event?',
            type: 'buttons',
            options: ['Yes', 'No'],
          },
          {
            name: 'link',
            description:
              'Direct booking link on ticket platform (ti.to, Eventbrite, Google Form, etc.)',
          },
          {
            name: 'website',
            description: 'Link to your event or website',
          },
          {
            name: 'facebook',
            description: 'Link to original event (Facebook, Eventbrite, etc.)',
          },
          {
            name: 'promo',
            label: 'Do you want free promo?',
            type: 'buttons',
            options: ['Yes', 'No'],
            description:
              'Send us link to your event on [Instagram](https://instagram.com/wedancevip) and we will promote it on our social media channels: Telegram, Instagram, Facebook and Twitter.',
          },
          {
            name: 'confirmation',
            labelPosition: 'top',
            label: 'Confirmation email for guests',
            type: 'textarea',
            placeholder: 'Example: Dear guest, you are confirmed to our event.',
          },
        ],
      },
    ])

    if (params.id !== '-') {
      load(params.id)
    }

    return {
      loading,
      item,
      can,
      collection,
      update,
      remove,
      create,
      types,
      profile,
      isAdmin,
      uid,
    }
  },
}
</script>

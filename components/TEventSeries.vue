<template>
  <div>
    <div class="border-b p-4 gap-2">
      <div class="flex gap-1 text-xs uppercase">
        <div class="text-primary">
          {{ getEventTypeLabel(doc.eventType) }}
        </div>
        <div>·</div>
        <div>
          {{
            getStyles(doc.styles)
              .map((s) => s.name)
              .join(' · ')
          }}
        </div>
      </div>
      <h1 class="text-2xl font-bold leading-none">{{ doc.name }}</h1>
    </div>

    <a
      v-if="doc.venue"
      :href="doc.venue.url"
      target="_blank"
      class="block border-b py-2 px-4 hover:bg-gray-200"
    >
      <div class="flex items-center justify-start leading-tight">
        <TIcon name="place" class="mr-4 h-4 w-4" />
        <div>
          <h4 class="font-bold">
            {{ doc.venue.name
            }}<span v-if="doc.venue.room"> • {{ doc.venue.room }}</span>
          </h4>
          <div class="text-gray-700">
            {{ doc.venue.formatted_address }}
          </div>
        </div>
      </div>
    </a>

    <div class="grid grid-cols-1">
      <div class="md:border-l">
        <div
          v-if="can('edit', 'events', doc)"
          class="space-y-2 p-4 border-b bg-orange-100"
        >
          <h3 class="text-xs font-bold uppercase">Moderator Tools</h3>
          <div class="flex flex-wrap gap-2">
            <TButton
              type="secondary"
              icon="edit"
              :to="localePath(`/events/${doc.id}/edit`)"
              :label="$t('eventView.dropdown.edit')"
            />

            <TButton
              v-if="can('edit', 'events', doc)"
              type="secondary"
              icon="delete"
              label="Delete Series"
              @click="deleteEvent()"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="p-4">
      <h2 class="text-primary uppercase text-xs">Event Series</h2>
      <ul class="flex flex-col gap-2">
        <li v-for="event in children" :key="event.id" class="w-full">
          <router-link
            :to="`/events/${event.id}`"
            class="text-sm underline hover:no-underline"
          >
            {{ getDay(event.startDate, $i18n.locale) }}
            {{ getDate(event.startDate, $i18n.locale) }}
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { track } from '~/plugins/firebase'
import { useAuth } from '~/use/auth'
import { useDoc } from '~/use/doc'
import { useEvents } from '~/use/events'
import { useRouter } from '~/use/router'
import { useStyles } from '~/use/styles'
import { getDay, getDate } from '~/utils'

export default {
  props: {
    doc: {
      type: Object,
      required: true,
    },
    children: {
      type: Array,
      required: true,
    },
  },
  setup(props) {
    const { getEventTypeLabel } = useEvents()
    const { getStyles } = useStyles()
    const { can, username } = useAuth()
    const { remove } = useDoc('posts')
    const { router } = useRouter()

    async function deleteEvent() {
      if (!props.doc) {
        return
      }

      const upcoming = props.doc.children?.filter(
        (child) => child.startDate > Date.now()
      )

      const count = upcoming?.length || 0

      if (
        !confirm(
          `Are you sure you want to delete series with ${count} upcoming events?`
        )
      ) {
        return
      }

      if (count) {
        for (const child of upcoming) {
          try {
            await remove(child.id)
          } catch (e) {
            console.error(e)
          }
        }
      }

      track('delete_event')

      await remove(props.doc.id)
      router.push(`/${username.value}`)
    }

    return {
      getDay,
      getDate,
      getEventTypeLabel,
      getStyles,
      can,
      deleteEvent,
    }
  },
}
</script>

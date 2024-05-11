<template>
  <div>
    <div class="p-4">
      <div class="text-2xl font-bold">
        {{
          doc.type === 'import_error'
            ? 'Error Importing Event'
            : 'Importing Event'
        }}
      </div>

      <div class="text-sm text-gray-700 mt-2">
        <div v-if="doc.type === 'import_error'">
          <span class="text-red-500">{{ doc.error }}</span>
          <div>
            If you have verified the link and believe it should work, please
            <a class="underline text-primary" href="mailto:support@wedance.vip"
              >contact support</a
            >
            to resolve the issue.
          </div>
        </div>
        <div v-else-if="doc.type === 'import_event'">
          Please wait, your event is being imported.
        </div>
      </div>

      <div class="mt-4 flex gap-2">
        <TButton
          v-if="doc.type === 'import_error' && can('edit', 'events', doc)"
          label="Delete Event"
          icon="delete"
          type="primary"
          @click="confirmDeleteEvent"
        />
        <TButton
          v-if="doc.type === 'import_error' && isAdmin()"
          label="Retry"
          @click="retryImport"
        />
        <TButton
          v-if="doc.type === 'import_event' && isAdmin()"
          label="Stop"
          @click="stopImport"
        />
      </div>
    </div>

    <TEventCreator class="p-4 border-t" :doc="doc" />
  </div>
</template>

<script>
import { useAuth } from '~/use/auth'
import { useDoc } from '~/use/doc'
import { useRouter } from '~/use/router'
export default {
  props: {
    doc: {
      type: Object,
      required: true,
    },
  },
  methods: {
    retryImport() {
      this.softUpdate(this.doc.id, {
        type: 'import_event',
        errorCode: '',
        error: '',
      })
    },
    stopImport() {
      this.softUpdate(this.doc.id, {
        type: 'import_error',
        errorCode: 'stopped',
        error: 'Import stopped by admin',
      })
    },
    confirmDeleteEvent() {
      if (confirm('Are you sure you want to delete this event?')) {
        this.deleteEvent(this.doc.id)
      }
    },
  },
  setup(props) {
    const { can, username, isAdmin } = useAuth()
    const { remove, softUpdate } = useDoc('posts')
    const { router } = useRouter()

    async function deleteEvent(id) {
      await remove(id)
      router.push(`/${username.value}`)
    }

    return {
      deleteEvent,
      isAdmin,
      can,
      softUpdate,
    }
  },
}
</script>

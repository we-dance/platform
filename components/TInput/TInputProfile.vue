<template>
  <div>
    <WProfile
      v-if="value && value.username"
      :username="value.username"
      :fallback="value"
    >
      <template v-slot:right>
        <TDropdown v-slot="{ closeMenu }">
          <TButton
            allow-guests
            type="context"
            :label="$t('TInputProfile.remove')"
            color="red-500 text-sm"
            @click="
              $emit('input', {})
              closeMenu()
            "
          />
          <TButton
            v-for="role in eventRoleOptions"
            :key="role.value"
            allow-guests
            :type="value.role === role.value ? 'context-active' : 'context'"
            :label="role.label"
            class="text-sm"
            @click="
              value.role = role.value
              closeMenu()
            "
          />
        </TDropdown>
      </template>
      <div></div>
    </WProfile>
    <TInput
      v-else
      v-model="query"
      :placeholder="placeholder"
      autocomplete="off"
      @input="search"
    />
    <div
      v-if="query"
      class="divide-y border rounded shadow absolute bg-white z-50"
    >
      <div
        v-for="item in suggestions"
        :key="item.id"
        class="flex px-4 py-2 hover:bg-blue-100 items-center cursor-pointer space-x-2"
        @click="add(item)"
      >
        <TProfilePhoto2 size="md" :src="item.photo" />
        <div class="flex-grow">
          <div v-if="item.name" class="font-bold text-sm">
            {{ item.name }}
          </div>
          <div class="text-xs text-gray-700 flex space-x-2">
            <div>@{{ item.username }}</div>
            <div v-if="item.instagram" class="space-x-1 flex">
              <TIcon name="instagram" size="4" />
              <div>{{ item.instagram }}</div>
            </div>
            <div v-if="item.facebook" class="space-x-1 flex">
              <TIcon name="facebook" size="4" />
              <div>{{ item.facebook }}</div>
            </div>
          </div>
        </div>
      </div>
      <template v-if="inviteUsername">
        <div
          class="flex justify-center px-4 py-2 hover:bg-blue-100 items-center cursor-pointer space-x-1 text-sm text-gray-700"
        >
          <h3 @click="showPopup = !showPopup" class="text-center">
            + Add New Organizer
          </h3>
        </div>
        <TPopup v-if="showPopup">
          <div class="flex justify-between border-b pb-2 mb-4">
            <div class="grow font-bold text-center ">
              Add New Organizer
            </div>
            <button class=" cursor-pointer" @click="showPopup = false">
              <TIcon name="close" class="cursor-pointer w-4 h-4" />
            </button>
          </div>
          <div class="my-4 flex flex-col justify-center">
            <div>Social Media or Website</div>
            <input
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              placeholder="https://"
              v-model.trim="socialMediaOrWebsite"
            />
            <p>
              You can use link to their Instagram or Facebook or anything else
            </p>
            <div class="flex justify-end gap-x-2 ">
              <TButton @click="showPopup = false" label="Cancel" />
              <TButton
                @click="
                  create({
                    username: inviteUsername,
                    socialMediaOrWebsite,
                  })
                "
                label="Save"
                type="primary"
              />
            </div>
          </div>
        </TPopup>
      </template>
    </div>
  </div>
</template>
<script>
import { computed, ref, watch } from '@nuxtjs/composition-api'
import { useAlgolia } from '~/use/algolia'
import { useEvents } from '~/use/events'
import { useDoc } from '~/use/doc'
import { useAuth } from '~/use/auth'
import TPopup from '../TPopup.vue'

export default {
  name: 'TInputProfile',
  inheritAttrs: false,

  components: {
    TPopup,
  },

  props: {
    value: {
      type: [Object, String],
      default: '',
    },
    placeholder: {
      type: String,
      default() {
        return this.$t('TInputProfile.placeholder')
      },
    },
    excludeUsernames: {
      type: Array,
      default: () => [],
    },
  },
  setup(props, { emit }) {
    const { profile } = useAuth()
    const { search, response } = useAlgolia('profiles')
    const query = ref('')
    const selected = ref(props.value)
    const { eventRoleOptions } = useEvents()
    const { create: createProfile } = useDoc('profiles')

    const showPopup = ref(false)
    const socialMediaOrWebsite = ref('')

    if (typeof props.value === 'string') {
      emit('input', { username: props.value })
    }

    const add = (data) => {
      query.value = ''

      emit('input', data)
    }

    watch(query, (value) => {
      if (!value) {
        return
      }

      if (
        value.includes('facebook.com') ||
        value.includes('instagram.com') ||
        value.includes('wedance.vip')
      ) {
        const username = value
          .replace('https://', '')
          .replace('http://', '')
          .replace('www.', '')
          .replace('instagram.com/', '')
          .replace('facebook.com/', '')
          .replace('wedance.vip/', '')
          .replace(/(\?.*)/g, '')
          .replace('/', '')

        query.value = username
      }
    })

    const suggestions = computed(() => {
      const { hits } = response.value
      return hits
        ?.filter(
          (p) =>
            !props.excludeUsernames.some((username) => username === p.username)
        )
        .map((p) => {
          return {
            id: p.id,
            username: p.username,
            name: p.name || p.username || '',
            photo: p.photo || '',
            bio: p.bio || '',
            instagram: p.instagram || '',
            facebook: p.facebook || '',
            tiktok: p.tiktok || '',
            youtube: p.youtube || '',
          }
        })
    })

    const inviteUsername = computed(() => {
      let username = query.value.toLowerCase().replaceAll(' ', '')

      if (
        suggestions.value?.some((p) => p.username === username) ||
        suggestions.value?.some((p) => p.instagram === username) ||
        suggestions.value?.some((p) => p.facebook === username)
      ) {
        username = false
      }

      if (props.excludeUsernames.some((v) => v === username)) {
        username = false
      }

      return username
    })

    const create = async (data) => {
      await createProfile({
        type: 'FanPage',
        owned: false,
        owner: '',
        import: 'requested',
        visibility: 'Public',
        place: profile.value?.place,
        ...data,
      })

      add(data)
    }

    return {
      query,
      selected,
      suggestions,
      add,
      search,
      eventRoleOptions,
      create,
      inviteUsername,
      showPopup,
      socialMediaOrWebsite,
    }
  },
}
</script>

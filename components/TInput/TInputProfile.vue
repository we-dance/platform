<template>
  <div class="relative">
    <WProfile
      v-if="value && value.username"
      :username="value.username"
      :fallback="value"
      hide-role
      hide-buttons
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
    <TField
      v-else
      v-model="query"
      :placeholder="placeholder"
      autocomplete="off"
      description="Or paste link to Instagram or Facebook profile"
      label-position="top"
      @input="search"
    />
    <div
      v-show="query"
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
          <div v-if="item.name" class="font-bold text-sm">{{ item.name }}</div>
          <div class="text-xs text-gray-700 flex flex-col gap-2">
            <div>{{ item.username }}</div>
            <div v-if="item.instagram" class="space-x-1 flex">
              <TIcon name="instagram" size="4" />
              <div>
                {{
                  item.instagram
                    .replace(/\?igshid=[^&]*$/, '')
                    .replace(/\/$/, '')
                }}
              </div>
            </div>
            <div v-if="item.facebook" class="space-x-1 flex">
              <TIcon name="facebook" size="4" />
              <div>
                {{ item.facebook.replace(/\/$/, '') }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="igUsername"
        class="flex px-4 py-2 hover:bg-blue-100 items-center cursor-pointer space-x-1 text-sm text-gray-700"
        @click="
          create({
            username: igUsername,
            instagram: 'https://instagram.com/' + igUsername,
          })
        "
      >
        <div>
          {{ $t('TInputProfile.import') }}
        </div>
        <TIcon name="instagram" size="4" />
        <div>
          {{ igUsername }}
        </div>
      </div>
      <div
        v-if="fbUsername"
        class="flex px-4 py-2 hover:bg-blue-100 items-center cursor-pointer space-x-1 text-sm text-gray-700"
        @click="
          create({
            username: fbUsername,
            facebook: 'https://facebook.com/' + fbUsername,
          })
        "
      >
        <div>
          {{ $t('TInputProfile.import') }}
        </div>
        <TIcon name="facebook" size="4" />
        <div>
          {{ fbUsername }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { computed, ref, useContext } from '@nuxtjs/composition-api'
import { useAlgolia } from '~/use/algolia'
import { useEvents } from '~/use/events'
import { useDoc } from '~/use/doc'
import { useAuth } from '~/use/auth'

export default {
  name: 'TInputProfile',
  inheritAttrs: false,
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
    const { $track } = useContext()
    const { profile } = useAuth()
    const { search, response } = useAlgolia('profiles')
    const query = ref('')
    const selected = ref(props.value)
    const { eventRoleOptions } = useEvents()
    const { create: createProfile } = useDoc('profiles')

    if (typeof props.value === 'string' && props.value) {
      emit('input', { username: props.value })
    }

    const add = (data) => {
      query.value = ''

      emit('input', data)
    }

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

    const igUsername = computed(() => {
      if (!query.value.includes('instagram.com')) {
        return false
      }

      const username = query.value
        .replace('https://', '')
        .replace('http://', '')
        .replace('www.', '')
        .replace('instagram.com/', '')
        .replace(/(\?.*)/g, '')
        .replace('/', '')

      if (
        suggestions.value?.some((p) =>
          p.instagram?.endsWith('instagram.com/' + username)
        )
      ) {
        return false
      }

      if (props.excludeUsernames.some((v) => v === username)) {
        return false
      }

      return username
    })

    const fbUsername = computed(() => {
      if (!query.value.includes('facebook.com')) {
        return false
      }

      const username = query.value
        .replace('https://', '')
        .replace('http://', '')
        .replace('www.', '')
        .replace('facebook.com/', '')
        .replace(/(\?.*)/g, '')
        .replace('/', '')

      if (
        suggestions.value?.some((p) =>
          p.facebook?.endsWith('facebook.com/' + username)
        )
      ) {
        return false
      }

      if (props.excludeUsernames.some((v) => v === username)) {
        return false
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

      $track('profile_imported', {
        source: data.instagram ? 'instagram' : 'facebook',
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
      igUsername,
      fbUsername,
    }
  },
}
</script>

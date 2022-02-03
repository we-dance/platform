<template>
  <div>
    <WProfile
      v-if="value && value.username"
      :username="value.username"
      :fallback="value"
    >
      <template v-slot:right>
        <TDropdown v-slot="{ closeMenu }">
          <TDropdownSeparator :label="$t('TInputProfile.changeRole')" />
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
          <TDropdownSeparator :label="$t('TInputProfile.actions')" />
          <TButton
            allow-guests
            type="context"
            :label="$t('TInputProfile.remove')"
            color="red-500 text-sm"
            @click="
              $emit('input', null)
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
      @input="search"
      autocomplete="off"
    />
    <div v-if="query" class="divide-y border rounded shadow absolute bg-white">
      <div
        v-for="item in suggestions"
        :key="item.id"
        class="flex px-4 py-2 hover:bg-blue-100 items-center cursor-pointer space-x-1"
        @click="add(item)"
      >
        <TProfilePhoto2 size="sm" :src="item.photo" />
        <div class="flex-grow">
          <div class="block text-sm">{{ item.username }}</div>
        </div>
      </div>
      <template v-if="isUsernameAvailable">
        <div
          class="flex px-4 py-2 hover:bg-blue-100 items-center cursor-pointer space-x-1"
          @click="importInstagram(query)"
        >
          <div class="p-1">
            <TIcon name="instagram" size="4" class="text-gray-700 " />
          </div>
          <div class="text-sm">
            {{ $t('TInputProfile.addInstagram', { username: query }) }}
          </div>
        </div>
        <!-- <div
          class="flex px-4 py-2 hover:bg-blue-100 items-center cursor-pointer space-x-1"
          @click="create({ username: query, facebook: query })"
        >
          <div class="p-1">
            <TIcon name="facebook" size="4" class="text-gray-700 " />
          </div>
          <div class="text-sm">
            {{ query }} {{ $t('TInputProfile.addFacebook') }}
          </div>
        </div> -->
      </template>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import { computed, ref } from '@nuxtjs/composition-api'
import { useAlgolia } from '~/use/algolia'
import { useEvents } from '~/use/events'
import { useDoc } from '~/use/doc'

export default {
  name: 'TInputProfile',
  inheritAttrs: false,
  props: {
    value: {
      type: [Object, String],
      default: () => ({}),
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
    const { search, response } = useAlgolia('profiles')
    const query = ref('')
    const selected = ref(props.value)
    const { eventRoleOptions } = useEvents()
    const { create: createProfile } = useDoc('profiles')

    if (typeof props.value === 'string') {
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

    const isUsernameAvailable = computed(() => {
      let result = true

      if (
        suggestions.value &&
        suggestions.value.some((p) => p.username === query.value)
      ) {
        result = false
      }

      if (props.excludeUsernames.some((username) => username === query.value)) {
        result = false
      }

      return result
    })

    const create = async (data) => {
      await createProfile({
        type: 'FanPage',
        ...data,
      })

      add(data)
    }

    const importInstagram = async (username) => {
      try {
        const result = await axios.post(
          `https://us-central1-wedance-4abe3.cloudfunctions.net/hooks/import/instagram`,
          {
            username,
          }
        )

        if (!result.data.success) {
          console.log(result.data.error)
          return
        }

        add(result.data.profile)
      } catch (error) {
        console.log(error.message)
      }
    }

    return {
      query,
      selected,
      suggestions,
      add,
      search,
      eventRoleOptions,
      create,
      isUsernameAvailable,
      importInstagram,
    }
  },
}
</script>
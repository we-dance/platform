<template>
  <div>
    <TProfileList :items="value">
      <template v-slot="{ index }">
        <div class="flex gap-1">
          <TButton
            allow-guests
            icon="edit"
            type="nav"
            @click="editing = index"
          />
          <TButton
            allow-guests
            icon="delete"
            type="nav"
            @click="remove(index)"
          />
        </div>
      </template>
    </TProfileList>

    <TPopup
      v-if="editing !== null"
      title="Edit profile"
      @close="editing = null"
    >
      <div class="max-w-md mx-auto py-8 max-h-screen overflow-y-scroll">
        <TForm
          v-model="value[editing]"
          :fields="fields"
          class="space-y-4"
          @save="save"
        />
      </div>
    </TPopup>

    <TInput
      v-model="query"
      :placeholder="placeholder"
      @input="search"
      autocomplete="off"
    />
    <div v-if="query" class="divide-y border rounded shadow absolute bg-white">
      <div
        class="flex px-4 py-2 hover:bg-blue-100 items-center cursor-pointer space-x-1"
        @click="add({ name: query })"
      >
        <div class="p-1">
          <TIcon name="plus" size="4" class="text-gray-700 " />
        </div>
        <div class="text-sm">{{ query }}</div>
      </div>
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
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import { computed, ref } from '@nuxtjs/composition-api'
import { useAlgolia } from '~/use/algolia'
import { profileFields } from '~/use/profiles'

export default {
  name: 'TProfileSelect',
  inheritAttrs: false,
  props: {
    value: {
      type: Array,
      default: () => [],
    },
    placeholder: {
      type: String,
      default: 'Add a profile',
    },
  },
  setup(props, { emit }) {
    const { search, response } = useAlgolia('profiles')
    const query = ref('')
    const selected = ref(props.value)
    const editing = ref(null)

    const fields = profileFields
      .filter((f) => f.inputProfiles)
      .map((p) => ({
        ...p,
        when: () => true,
      }))

    fields.push({
      name: 'role',
      label: 'Role',
    })

    const add = (p) => {
      p.role = 'Instructor'

      selected.value.push(p)
      query.value = ''

      emit('input', selected.value)
    }

    const suggestions = computed(() => {
      const { hits } = response.value
      return hits
        ?.filter((p) => !selected.value.some((sp) => sp.uid === p.id))
        .map((p) => {
          return {
            uid: p.id,
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

    const save = (data) => {
      Vue.set(selected.value, editing.value, data)

      editing.value = null

      emit('input', selected.value)
    }

    const remove = (index) => {
      selected.value.splice(index, 1)

      emit('input', selected.value)
    }

    return {
      query,
      selected,
      suggestions,
      editing,
      add,
      remove,
      search,
      fields,
      save,
    }
  },
}
</script>

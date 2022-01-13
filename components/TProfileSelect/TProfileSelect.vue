<template>
  <div>
    <TProfileList
      :list="selectedList"
      :show-tools="true"
      @edit="edit"
      @remove="remove"
    />
    <TPopup v-if="isModalOpen">
      <TBioEditModal
        v-bind="profileToEdit"
        @close="isModalOpen = false"
        @saveedit="saveEdit(profileToEdit)"
      />
    </TPopup>
    <TInput
      ref="searchEl"
      v-model="query"
      auto-focus
      class="bg-gray-50 border border-gray-300 focus:outline-none focus:shadow-outline px-3 py-2 rounded text-sm w-full"
      @input="search"
    />
    <TProfileList
      v-if="isDrodownOpen"
      ref="dropdownEl"
      :show-tools="false"
      :list="withSelectedResponse"
      @select="select"
    />
  </div>
</template>
<script>
import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
} from '@nuxtjs/composition-api'
import { useAlgolia } from '~/use/algolia'

export default {
  name: 'TProfileSelect',
  setup(props, { emit }) {
    const { search, response } = useAlgolia('profiles')
    const query = ref('')
    const searchEl = ref(null)
    const dropdownEl = ref(null)
    const isDrodownOpen = ref(false)
    const isModalOpen = ref(false)
    const selectedList = ref([])
    const profileToEdit = ref({})

    const select = (p) => {
      const isAlreadySelected = selectedList.value.some((sp) => sp.id === p.id)
      if (!isAlreadySelected) {
        selectedList.value.push(p)
        isDrodownOpen.value = false
        query.value = ''
      }
    }

    const withSelectedResponse = computed(() => {
      const { hits } = response.value
      const selectionArr = hits?.map((p) => {
        const isAlreadySelected = selectedList.value.some(
          (sp) => sp.id === p.id
        )
        if (isAlreadySelected) {
          return { selected: true, role: 'Dancer', ...p }
        }
        return { selected: false, role: 'Dancer', ...p }
      })
      return selectionArr
    })

    const checkFocus = (e) => {
      if (
        searchEl.value.$el.contains(e.target) ||
        dropdownEl.value.$el.contains(e.target)
      ) {
        isDrodownOpen.value = true
      } else {
        isDrodownOpen.value = false
      }
    }

    onMounted(() => {
      document.addEventListener('click', checkFocus)
    })
    onBeforeUnmount(() => {
      document.removeEventListener('click', checkFocus)
    })

    const edit = (p) => {
      profileToEdit.value = p
      isModalOpen.value = true

      console.log('p', p)
    }

    const saveEdit = (p) => {
      emit('input', profileToEdit)
      isModalOpen.value = false

      console.log('save edit')
    }

    const remove = (pId) => {
      selectedList.value = selectedList.value.filter((a) => a.id !== pId)
    }

    return {
      query,
      isDrodownOpen,
      isModalOpen,
      selectedList,
      withSelectedResponse,
      profileToEdit,
      searchEl,
      dropdownEl,
      select,
      edit,
      remove,
      search,
      saveEdit,
    }
  },
}
</script>

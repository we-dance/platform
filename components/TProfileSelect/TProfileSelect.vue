<template>
  <div>
    <TProfileList
      :list="selectedList"
      :show-tools="true"
      @edit="openModelToEdit"
      @remove="remove"
    />
    <TPopup v-if="isModalOpen">
      <TBioEditModal
        v-bind="profileToEdit"
        @close="isModalOpen = false"
        @saveedit="saveEdit"
      />
    </TPopup>
    <TInput
      ref="searchEl"
      v-model="query"
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
  watch,
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
        searchEl.value?.$el.contains(e.target) ||
        dropdownEl.value?.$el.contains(e.target)
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
    watch(selectedList, () => {
      const team = selectedList.value.map((p) => ({
        username: p.username || '',
        name: p.name || '',
        photo: p.photo || '',
        bio: p.bio || '',
        role: p.role || '',
        description: p.description || '',
      }))
      emit('input', team)
    })

    const openModelToEdit = (p) => {
      profileToEdit.value = p
      isModalOpen.value = true
    }

    const saveEdit = (editedData) => {
      selectedList.value = selectedList.value.map((p) => {
        return p.id === editedData.id ? { ...p, ...editedData } : { ...p }
      })
      isModalOpen.value = false
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
      openModelToEdit,
      remove,
      search,
      saveEdit,
    }
  },
}
</script>

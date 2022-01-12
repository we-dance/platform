<template>
  <div class="border-2">
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
        @saveedit="saveEdit"
      />
    </TPopup>
    <div class="relative text-sm leading-tight ">
      <div class="inline-block relative w-full">
        <TSelectButton :toggle-dropdown="toggleDropdown" label="Add artist" />
        <div
          v-if="isListOpen"
          class="absolute w-full z-50 bg-white border-gray-300 border-2"
        >
          <TInput v-model="query" auto-focus class="my-2" @input="search" />
          <TProfileList
            :show-tools="false"
            :list="withSelectedResponse"
            @select="select"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { computed, ref } from '@nuxtjs/composition-api'
import { useAlgolia } from '~/use/algolia'

export default {
  name: 'TProfileSelect',
  setup() {
    const query = ref('')
    const { search, response } = useAlgolia('profiles')
    const isListOpen = ref(false)
    const isModalOpen = ref(false)
    const selectedList = ref([])
    const profileToEdit = ref({})

    const select = (p) => {
      const isAlreadySelected = selectedList.value.some((sp) => sp.id === p.id)
      if (!isAlreadySelected) {
        selectedList.value.push(p)
        isListOpen.value = false
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

    const edit = (p) => {
      profileToEdit.value = p
      isModalOpen.value = true

      console.log('p', p)
    }

    const saveEdit = () => {
      console.log('save edit')
    }

    const remove = (pId) => {
      selectedList.value = selectedList.value.filter((a) => a.id !== pId)
    }

    const toggleDropdown = () => {
      isListOpen.value = !isListOpen.value
    }
    const closeModal = () => {
      isModalOpen.value = false
    }
    return {
      query,
      isListOpen,
      isModalOpen,
      selectedList,
      withSelectedResponse,
      profileToEdit,
      select,
      toggleDropdown,
      edit,
      remove,
      search,
      closeModal,
      saveEdit,
    }
  },
}
</script>

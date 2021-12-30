<template>
  <div class="border-2">
    <TProfileList
      :list="selectedList"
      :show-tools="true"
      @edit="edit"
      @remove="remove"
    />
    <div class="relative text-sm leading-tight ">
      <div class="inline-block relative w-full">
        <TSelectButton :toggle-dropdown="toggleDropdown" label="Add artist" />
        <div
          v-if="toggle"
          class="absolute w-full z-50 bg-white border-gray-300 border-2 px-2"
        >
          <TInput v-model="query" auto-focus class="my-2" @input="search" />
          <TProfileList
            :show-tools="false"
            :list="response.hits"
            @select="select"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { ref } from '@nuxtjs/composition-api'
import { useAlgolia } from '~/use/algolia'

export default {
  name: 'TProfileSelect',
  setup() {
    const query = ref('')
    const { search, response } = useAlgolia('profiles')
    const toggle = ref(false)
    const selectedList = ref([])

    const select = (p) => {
      selectedList.value.push(p)
      toggle.value = false
    }
    //  TODO: already selected item will be disabled.
    // eslint-disable-next-line no-unused-vars
    const withSelectionArr = (() => {
      const { hits } = response.value
      const selectionArr = hits?.map((p, ind) => {
        if (selectedList.value[ind]?.id === p.id) {
          return { selected: true, ...p }
        }
        return { selected: false, ...p }
      })
      return selectionArr
    })()

    const edit = (p) => {
      console.log('edit', p)
    }

    const remove = (pId) => {
      selectedList.value = selectedList.value.filter((a) => a.id !== pId)
    }

    const toggleDropdown = () => {
      toggle.value = !toggle.value
    }

    return {
      query,
      toggle,
      selectedList,
      response,
      select,
      toggleDropdown,
      edit,
      remove,
      search,
    }
  },
}
</script>

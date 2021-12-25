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
          class="absolute w-full z-50 bg-white border-gray-300 border-2"
        >
          <input
            ref="search"
            v-model="input"
            class="block text-sm w-full px-3 py-2 transition duration-100 ease-in-out ocus:outline-none focus:shadow-outline rounded shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed',"
          />
          <TProfileList
            :show-tools="false"
            :list="filteredList"
            @select="select"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { ref, watch, onMounted } from '@nuxtjs/composition-api'

export default {
  name: 'TProfileSelect',
  setup() {
    const input = ref('')
    const toggle = ref(false)
    const profileList = ref([
      {
        username: 'jessica',
        id: 212,
        name: 'Jessica',
        photo: 'http://placekitten.com/g/200/300',
        bio: 'Good human',
        role: 'Dancer',
        description: 'asas',
      },
      {
        id: 21265,
        username: 'rodrigo',
        name: 'Rodrigo',
        photo: 'http://placekitten.com/g/200/300',
        bio: 'Good human',
        role: 'Teacher',
        description: '',
      },
      {
        id: 2142,
        username: 'alejito',
        name: 'Alejito',
        photo: 'http://placekitten.com/g/200/300',
        bio: 'Good human',
        role: 'Meacher',
        description: 'asas',
      },
      {
        id: 231265,
        username: 'machiato',
        name: 'Machiato',
        photo: 'http://placekitten.com/g/200/300',
        bio: 'Good human',
        role: 'Fancer',
        description: '',
      },
    ])
    const selectedList = ref([])
    const filteredList = ref([])

    const select = (p) => {
      selectedList.value.push(p)
      toggle.value = false
    }

    const edit = (p) => {
      console.log('edit', p)
    }

    const remove = (pId) => {
      selectedList.value = selectedList.value.filter((a) => a.id !== pId)
    }

    const toggleDropdown = () => {
      toggle.value = !toggle.value
    }

    onMounted(() => {
      filteredList.value = profileList.value
    })

    watch(input, (newValue) => {
      const fList = profileList.value.filter((a) =>
        a.name.toLowerCase().includes(newValue)
      )
      filteredList.value = newValue.length > 0 ? fList : profileList.value
    })

    return {
      profileList,
      filteredList,
      input,
      toggle,
      selectedList,
      select,
      toggleDropdown,
      edit,
      remove,
    }
  },

  updated() {
    if (this.$refs.search) {
      this.$refs.search.focus()
    }
  },
}
</script>

<template>
  <div
    class="divide-x justify-center inline-flex items-center rounded border border-gray-300 overflow-hidden"
  >
    <button
      class="flex flex-shrink-0 px-2 py-1 shadow-sm text-xs font-medium text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      :class="clicked ? 'font-bold' : ''"
      :title="label"
      :data-names="names"
      @click="toggle"
    >
      <component :is="icon" class="w-4 h-4" />
      <div class="ml-1">{{ clicked ? toggledLabel : label }}</div>
      <div class="ml-1 text-xs rounded-full bg-gray-200 px-1 block">
        {{ count }}
      </div>
    </button>

    <button
      class="px-2 py-1 shadow-sm text-xs font-medium text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      <ChevronDownIcon class="w-4 h-4" />
    </button>
  </div>
</template>
<script>
import firebase from 'firebase/app'
import 'firebase/firestore'
import { useAuth } from '~/use/auth'
import { useDoc } from '~/use/doc'
import {
  EyeIcon,
  StarIcon,
  ArchiveIcon,
  EyeOffIcon,
  ChevronDownIcon,
} from '@vue-hero-icons/outline'
import { computed } from 'vue-demi'

export default {
  components: {
    ChevronDownIcon,
    EyeIcon,
    StarIcon,
    ArchiveIcon,
    EyeOffIcon,
  },
  props: {
    label: {
      type: String,
      default: '',
    },
    toggledLabel: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: '',
    },
    item: {
      type: Object,
      required: true,
    },
    field: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const { username } = useAuth()
    const { softUpdate } = useDoc('posts')

    const count = computed(() => {
      return props.item[props.field]?.list
        ? Object.keys(props.item[props.field].list).length
        : 0
    })

    const names = computed(() => {
      return props.item[props.field]
        ? Object.keys(props.item[props.field].list).join(', ')
        : 'None'
    })

    const clicked = computed(() => {
      return !!props.item[props.field]?.list[username.value]
    })

    const toggle = () => {
      if (!username.value) {
        return
      }

      let change

      if (!clicked.value) {
        change = {
          [`${props.field}.count`]: count.value + 1,
          [`${props.field}.list.${username.value}`]: true,
        }
      } else {
        change = {
          [`${props.field}.count`]: count.value - 1,
          [`${props.field}.list.${username.value}`]: firebase.firestore.FieldValue.delete(),
        }
      }

      softUpdate(props.item.id, change)
    }

    return { toggle, clicked, count, names }
  },
}
</script>

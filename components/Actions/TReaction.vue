<template>
  <TButton
    :type="type"
    :class="clicked ? toggledClass : ''"
    :title="label"
    :data-names="names"
    @click="toggle"
  >
    <component :is="clicked ? toggledIcon || icon : icon" class="w-4 h-4" />
    <div class="ml-1">{{ clicked ? toggledLabel || label : label }}</div>
    <div
      v-if="!hideCount"
      class="ml-1 text-xs rounded-full bg-gray-200 px-1 block"
    >
      {{ count }}
    </div>
  </TButton>
</template>
<script>
import firebase from 'firebase/app'
import 'firebase/firestore'
import {
  BellIcon,
  EyeIcon,
  StarIcon,
  BookmarkIcon,
  ArchiveIcon,
  EyeOffIcon,
  PlusIcon,
  CheckIcon,
} from '@vue-hero-icons/outline'
import { computed } from 'vue-demi'
import { useAuth } from '~/use/auth'
import { useDoc } from '~/use/doc'

export default {
  components: {
    EyeIcon,
    StarIcon,
    ArchiveIcon,
    EyeOffIcon,
    BookmarkIcon,
    BellIcon,
    PlusIcon,
    CheckIcon,
  },
  props: {
    label: {
      type: String,
      default: '',
    },
    toggledClass: {
      type: String,
      default: 'bg-gray-200',
    },
    toggledLabel: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: '',
    },
    toggledIcon: {
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
    type: {
      type: String,
      default: 'simple',
    },
    collection: {
      type: String,
      default: 'posts',
    },
    hideCount: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const { username } = useAuth()
    const { softUpdate } = useDoc(props.collection)

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
      return !!username.value && !!props.item[props.field]?.list[username.value]
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

<template>
  <TButton
    :type="type"
    :class="clicked ? toggledClass : ''"
    :title="label"
    :target-action="{ field, id: item.id, collection }"
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
import ls from 'local-storage'
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
import { useContext } from '@nuxtjs/composition-api'
import { useAuth } from '~/use/auth'
import { useDoc } from '~/use/doc'
import { addressPart } from '~/use/google'

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
    username: {
      type: String,
      default: '',
    },
  },
  mounted() {
    if (!this.currentUsername) {
      return
    }

    const action = ls('action')

    if (!action?.id) {
      return
    }

    if (action.id !== this.item.id) {
      return
    }

    if (action.collection !== this.collection) {
      return
    }

    if (action.field !== this.field) {
      return
    }

    ls.remove('action')

    if (!this.clicked) {
      this.toggle()
    }
  },
  setup(props) {
    const { $track } = useContext()
    const { username: currentUsername, uid } = useAuth()

    const username = computed(() => {
      return props.username || currentUsername.value
    })

    const { softUpdate } = useDoc(props.collection)

    const count = computed(() => {
      return props.item[props.field]?.usernames
        ? props.item[props.field]?.usernames.length
        : 0
    })

    const names = computed(() => {
      return props.item[props.field]?.usernames
        ? props.item[props.field].usernames.join(', ')
        : 'None'
    })

    const clicked = computed(() => {
      return (
        !!username.value &&
        !!props.item[props.field]?.usernames &&
        !!props.item[props.field]?.usernames.includes(username.value)
      )
    })

    const toggle = () => {
      if (!username.value) {
        return
      }

      let change

      if (!clicked.value) {
        change = {
          [`${props.field}.count`]: count.value + 1,
          [`${props.field}.usernames`]: firebase.firestore.FieldValue.arrayUnion(
            username.value
          ),
          [`${props.field}.history`]: firebase.firestore.FieldValue.arrayUnion({
            username: username.value,
            date: +new Date(),
            invitedBy: ls('invitedBy') || '',
            uid: uid.value || '',
            action: 'joined',
          }),
        }
      } else {
        change = {
          [`${props.field}.count`]: count.value - 1,
          [`${props.field}.usernames`]: firebase.firestore.FieldValue.arrayRemove(
            username.value
          ),
          [`${props.field}.history`]: firebase.firestore.FieldValue.arrayUnion({
            username: username.value,
            date: +new Date(),
            invitedBy: ls('invitedBy') || '',
            uid: uid.value || '',
            action: 'left',
          }),
        }
      }

      if (props.field === 'watch') {
        const action = !clicked.value ? 'subscribe' : 'unsubscribe'

        $track(action, {
          type: props.item.type,
          username: props.item.username,
        })
      }

      if (props.field === 'star') {
        const action = !clicked.value ? 'attend' : 'unattend'

        $track(action, {
          eventType: props.item.eventType,
          organizer: props.item.org?.username || '',
          startDate: props.item.startDate,
          id: props.item.id,
          name: props.item.name,
          price: props.item.price,
          locality: addressPart(props.item.venue, 'locality'),
          country: addressPart(props.item.venue, 'country'),
        })
      }

      softUpdate(props.item.id, change)
    }

    return { toggle, clicked, count, names, currentUsername }
  },
}
</script>

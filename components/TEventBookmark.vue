<template>
  <TButton
    :type="type"
    :label="isBookmarked ? toggledLabel : label"
    :title="label"
    v-bind="$attrs"
    @click="toggleBookmark"
  >
    <BookmarkIcon
      :class="
        `w-${size} h-${size} text-gray-900` +
          (isBookmarked ? ` ${toggledIconClass}` : ``)
      "
    />
  </TButton>
</template>

<script>
import { computed, useContext } from '@nuxtjs/composition-api'
import { BookmarkIcon } from '@vue-hero-icons/outline'
import { useAuth } from '~/use/auth'
import { db, firebase } from '~/plugins/firebase'
import { addressPart } from '~/use/google'

export default {
  name: 'TEventBookmark',
  components: {
    BookmarkIcon,
  },
  inheritAttrs: false,
  props: {
    eventId: {
      type: String,
      default: '',
    },
    event: {
      type: Object,
      default: () => ({}),
    },
    label: {
      type: String,
      default: '',
    },
    toggledLabel: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'none',
    },
    size: {
      type: String,
      default: '6',
    },
    toggledIconClass: {
      type: String,
      default: 'fill-gray-900',
    },
  },
  setup(props) {
    const { $track } = useContext()
    const { profile, updateProfile } = useAuth()

    const isBookmarked = computed(() => {
      if (!profile.value?.bookmarks) {
        return false
      }

      return profile.value.bookmarks.includes(props.eventId)
    })

    async function toggleBookmark() {
      const action = !isBookmarked.value ? 'bookmark' : 'unbookmark'
      let data = {
        id: props.eventId,
      }

      if (props.event) {
        data = {
          ...data,
          eventType: props.event.eventType || props.event.type,
          organizer: props.event.org?.username || props.event.organizer,
          startDate: props.event.startDate,
          name: props.event.name,
          price: props.event.price,
          locality:
            props.event.locality || addressPart(props.event.venue, 'locality'),
          country:
            props.event.country || addressPart(props.event.venue, 'country'),
        }
      }

      $track(action, data)

      if (isBookmarked.value) {
        await updateProfile({
          bookmarks: profile.value.bookmarks.filter(
            (bookmark) => bookmark !== props.eventId
          ),
        })

        await db
          .collection('posts')
          .doc(props.eventId)
          .update({
            bookmarks: firebase.firestore.FieldValue.increment(-1),
          })
      } else {
        if (!profile.value?.bookmarks) {
          profile.value.bookmarks = []
        }

        await updateProfile({
          bookmarks: [...profile.value.bookmarks, props.eventId],
        })

        await db
          .collection('posts')
          .doc(props.eventId)
          .update({
            bookmarks: firebase.firestore.FieldValue.increment(1),
          })
      }
    }

    return {
      isBookmarked,
      toggleBookmark,
    }
  },
}
</script>

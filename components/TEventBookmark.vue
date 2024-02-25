<template>
  <TButton
    :type="type"
    :label="isBookmarked ? toggledLabel : label"
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
import { computed } from '@nuxtjs/composition-api'
import { BookmarkIcon } from '@vue-hero-icons/outline'
import { useAuth } from '~/use/auth'
import { db, firebase } from '~/plugins/firebase'

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
    const { profile, updateProfile } = useAuth()

    const isBookmarked = computed(() => {
      if (!profile.value?.bookmarks) {
        return false
      }

      return profile.value.bookmarks.includes(props.eventId)
    })

    async function toggleBookmark() {
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

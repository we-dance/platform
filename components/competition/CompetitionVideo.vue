<template>
  <div class="border rounded shadow">
    <WYoutube :url="application.video" />

    <div class="flex pl-2 gap-2 items-center">
      <div class="text-xs py-1">
        <span v-if="isAdmin()">{{ totalVotes }} •</span>
        {{ getDateTime(application.videoUploadedAt) }} •
        {{ application.style }} ({{ application.category }})
      </div>
      <div class="flex-grow"></div>
      <TDropdown v-if="isAdmin()">
        <TShowAccount :id="application.id" type="context" />
        <TButton
          type="context"
          icon="delete"
          :label="$t('Delete')"
          @click="remove(application.id)"
        />
      </TDropdown>
      <div class="flex items-center">
        <TButton type="void" class="bg-gray-100 p-2" @click="vote(-1)">
          <MinusIcon class="w-4" />
        </TButton>

        <div class="flex flex-nowrap bg-gray-200 p-2">
          <ThumbUpIcon class="w-4" />
          <span class="text-sm">{{ votes }}</span>
        </div>

        <TButton type="void" class="bg-gray-100 p-2" @click="vote(1)">
          <PlusIcon class="w-4" />
        </TButton>
      </div>
    </div>
  </div>
</template>

<script>
import { ThumbUpIcon, PlusIcon, MinusIcon } from '@vue-hero-icons/outline'
import { computed } from '@nuxtjs/composition-api'
import { useAuth } from '~/use/auth'
import { db } from '~/plugins/firebase'
import { getDateTime } from '~/utils'

export default {
  components: {
    ThumbUpIcon,
    PlusIcon,
    MinusIcon,
  },
  props: {
    application: {
      type: Object,
      default: () => ({}),
    },
    userVotes: {
      type: Number,
      default: 0,
    },
  },
  setup(props, { root }) {
    const { isAdmin, uid } = useAuth()

    const votes = computed(() =>
      props.application.votes ? props.application.votes[uid.value] || 0 : 0
    )

    const totalVotes = computed(() =>
      props.application.votes
        ? Object.values(props.application.votes || {}).reduce((acc, vote) => {
            return acc + vote
          }, 0)
        : 0
    )

    function vote(diff) {
      const count = votes.value + diff
      const newTotal = props.userVotes + diff
      const leftTotal = 5 - newTotal

      if (props.application.uid === uid.value) {
        root.$toast.error('You cannot vote for your own video')
        return
      }

      if (newTotal > 5) {
        root.$toast.error('You have only 5 votes')
        return
      }
      if (count < 0) {
        root.$toast.error('You cannot vote less than 0')
        return
      }
      if (count > 3) {
        root.$toast.error('You cannot vote more than 3 per video')
        return
      }

      db.collection('competition')
        .doc(props.application.id)
        .update({
          [`votes.${uid.value}`]: count,
        })

      root.$toast.success(`Vote submitted. You have ${leftTotal} votes left.`)

      root.$track({
        event: 'competition',
        action: 'vote',
        label: diff > 0 ? 'up' : 'down',
      })
    }

    function remove(id) {
      db.collection('competition')
        .doc(id)
        .delete()
    }

    return { uid, getDateTime, totalVotes, vote, votes, remove, isAdmin }
  },
}
</script>

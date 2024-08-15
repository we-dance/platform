<template>
  <div class="border rounded shadow">
    <WYoutube v-if="isYoutube" :url="application.video" />
    <WInstagram v-if="isInstagram" :url="application.video" />

    <div class="flex pl-2 items-center">
      <div class="text-xs py-1 border-top border-gray-100 border-r">
        <dl class="divide-y divide-gray-100">
          <div class="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt class="text-sm font-medium leading-6 text-gray-900">
              Participant:
            </dt>
            <dd>
              <WProfileAvatar photo name size="xs" :uid="application.uid" />
            </dd>
          </div>
          <div
            v-if="application.partner"
            class="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0"
          >
            <dt class="text-sm font-medium leading-6 text-gray-900">
              Partner:
            </dt>
            <dd>
              <WProfileAvatar
                photo
                name
                size="xs"
                :username="application.partner.username"
              />
            </dd>
          </div>
          <div class="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt class="text-sm font-medium leading-6 text-gray-900">City:</dt>
            <dd><TCityLink :place="application.city" /></dd>
          </div>
          <div
            v-if="isAdmin()"
            class="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0"
          >
            <dt class="text-sm font-medium leading-6 text-gray-900">
              Total votes:
            </dt>
            <dd>
              <span>{{ totalVotes }}</span>
            </dd>
          </div>
          <div class="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt class="text-sm font-medium leading-6 text-gray-900">
              Category:
            </dt>
            <dd>
              <span>{{ application.style }} ({{ application.category }})</span>
            </dd>
          </div>
          <div class="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt class="text-sm font-medium leading-6 text-gray-900">
              Uploaded date:
            </dt>
            <dd>
              <span> {{ getDateTime(application.videoUploadedAt) }}</span>
            </dd>
          </div>
          <div
            v-if="isAdmin()"
            class="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0"
          >
            <dt class="text-sm font-medium leading-6 text-gray-900">Admin:</dt>
            <dd>
              <TDropdown v-if="isAdmin()">
                <TShowAccount :id="application.id" type="context" />
                <TButton
                  type="context"
                  icon="delete"
                  :label="$t('Delete')"
                  @click="remove(application.id)"
                />
              </TDropdown>
            </dd>
          </div>
        </dl>
      </div>

      <div class="p-2 flex items-center justify-center">
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
import TCityLink from '../TCityLink.vue'

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

    const isYoutube = computed(
      () =>
        props.application?.video && props.application.video.includes('youtu')
    )
    const isInstagram = computed(
      () =>
        props.application?.video &&
        props.application.video.includes('instagram')
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

    return {
      uid,
      getDateTime,
      totalVotes,
      vote,
      votes,
      remove,
      isAdmin,
      isYoutube,
      isInstagram,
    }
  },
}
</script>

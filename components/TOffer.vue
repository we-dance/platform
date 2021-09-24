<template>
  <div class="max-w-sm">
    <TSharePreviewPost2
      :type="getLabel(objectivesList, offer.objective)"
      collection="offers"
      :username="author.username"
      :center-title="offer.title"
      :bottom-description="author.bio"
      :photo="author.photo"
      align="center"
      size="sm"
    >
      <template v-slot:bottom>
        <w-playlist :id="offer.playlist" class="text-sm text-white" />
      </template>
      <template v-slot:top>
        <TStyles
          :value="offer.dance"
          :max="2"
          wrapper-class="text-xs uppercase bg-dark px-2 py-2 rounded-full"
          no-color
        />
      </template>
      <template v-slot:right>
        <div v-if="offer.days" class="mt-2 text-shadow-md text-right space-y-2">
          <div v-for="(_, day) in offer.days" :key="day" class="text-xs">
            {{ getLabel(days, day) }}
          </div>
        </div>
      </template>
    </TSharePreviewPost2>

    <div class="px-4">
      <div class="font-bold text-lg leading-none">
        {{ author.name }}
      </div>
      <div class="text-sm text-gray-700">
        {{ author.community }} {{ author.zipcode }}
        <span v-if="author.height">• {{ author.height }}cm</span>
        <span v-if="author.weight">• {{ author.weight }}kg</span>
      </div>
    </div>

    <TItemToolbar
      v-if="!isOpened"
      collection="offers"
      :item="offer"
      class="p-4"
    >
      <TButton type="primary" label="Accept offer" @click="isOpened = true" />
    </TItemToolbar>
    <div v-else>
      <div class="p-4 space-y-2">
        <TField
          v-model="where"
          label="Where:"
          :name="`${offer.id}_where`"
          type="richselect"
          hide-search-box
          :options="
            getOptionsFromMulti(
              {
                myPlace: `${author.username}'s Home - ${author.community} ${
                  author.zipcode || ''
                }`,
                yourPlace: `${profile.username}'s Home - ${profile.community} ${
                  profile.zipcode || ''
                }`,
              },
              offer.place
            )
          "
        />
        <TField
          v-model="when"
          label="When:"
          :name="`${offer.id}_when`"
          type="richselect"
          hide-search-box
          :options="getOptionsFromMulti(days, offer.days)"
        />
        <TField v-model="phone" label="Your phone:" />
      </div>
      <TAlignRight class="p-4">
        <TButton type="primary" label="Confirm" />
      </TAlignRight>
    </div>
  </div>
</template>

<script>
import { useAuth } from '~/use/auth'
import { useProfiles } from '~/use/profiles'
import { objectivesList, meetingPlaces, days } from '~/use/offers'
import { getLabel, getOptionsFromMulti } from '~/utils'

export default {
  props: {
    offer: {
      type: Object,
      default: () => ({}),
    },
  },
  data: () => ({
    where: '',
    when: '',
    phone: '',
    isOpened: false,
  }),
  computed: {
    author() {
      return this.getProfile(this.offer?.createdBy)
    },
    profile() {
      return this.getProfile(this.uid)
    },
  },
  setup() {
    const { uid } = useAuth()
    const { getProfile } = useProfiles()

    return {
      getProfile,
      objectivesList,
      getLabel,
      meetingPlaces,
      days,
      getOptionsFromMulti,
      uid,
    }
  },
}
</script>

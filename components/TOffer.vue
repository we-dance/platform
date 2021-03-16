<template>
  <div>
    <div class="p-4 flex justify-between items-start">
      <div class="flex-grow">
        <div class="flex items-center space-x-1">
          <h2 class="text-lg leading-none font-bold">
            {{ getLabel(objectivesList, offer.objective) }}
          </h2>
          <TStyles :value="offer.dance" wrapper-class="" :max="2" />
        </div>

        <div class="font-bold text-xs text-gray-700">
          {{ getLabels(days, offer.days) }}
        </div>
      </div>

      <TMenu>
        <template v-slot:button>
          <TButton icon="more_vert" type="icon" />
        </template>
        <template v-slot:menu>
          <div class="w-32 py-2 bg-white rounded-lg shadow-xl border">
            <TButton type="context" :to="`/offers/${offer.id}/edit`"
              >Edit</TButton
            >
          </div>
        </template>
      </TMenu>
    </div>

    <div v-if="!isOpened" class="p-4">
      <TProfileCard3 :profile="author" />
      <div class="flex justify-end mt-4">
        <TButton label="View offer" @click="isOpened = true" />
      </div>
    </div>

    <div v-if="isOpened">
      <div class="p-4 bg-gray-100">
        <TProfileCard3 :profile="author" show-details />
      </div>

      <div class="p-4 space-y-2">
        <TField label="You are:">
          <p>{{ offer.partnerBio }}</p>
        </TField>
        <TField label="Playlist:">
          <w-playlist :id="offer.playlist" />
        </TField>
        <TField
          v-model="where"
          label="Where:"
          :name="`${offer.id}_where`"
          type="richselect"
          hide-search-box
          :options="
            getOptionsFromMulti(
              {
                myPlace: `${author.username}'s Home - ${
                  author.community
                } ${author.zipcode || ''}`,
                yourPlace: `${profile.username}'s Home - ${
                  profile.community
                } ${profile.zipcode || ''}`
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
      </div>
      <div class="flex justify-end p-4">
        <TButton type="primary" label="Accept offer" />
      </div>
    </div>
  </div>
</template>

<script>
import useAuth from '~/use/auth'
import useProfiles from '~/use/profiles'
import { objectivesList, meetingPlaces, days } from '~/use/offers'
import { getLabel, getOptionsFromMulti, getLabels } from '~/utils'

export default {
  props: {
    offer: {
      type: Object,
      default: () => ({})
    }
  },
  data: () => ({
    where: '',
    when: '',
    isOpened: false
  }),
  computed: {
    author() {
      return this.getProfile(this.offer?.createdBy)
    },
    profile() {
      return this.getProfile(this.uid)
    }
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
      getLabels,
      uid
    }
  }
}
</script>

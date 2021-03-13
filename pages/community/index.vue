<template>
  <div>
    <TTitle>
      <span v-if="city">{{ city.name }}</span> {{ $t('profiles.title') }}
    </TTitle>

    <div class="overflow-x-scroll my-2">
      <div class="flex flex-no-wrap space-x-2">
        <TInputCity v-model="currentCity" />

        <t-rich-select
          v-model="dances"
          clearable
          :options="danceStyles"
          class="w-full"
          :placeholder="$t('style.label')"
        />
        <t-rich-select
          v-model="objective"
          :options="objectivesOptions"
          hide-search-box
          clearable
          class="w-full"
          :placeholder="$t('profile.objectives')"
        />
        <t-rich-select
          v-model="profileType"
          :options="typeOptions"
          hide-search-box
          clearable
          class="w-full"
          placeholder="Type"
        />
        <t-rich-select
          v-model="roles"
          :options="rolesList"
          hide-search-box
          clearable
          placeholder="Gender"
        />
      </div>
    </div>

    <div>
      <WTeaser
        v-if="!uid"
        :title="$t('teaser.profile.title')"
        :description="$t('teaser.profile.description')"
        :button="$t('teaser.profile.btn')"
        url="/register"
      />

      <WTeaser
        v-if="uid && currentCity"
        :title="$t('teaser.chat.title')"
        :description="$t('teaser.chat.description')"
        :button="$t('teaser.chat.btn', { city: currentCity })"
        class="mb-4"
        @click="joinChat()"
      />

      <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
        <router-link
          v-for="profile in items"
          :key="profile.id"
          :to="`/${profile.username}`"
          class="hover:opacity-75"
        >
          <TSharePreviewPost
            :type="profile.type"
            :username="profile.username"
            :description="getExcerpt(profile.bio)"
            :extra="profile.height ? `${profile.height}cm` : ''"
            :photo="profile.photo"
            :styles="profile.styles"
            size="sm"
          />
        </router-link>
      </div>

      <WTeaser
        v-if="uid && !items.length"
        :title="$t('teaser.involve.title')"
        :description="$t('teaser.involve.description')"
        :button="$t('teaser.involve.btn')"
        href="http://bit.ly/wedance-start"
        class="mt-4"
      />
    </div>
  </div>
</template>

<script>
import { ref, computed } from '@nuxtjs/composition-api'
import useAuth from '~/use/auth'
import useCollection from '~/use/collection'
import useDoc from '~/use/doc'
import useCities from '~/use/cities'
import { sortBy, getExcerpt, getDateTime, openURL } from '~/utils'
import useProfiles from '~/use/profiles'
import useStyles from '~/use/styles'

export default {
  name: 'PeopleIndex',
  methods: {
    async joinChat() {
      await this.$fire.firestore.collection('city_chats').add({
        city: this.currentCity
      })

      this.$fire.analytics.logEvent('join_chat', {
        city: this.currentCity
      })

      if (this.city?.telegram) {
        openURL(this.city.telegram)
      } else {
        openURL('https://t.me/joinchat/Iqif2X0FCXCpqHDj')
      }
    }
  },
  setup() {
    const { uid, updateProfile, profile: myProfile } = useAuth()

    const { docs: docsProfiles } = useCollection('profiles')
    const { create: createProfile } = useDoc('profiles')
    const { getStylesDropdown } = useStyles()

    const { currentCity, city } = useCities()
    const { objectivesList, typeList } = useProfiles()

    const typeOptions = typeList
    const objectivesOptions = objectivesList

    const tab = ref('partner')
    const objective = ref('')
    const profileType = ref('')
    const roles = ref('')
    const dances = ref('')
    const danceStyles = computed(() =>
      getStylesDropdown(myProfile.value?.styles)
    )

    const rolesList = [
      {
        label: 'Female',
        value: 'Female'
      },
      {
        label: 'Male',
        value: 'Male'
      }
    ]

    const items = computed(() => {
      let result = docsProfiles.value.filter((item) =>
        currentCity.value ? item.community === currentCity.value : true
      )

      result = result.filter(
        (item) =>
          item.username &&
          (uid.value || item.visibility === 'Public') &&
          item.visibility !== 'Unlisted'
      )

      if (dances.value) {
        result = result.filter(
          (item) =>
            item.styles &&
            item.styles[dances.value] &&
            item.styles[dances.value].selected
        )
      }

      if (roles.value) {
        result = result.filter((item) => item.gender === roles.value)
      }

      if (objective.value) {
        result = result.filter(
          (item) => item.objectives && item.objectives[objective.value]
        )
      }

      result = result.filter((item) =>
        profileType.value ? item.type && item.type === profileType.value : true
      )

      return result.sort(sortBy('-lastLoginAt'))
    })

    return {
      items,
      uid,
      tab,
      updateProfile,
      myProfile,
      objective,
      roles,
      dances,
      objectivesOptions,
      rolesList,
      currentCity,
      typeOptions,
      profileType,
      getExcerpt,
      createProfile,
      danceStyles,
      getDateTime,
      city
    }
  }
}
</script>

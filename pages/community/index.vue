<template>
  <div>
    <TTitle>
      {{ $t('profiles.title') }}
    </TTitle>

    <div class="overflow-x-scroll my-2">
      <div class="flex flex-no-wrap space-x-2">
        <TInputCity v-model="currentCity" />
        <TInputSelect v-model="profileType" :options="typeOptions" />
        <TInputSelect
          v-model="objective"
          :options="objectivesOptions"
          :label="$t('objective.label')"
        />
        <TInputSelect v-model="roles" :options="rolesList" label="Gender" />
        <TStylesFilter
          v-model="dances"
          :selected="myStyles"
          :label="$t('style.label')"
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

      <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
        <div
          v-if="
            myProfile &&
              (!myProfile.bio ||
                !myProfile.photo ||
                !myProfile.languages ||
                !myProfile.partnerBio)
          "
          class="border rounded p-4 bg-white"
        >
          <div>
            <p class="font-bold">
              Finish your profile:
            </p>
            <ul class="list-disc ml-4">
              <li
                class="text-red-500"
                :class="{ 'text-green-500': myProfile.photo }"
              >
                Photo
              </li>
              <li
                class="text-red-500"
                :class="{ 'text-green-500': myProfile.bio }"
              >
                About me
              </li>

              <li
                class="text-red-500"
                :class="{ 'text-green-500': myProfile.languages }"
              >
                Languages
              </li>
              <li
                class="text-red-500"
                :class="{ 'text-green-500': myProfile.partnerBio }"
              >
                About my partner
              </li>
              <li
                class="text-red-500"
                :class="{ 'text-green-500': myProfile.weight }"
              >
                Weight
              </li>
              <li
                class="text-red-500"
                :class="{ 'text-green-500': myProfile.height }"
              >
                Height
              </li>
            </ul>
            <TButton class="mt-4" to="/settings?tab=profile"
              >Edit my profile</TButton
            >
          </div>
        </div>

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
import { sortBy, getExcerpt } from '~/utils'
import useProfiles from '~/use/profiles'

export default {
  name: 'PeopleIndex',
  setup() {
    const { uid, updateProfile, profile: myProfile } = useAuth()

    const { docs: docsProfiles } = useCollection('profiles')
    const { create: createProfile } = useDoc('profiles')

    const { currentCity } = useCities()
    const { objectivesList, typeList } = useProfiles()

    const typeOptions = [
      {
        label: 'Type',
        value: ''
      },
      ...typeList
    ]

    const objectivesOptions = [
      {
        label: 'Objective',
        value: ''
      },
      ...objectivesList
    ]

    const tab = ref('partner')
    const objective = ref('')
    const profileType = ref('')
    const roles = ref('')
    const dances = ref('')
    const myStyles = computed(() => myProfile.value?.styles)

    const rolesList = [
      {
        label: 'Gender',
        value: ''
      },
      {
        label: 'Female',
        value: 'Female'
      },
      {
        label: 'Male',
        value: 'Male'
      }
    ]

    const docs = computed(() => {
      return docsProfiles.value
        .filter((item) =>
          currentCity.value ? item.community === currentCity.value : true
        )
        .sort(sortBy('-createdAt'))
    })

    const items = computed(() => {
      let result = docs.value.filter(
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

      return result
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
      myStyles
    }
  }
}
</script>

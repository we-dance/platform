<template>
  <div>
    <TTitle>
      {{ $t('profiles.title') }}
      <template slot="right">
        <TButton type="primary" @click="isAddingProfile = true">{{
          $t('profiles.add')
        }}</TButton>
      </template>
    </TTitle>

    <TPopup
      v-if="isAddingProfile"
      title="Coming soon"
      @close="isAddingProfile = false"
    >
      <div class="max-w-md mx-auto overflow-y-scroll typo">
        <p>
          You will be able to create community profiles for your favourite dance
          academies, artists, DJs, musicians, venues.
        </p>
        <p>
          Community profiles will be possible to claim by verifying ownership.
        </p>
        <p>
          In meantime you can contact support:
          <a
            class="text-blue-500 underline hover:no-underline"
            href="mailto:support@wedance.vip"
            >support@wedance.vip</a
          >.
        </p>
      </div>
    </TPopup>

    <div class="overflow-x-scroll my-2">
      <div class="flex flex-no-wrap space-x-2">
        <TInputCity v-model="currentCity" />
        <TInputSelect v-model="profileType" :options="typeList" />
        <TInputSelect
          v-model="objective"
          :options="objectivesOptions"
          :label="$t('objective.label')"
        />
        <TInputSelect v-model="roles" :options="rolesList" label="Gender" />
        <TInputSelect
          v-model="dances"
          :options="dancesList"
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

        <TCardProfile2 v-for="item in items" :key="item.id" :uid="item.id" />
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
import useCities from '~/use/cities'
import { sortBy } from '~/utils'
import useProfiles from '~/use/profiles'

export default {
  name: 'PeopleIndex',
  data: () => ({
    isAddingProfile: false
  }),
  setup() {
    const { uid, updateProfile, profile: myProfile } = useAuth()

    const { docs: docsProfiles } = useCollection('profiles')
    const { currentCity } = useCities()
    const { objectivesList, typeList } = useProfiles()

    const objectivesOptions = [
      {
        label: 'Objective',
        value: ''
      },
      ...objectivesList
    ]

    const tab = ref('partner')
    const objective = ref('')
    const profileType = ref('Dancer')
    const roles = ref('')
    const dances = ref('')

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

    const dancesList = computed(() => {
      const list = myProfile.value ? Object.keys(myProfile.value.styles) : []

      return [
        {
          label: 'Style',
          value: ''
        },
        ...list
      ]
    })

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

      result = result.filter(
        (item) => item.type && item.type === profileType.value
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
      dancesList,
      currentCity,
      typeList,
      profileType
    }
  }
}
</script>

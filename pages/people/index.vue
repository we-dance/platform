<template>
  <div>
    <TTitle>
      Community
      <template slot="right">
        <TButton type="primary" @click="isAddingProfile = true"
          >Add profile</TButton
        >
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
        <TInputMultiDropdown
          v-model="objectives"
          :options="objectivesList"
          label="Objective"
        />
        <TInputMultiDropdown
          v-model="roles"
          :options="rolesList"
          label="Role"
        />
        <TInputMultiDropdown
          v-model="dances"
          :options="dancesList"
          label="Style"
        />
      </div>
    </div>

    <div>
      <WTeaser
        v-if="!uid"
        title="Publish your profile"
        description="so that others can contact you"
        button="Join for free"
        url="/signin?target=/people"
      />

      <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
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
        title="We need your help"
        description="We are non-profit international dance community. We want you go to any city in any country and find dance events and dancers. It all starts with the local community."
        button="Get Involved"
        href="http://bit.ly/wedance-start"
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

export default {
  name: 'PeopleIndex',
  data: () => ({
    isAddingProfile: false
  }),
  setup() {
    const { uid, updateProfile, profile: myProfile } = useAuth()

    const { docs: docsProfiles } = useCollection('profiles')
    const { currentCity } = useCities()

    const tab = ref('partner')
    const objectives = ref({})
    const roles = ref({})
    const dances = ref({})

    const objectivesList = [
      {
        label: 'Dance practice',
        value: 'practice'
      },
      {
        label: 'Learn a dance',
        value: 'learn'
      },
      {
        label: 'Socialize',
        value: 'socialize'
      },
      {
        label: 'Go out dancing',
        value: 'dancing'
      },
      {
        label: 'Dance outside',
        value: 'outside'
      },
      {
        label: 'Talk dance',
        value: 'talk'
      },
      {
        label: 'Dance competition',
        value: 'competition'
      }
    ]
    const rolesList = ['Male', 'Female', 'Instructor']
    const dancesList = computed(() =>
      myProfile.value ? Object.keys(myProfile.value.styles) : []
    )

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

      if (Object.keys(dances.value).length) {
        result = result.filter(
          (item) =>
            Object.keys(dances.value).filter(
              (dance) =>
                item.styles && item.styles[dance] && item.styles[dance].selected
            ).length > 0
        )
      }

      if (roles.value.Male) {
        result = result.filter((item) => item.gender === 'Male')
      }

      if (roles.value.Female) {
        result = result.filter((item) => item.gender === 'Female')
      }

      if (roles.value.Instructor) {
        result = result.filter((item) => item.teacher === 'Yes')
      }

      if (objectives.value.practice) {
        result = result.filter((item) => item.partner === 'Yes')
      }

      return result
    })

    return {
      items,
      uid,
      tab,
      updateProfile,
      myProfile,
      objectives,
      roles,
      dances,
      objectivesList,
      rolesList,
      dancesList,
      currentCity
    }
  }
}
</script>

<template>
  <div>
    <TTitle>Community</TTitle>

    <div v-if="uid" class="border rounded p-4 mb-4">
      <TField
        :value.sync="myProfile.partner"
        label="Are you looking for dance partner?"
        type="buttons"
        label-position="vertical"
        :options="['Yes', 'No']"
        @input="(partner) => updateProfile({ partner })"
      />

      <div
        v-if="
          myProfile.partner === 'Yes' &&
            (!myProfile.bio ||
              !myProfile.photo ||
              !myProfile.languages ||
              !myProfile.partnerBio)
        "
        class="mt-4 p-4 rounded border"
      >
        <p class="font-bold">
          You have better chances to find dance partner by improving your own
          profile:
        </p>
        <ul class="list-disc ml-4">
          <li
            class="text-red-500"
            :class="{ 'text-green-500': myProfile.photo }"
          >
            Photo
          </li>
          <li class="text-red-500" :class="{ 'text-green-500': myProfile.bio }">
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

    <div>
      <TInputButtons v-model="tab" class="mb-4" :options="tabs" />

      <div
        v-if="!uid"
        class="mb-4 rounded bg-dark-gradient text-white text-sm text-center p-4"
      >
        <div>
          <h1 class="font-bold text-lg">
            Publish your profile
          </h1>
          <p>so that others can find you as well</p>
        </div>
        <div class="flex justify-center">
          <TButton class="my-2" type="primary" to="/signin?target=/people"
            >Create profile</TButton
          >
        </div>
      </div>
      <TCardProfile
        v-for="item in items"
        :key="item.id"
        class="mb-4"
        :uid="item.createdBy"
      />
      <div v-if="!uid" class="m-4 font-bold text-center">
        {{ itemsPartner.length - itemsPartnerPublic.length }} other dancers show
        their profiles only for members
      </div>
      <div
        v-if="!uid"
        class="mt-4 bg-dark-gradient text-white p-4 rounded text-center"
      >
        <div>Become a member of WeDance Community to get full access.</div>
        <TButton class="mt-2" type="primary" to="/signin?target=/people"
          >Join Now</TButton
        >
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from '@vue/composition-api'
import ls from 'local-storage'
import useAuth from '~/use/auth'
import useCollection from '~/use/collection'
import { sortBy } from '~/utils'

export default {
  name: 'PeopleIndex',
  setup() {
    const { uid, updateProfile, profile: myProfile } = useAuth()

    const { docs: docsProfiles } = useCollection('profiles')

    const city = ls('city')

    const tab = ref('partner')

    const docs = computed(() => {
      return docsProfiles.value
        .filter((item) => item.community === city)
        .sort(sortBy('-createdAt'))
    })

    const itemsAll = computed(() => {
      return docs.value.filter((item) => item.username)
    })

    const teachersAll = computed(() => {
      return docs.value.filter(
        (item) => item.username && item.teacher === 'Yes'
      )
    })

    const itemsAllPublic = computed(() => {
      return docs.value.filter(
        (item) => item.username && item.visibility === 'Public'
      )
    })

    const itemsPartner = computed(() => {
      return docs.value.filter(
        (item) => item.username && item.partner === 'Yes'
      )
    })

    const itemsPartnerPublic = computed(() => {
      return docs.value.filter(
        (item) =>
          item.username &&
          item.partner === 'Yes' &&
          item.visibility === 'Public'
      )
    })

    const tabs = computed(() => [
      {
        value: 'partner',
        label: `Looking for dance partner (${itemsPartner.value.length})`
      },
      {
        value: 'teachers',
        label: `Teachers (${teachersAll.value.length})`
      },
      {
        value: 'community',
        label: `All members (${itemsAll.value.length})`
      }
    ])

    const items = computed(() => {
      if (tab.value === 'partner') {
        return docs.value.filter(
          (item) =>
            item.username &&
            item.partner === 'Yes' &&
            (uid.value || item.visibility === 'Public')
        )
      }

      if (tab.value === 'community') {
        return docs.value.filter(
          (item) => item.username && (uid.value || item.visibility === 'Public')
        )
      }

      if (tab.value === 'teachers') {
        return docs.value.filter(
          (item) => item.username && item.teacher === 'Yes'
        )
      }
    })

    return {
      city,
      items,
      uid,
      tabs,
      tab,
      itemsAll,
      itemsAllPublic,
      itemsPartner,
      itemsPartnerPublic,
      updateProfile,
      myProfile
    }
  }
}
</script>

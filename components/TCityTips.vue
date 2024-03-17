<template>
  <div>
    <div class="p-4">
      <h1 class="text-2xl font-bold">
        {{ $t('explore.tips.header', { city: city.name }) }}
      </h1>
      <div class="text-sm">
        {{ $t('explore.tips.subheader', { city: city.name }) }}
      </div>
    </div>

    <TQuestionForm v-model="item" :place="place" />

    <TStories
      :key="item.style"
      :place="place"
      :city="city"
      :no-place="noPlace"
      :filter-dance="item.style"
    />

    <div class="border-t flex justify-center py-4">
      <TButton
        type="primary"
        :to="`/reviews/add?city=${city.cityPlaceId}`"
        label="Add Recommendation"
      />
    </div>

    <div class="p-4 border-t border-b">
      <h1 class="text-2xl font-bold">Questions from other cities</h1>
      <div class="text-sm">
        Share your insights and connect with dancers seeking guidance!
      </div>
    </div>
    <TStories type="ask-for-recommendations" />
  </div>
</template>

<script>
export default {
  name: 'ExploreTips',
  props: {
    place: {
      type: String,
      default: '',
    },
    createdBy: {
      type: String,
      default: '',
    },
    city: {
      type: Object,
      default: () => ({}),
    },
    noPlace: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      item: {
        style: '',
        description: '',
      },
    }
  },
  head() {
    return {
      title: this.$t('explore.tips.title', { city: this.city.name }),
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.$t('explore.tips.description', {
            city: this.name,
          }),
        },
      ],
    }
  },
}
</script>

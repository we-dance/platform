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

    <TQuestionForm :place="place" />

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

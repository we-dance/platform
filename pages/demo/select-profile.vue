<template>
  <div class="p-4">
    <TInputSelectProfile v-model="artist1" :options="artists" />
    <TInputSelectProfile v-model="artist1" :options="artists" />

    <pre>{{ artist1 }}</pre>
  </div>
</template>

<script>
export default {
  data() {
    return {
      artist1: {
        username: 'Sam',
      },
      artists: [
        {
          username: 'Sam',
        },
        {
          username: 'Michael',
        },
      ],
    }
  },
}
</script>

<template>
  <div>
    <h3 class="border-t pt-4 text-2xl font-extrabold text-center">
      {{ title || 'Laugh Break' }}
    </h3>
    <w-instagram :url="url" class="p-4" />
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      urls: [
        'https://www.instagram.com/p/C4YEeJDMBoa/',
        'https://www.instagram.com/p/C4VfrM5sbWc/',
        'https://www.instagram.com/p/C4QXhD_MqnG/',
        'https://www.instagram.com/p/C4PGJLLoNek/',
        'https://www.instagram.com/p/C4Ldk9MMLKg/',
        'https://www.instagram.com/p/C4HCIf_MuRd/',
        'https://www.instagram.com/p/C4F_RF5spoV/',
        'https://www.instagram.com/p/C4DwYD6sW21/',
        'https://www.instagram.com/p/C4A_fKxsnKx/',
        'https://www.instagram.com/p/C3_Ob3CMVM2/',
        'https://www.instagram.com/p/C38VDWlMZIO/',
        'https://www.instagram.com/p/C37gu82Mv3z/',
        'https://www.instagram.com/p/C35rHP_snpg/',
        'https://www.instagram.com/p/C35GI1QMuMA/',
        'https://www.instagram.com/p/C32_QGvMMog/',
      ],
    }
  },
  computed: {
    url() {
      return this.urls[Math.floor(Math.random() * this.urls.length)]
    },
  },
}
</script>

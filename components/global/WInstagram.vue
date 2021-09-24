<template>
  <div>
    <blockquote
      class="instagram-media"
      data-instgrm-captioned
      :data-instgrm-permalink="url"
      data-instgrm-version="12"
      style="
        background: #fff;
        border: 0;
        border-radius: 3px;
        box-shadow: 0 0 1px 0 rgba(0, 0, 0, 0.5),
          0 1px 10px 0 rgba(0, 0, 0, 0.15);
        margin: 1px;
        max-width: 540px;
        min-width: 326px;
        padding: 0;
        width: 99.375%;
        width: -webkit-calc(100% - 2px);
        width: calc(100% - 2px);
      "
    ></blockquote>
    <script async src="//www.instagram.com/embed.js"></script>
  </div>
</template>

<script>
export default {
  props: {
    url: {
      type: String,
      default: '',
    },
  },
}
</script>

<template>
  <div class="tt-widget">
    <div class="tt-widget-fallback">
      <p>
        <a :href="href" target="_blank">Click here to buy tickets</a
        ><br /><small
          ><a
            href="https://www.tickettailor.com?rf=wdg_105946"
            class="tt-widget-powered"
            >Sell tickets online with Ticket Tailor</a
          ></small
        >
      </p>
    </div>
    <script
      src="https://cdn.tickettailor.com/js/widgets/min/widget.js"
      :data-url="href"
      data-type="inline"
      data-inline-minimal="true"
      data-inline-show-logo="false"
      data-inline-bg-fill="false"
      data-inline-inherit-ref-from-url-param=""
      data-inline-ref="website_widget"
    ></script>
  </div>
</template>

<script>
export default {
  props: {
    href: {
      type: String,
      default: '',
    },
  },
}
</script>

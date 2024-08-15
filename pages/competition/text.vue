<template>
  <div class="p-4">
    <p class="font-bold">
      Important: Include This Description in Your YouTube or Instagram Video:
    </p>
    <pre class="bg-gray-100 text-wrap rounded p-2">
WeDance Global Video Dance Competition 2024.

I’m excited to be part of the competition! This is my submission in the {{
        style
      }} Dance {{
        category
      }} category. Help support my entry by liking, sharing, and voting. Let’s celebrate the diversity and creativity of dance worldwide! 💃🕺

Dancers:
💃 [Your Name] [@yourusername]
🕺 [Your Partner’s Name] [@partnerusername]

Videography:
🎥 [Videographer’s Name] [@videographerusername]

Song:
Original Version by: [Original Artist Name]
Remix by: [Remixer’s Name]
[Link to the Song] (preferably YouTube or Spotify)

Disclaimer:
This video is strictly for the promotional purpose of showcasing {{
        style
      }} Dance. We do NOT own the rights to this music; it is used only to highlight the creativity of the artists and dancers involved.
NO COPYRIGHT INFRINGEMENT INTENDED.

#WeDanceCompetition #WDGVDC2024 #{{
        style
      }}Dance #DanceChallenge  #DanceVideo #WeDance
</pre
    >
  </div>
</template>
<script>
export default {
  layout: 'full',
  data: () => ({
    style: '[Your Dance Style]',
    category: '[Your Dance Category (couple, solo, group)]',
  }),
  mounted() {
    if (this.$route.query.style) {
      this.style = this.$route.query.style
    }
    if (this.$route.query.style) {
      this.category = this.$route.query.category
    }
  },
}
</script>

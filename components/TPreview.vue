<template>
  <v-runtime-template :template="raw" />
</template>

<script>
import MarkdownIt from 'markdown-it'
import MarkdownContainer from 'markdown-it-container'
import VRuntimeTemplate from 'v-runtime-template'
import MarkdownAttrs from 'markdown-it-attrs'
import excerptHtml from 'excerpt-html'

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
})

md.use(MarkdownAttrs)

md.use(MarkdownContainer, 'details', {
  validate: (params) => {
    return params.trim().match(/^details\s+(.*)$/)
  },

  render: (tokens, idx) => {
    const m = tokens[idx].info.trim().match(/^details\s+(.*)$/)

    if (tokens[idx].nesting === 1) {
      // opening tag
      return '<details><summary>' + md.utils.escapeHtml(m[1]) + '</summary>\n'
    } else {
      // closing tag
      return '</details>\n'
    }
  }
})

md.use(MarkdownContainer, 'hero', {
  validate: (params) => {
    return params.trim().match(/^hero$/)
  },

  render: (tokens, idx) => {
    if (tokens[idx].nesting === 1) {
      return '<div class="hero">\n'
    } else {
      return '</div>\n'
    }
  }
})

export default {
  components: {
    VRuntimeTemplate
  },
  props: {
    content: {
      type: String,
      default: ''
    },
    excerpt: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    raw() {
      let html = md.render(this.content)

      if (this.excerpt) {
        html = excerptHtml(html)
      }

      return '<div class="typo">' + html + '</div>'
    }
  }
}
</script>

<template>
  <div>
    <Editor :blog-content="editorContent" @contentChanged="onChange" />
    <Blog :editor-content="editorContent" />
  </div>
</template>

<script>
import Blog from '~/components/Blog.vue'
import Editor from '~/components/Editor.vue'
const editorContent = {
  time: 1629305722425,
  blocks: [
    {
      id: 'P0gOThWo9y',
      type: 'header',
      data: {
        text: 'Editor.js',
        level: 1,
      },
    },
    {
      id: 'YsJdcKCfHt',
      type: 'paragraph',
      data: {
        text: 'Hey. Meet the new Editor. On this page you can see it in action — try to edit this text.',
      },
    },
    {
      id: 'iIhdNHjLzc',
      type: 'header',
      data: {
        text: 'What does it mean clean data output',
        level: 2,
      },
    },
    {
      id: 'BaOtN0Tn3V',
      type: 'paragraph',
      data: {
        text: 'Classic WYSIWYG-editors produce raw HTML-markup with both content data and content appearance. On the contrary, Editor.js outputs JSON object with data of each Block. You can see an example below',
      },
    },
    {
      id: '0ReqIOJLNx',
      type: 'paragraph',
      data: {
        text: 'Given data can be used as you want: render with HTML for <code class="inline-code">Web clients</code>, render natively for <code class="inline-code">mobile apps</code>, create markup for <code class="inline-code">Facebook Instant Articles</code> or <code class="inline-code">Google AMP</code>, generate an <code class="inline-code">audio version</code> and so on.',
      },
    },
    {
      id: '7UTs8tiQqx',
      type: 'paragraph',
      data: {
        text: 'Clean data is useful to sanitize, validate and process on the backend.',
      },
    },
    {
      id: 'iFrktjRJ5I',
      type: 'paragraph',
      data: {
        text: "We have been working on this project more than three years. Several large media projects help us to test and debug the Editor, to make it's core more stable. At the same time we significantly improved the API. Now, it can be used to create any plugin for any task. Hope you enjoy. 😏",
      },
    },
  ],
  version: '2.22.2',
}

export default {
  components: { Editor, Blog },
  data() {
    return { editorContent }
  },
  methods: {
    onChange(data) {
      console.log('component content was changed...')
      this.editorContent = data
    },
  },
}
</script>

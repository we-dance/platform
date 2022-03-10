<template>
  <div>
    <template v-for="block in editorContent.blocks">
      <h1
        v-if="block.type === 'header' && block.data.level === 1"
        :key="block.id"
      >
        {{ block.data.text }}
      </h1>

      <h2
        v-if="block.type === 'header' && block.data.level === 2"
        :key="block.id"
      >
        {{ block.data.text }}
      </h2>

      <p v-if="block.type === 'paragraph'" :key="block.id">
        {{ block.data.text }}
      </p>
    </template>
  </div>
</template>

<script>
export default {
  name: 'Blog',
  props: {
    editorContent: { type: Object, default: () => {} },
  },
}
</script>

<template>
  <div v-if="showEditor" class="border p-4 space-y-2">
    <TInput
      v-for="(answer, key) in data.answers"
      :key="`answer-${key}`"
      v-model="data.answers[key]"
    />
    <TInput v-model="newAnswer" @keyup.enter="addAnswer" />
    <TButton @click="saveNode">Save</TButton>
  </div>
  <div v-else class="flex flex-col space-y-2 border p-4">
    <TReaction
      v-for="(answer, key) in node.answers"
      :key="`answer-${key}`"
      :label="answer"
      :toggled-label="answer"
      :field="answer"
      :item="node"
    />
  </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue-demi'
import { useAuth } from '~/use/auth'
import { useDoc } from '~/use/doc'

export default {
  name: 'TCardPoll',
  props: {
    node: {
      type: Object,
      required: true,
    },
    showCover: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    addAnswer() {
      this.data.answers.push(this.newAnswer)
      this.newAnswer = ''
    },
    saveNode() {
      this.update(this.node.id, {
        answers: this.data.answers,
      })
    },
  },
  setup(props) {
    const { can } = useAuth()
    const { update } = useDoc('posts')
    const data = ref({})
    const newAnswer = ref('')

    onMounted(() => {
      data.value = {
        answers: [],
      }
    })

    const showEditor = computed(() => {
      if (!props.node) {
        return false
      }

      const isDefined = props.node.answers

      return can('edit', 'posts', props.node) && !isDefined
    })

    return { showEditor, update, data, newAnswer }
  },
}
</script>

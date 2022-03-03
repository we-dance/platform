<template>
  <div class="inline-flex items-center divide-x rounded border">
    <div>
      <TReaction
        :label="$t('TReaction.star')"
        toggled-label="Starred"
        field="star"
        icon="StarIcon"
        class="border-none"
        :item="item"
      />
    </div>
    <div>
      <TMenu>
        <template v-slot:button>
          <TButton type="xs" class="border-none">
            <ChevronDownIcon class="h-3 w-3" />
          </TButton>
        </template>
        <template v-slot:menu>
          <div
            class="flex w-32 flex-col rounded border bg-white text-xs shadow"
          >
            <div class="px-2 py-1">Add to list</div>
            <label
              v-for="list in lists"
              :key="list.id"
              class="flex items-center space-x-1 px-2 py-1"
              @click.prevent="toggle(list)"
            >
              <input type="checkbox" :checked="isSelected(list)" />
              <span>{{ list.label }}</span>
            </label>
            <button
              class="flex items-center space-x-1 border-t px-2 py-1 text-left hover:bg-gray-100"
              @click="showPopup = true"
            >
              <PlusIcon class="h-3 w-3" />
              <span>Create list</span>
            </button>
          </div>
        </template>
      </TMenu>
      <TPopup v-if="showPopup" title="Create list" @close="showPopup = false">
        <div class="space-y-2 p-4">
          <TField v-model="newListLabel" hide-label placeholder="List name" />
          <div class="flex justify-end">
            <TButton label="Add" @click="addList" />
          </div>
        </div>
      </TPopup>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/firestore'
import { ChevronDownIcon, PlusIcon } from '@vue-hero-icons/outline'
import { useAuth } from '~/use/auth'
import { useDoc } from '~/use/doc'
import { useCollection } from '~/use/collection'

export default {
  components: {
    ChevronDownIcon,
    PlusIcon,
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    newListLabel: '',
    showPopup: false,
  }),
  methods: {
    isSelected(list) {
      return this.item?.id && list.posts && !!list.posts[this.item.id]
    },
    addList() {
      this.create({
        label: this.newListLabel,
      })

      this.newListLabel = ''

      this.showPopup = false
    },
    toggle(list) {
      const selected = this.isSelected(list)

      let change

      if (selected) {
        change = {
          [`posts.${this.item.id}`]: firebase.firestore.FieldValue.delete(),
        }
      } else {
        change = {
          [`posts.${this.item.id}`]: true,
        }
      }

      this.update(list.id, change)
    },
  },
  setup() {
    const { uid } = useAuth()

    const { create, update } = useDoc('lists')

    const { docs: lists } = useCollection('lists', { createdBy: uid.value })

    return {
      create,
      update,
      lists,
    }
  },
}
</script>

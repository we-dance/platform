<template>
  <div class="inline-flex border rounded divide-x items-center">
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
            <ChevronDownIcon class="w-3 h-3" />
          </TButton>
        </template>
        <template v-slot:menu>
          <div
            class="w-32 bg-white rounded shadow border text-xs flex flex-col"
          >
            <div class="px-2 py-1">
              Add to list
            </div>
            <label
              v-for="list in lists"
              :key="list.id"
              class="px-2 py-1 flex items-center space-x-1"
              @click.prevent="toggle(list)"
            >
              <input type="checkbox" :checked="isSelected(list)" />
              <span>{{ list.label }}</span>
            </label>
            <button
              class="border-t px-2 py-1 hover:bg-gray-100 text-left flex items-center space-x-1"
              @click="showPopup = true"
            >
              <PlusIcon class="w-3 h-3" />
              <span>Create list</span>
            </button>
          </div>
        </template>
      </TMenu>
      <TPopup v-if="showPopup" title="Create list" @close="showPopup = false">
        <div class="p-4 space-y-2">
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

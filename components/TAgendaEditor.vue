<template>
  <div class="p-4">
    <div class="flex gap-2">
      <label v-if="editor" class="text-xs mb-4">
        <input v-model="toggleEditor" type="checkbox" />
        Edit
      </label>
      <label class="text-xs mb-4">
        <input v-model="toggleList" type="checkbox" />
        Show List
      </label>
    </div>
    <TEventListNoLoad v-if="toggleList" :docs="items" hide-nav />
    <template v-else>
      <TwTabs
        v-model="selectedDay"
        :tabs="
          days.map((day, index) => ({
            name: day.name,
            value: index + 1,
            current: index + 1 === selectedDay,
          }))
        "
      />
      <div class="overflow-x-scroll">
        <table
          v-if="currentDay"
          class="border-collapse table-fixed text-xs border"
        >
          <thead>
            <tr>
              <th
                class="border-r border-b dark:border-slate-600 font-medium text-slate-400 dark:text-slate-200 text-left w-14"
              ></th>
              <th
                v-for="room in currentDay.rooms"
                :key="room"
                class="border-b border-r dark:border-slate-600 font-medium text-slate-400 dark:text-slate-200 text-left p-2"
              >
                {{ room }}
              </th>
              <th
                v-if="editing"
                class="border-b dark:border-slate-600 font-medium text-slate-400 dark:text-slate-200 text-left"
              >
                <input
                  v-model="roomName"
                  placeholder="Add room"
                  class="w-full p-2"
                  @keydown.enter="addRoom"
                />
              </th>
            </tr>
          </thead>
          <tr v-for="(time, timeIndex) in currentDay.times" :key="time">
            <th
              class="border-r border-b dark:border-slate-600 font-medium text-slate-400 dark:text-slate-200 text-left p-2"
            >
              {{ getTime(time, timeIndex) }}
            </th>
            <td
              v-for="room in currentDay.rooms"
              :key="room"
              class="border-b border-r border-slate-100 text-slate-500"
            >
              <template v-if="!editing">
                <div
                  v-if="getItem(room, time, currentDay.date, 'name')"
                  class="flex flex-col justify-start w-full p-2 items-center text-center text-gray-700"
                >
                  <div class="flex justify-between w-full">
                    <TEventBookmark
                      v-if="getItem(room, time, currentDay.date, 'id')"
                      :event-id="getItem(room, time, currentDay.date, 'id')"
                    />
                    <TDanceLink
                      :dance="getItem(room, time, currentDay.date, 'style')"
                      class="text-xs text-gray-400 no-underline"
                    />
                  </div>

                  <div class="p-4">
                    <div class="font-bold text-sm leading-none">
                      {{ getItem(room, time, currentDay.date, 'name') }}
                    </div>
                    <WProfileSmall
                      v-if="getItem(room, time, currentDay.date, 'artist')"
                      :username="getItem(room, time, currentDay.date, 'artist')"
                    />
                  </div>
                </div>
              </template>
              <template v-else>
                <input
                  :value="getItem(room, time, currentDay.date, 'name')"
                  placeholder="Add item"
                  class="w-full p-2"
                  @input="
                    (e) =>
                      setItem(room, time, currentDay.date, {
                        name: e.target.value,
                      })
                  "
                />
                <template v-if="getItem(room, time, currentDay.date, 'name')">
                  <TRichSelect
                    :value="getItem(room, time, currentDay.date, 'artist')"
                    :options="parent.artists"
                    value-attribute="username"
                    text-attribute="name"
                    clearable
                    @change="
                      (username) =>
                        setItem(room, time, currentDay.date, {
                          artist: username,
                        })
                    "
                  >
                    <template slot="label" slot-scope="{ className, option }">
                      <div class="flex">
                        <span class="flex-shrink-0">
                          <img
                            v-if="option.raw.photo"
                            class="w-4 h-4 rounded-full"
                            :src="option.raw.photo"
                          />
                          <div
                            v-else
                            class="w-4 h-4 rounded-full bg-gray-500"
                          ></div>
                        </span>
                        <div class="flex flex-col ml-2 text-gray-800">
                          {{ option.raw.username }}
                        </div>
                      </div>
                    </template>
                    <template slot="option" slot-scope="{ className, option }">
                      <div :class="className" class="items-start">
                        <span class="flex-shrink-0">
                          <img
                            v-if="option.raw.photo"
                            class="w-4 h-4 rounded-full"
                            :src="option.raw.photo"
                          />
                          <div
                            v-else
                            class="w-4 h-4 rounded-full bg-gray-500"
                          ></div>
                        </span>
                        <div class="text-xs flex flex-col w-full ml-2">
                          <div class="text-gray-800">
                            {{ option.raw.username }}
                          </div>
                          <div class="text-gray-600">
                            {{ option.raw.name }}
                          </div>
                        </div>
                      </div>
                    </template>
                  </TRichSelect>
                  <TInputStyle
                    :value="getItem(room, time, currentDay.date, 'style')"
                    :styles="parent.styles"
                    @input="
                      (v) => setItem(room, time, currentDay.date, { style: v })
                    "
                  />
                  <TInputSelect
                    :value="getItem(room, time, currentDay.date, 'eventType')"
                    :options="eventTypeList"
                    @input="
                      (v) =>
                        setItem(room, time, currentDay.date, { eventType: v })
                    "
                  />
                </template>
              </template>
            </td>
          </tr>
          <tr v-if="editing">
            <td
              class="border-b border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400"
              :colspan="currentDay.rooms.length + 2"
            >
              <input
                v-model="timeName"
                placeholder="Add time slot"
                class="w-full p-2"
                @keydown.enter="addTime"
              />
            </td>
          </tr>
        </table>
      </div>

      <div v-if="editing" class="flex justify-end mt-4">
        <TButton type="primary" label="Save" @click="$emit('save', value)" />
      </div>
    </template>
  </div>
</template>

<script>
import { useEvents } from '~/use/events'

export default {
  props: {
    parent: {
      type: Object,
      default: null,
    },
    value: {
      type: Object,
      default: null,
    },
    editor: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      roomName: '',
      timeName: '',
      selectedDay: 1,
      toggleEditor: false,
      toggleList: false,
    }
  },
  computed: {
    editing() {
      return this.editor && this.toggleEditor
    },
    currentDay() {
      if (!this.value?.days?.length) {
        return null
      }

      return this.value.days[this.selectedDay - 1]
    },
    days: {
      get() {
        return this.value?.days || []
      },
      set(value) {
        const val = this.value || {}
        this.$emit('input', { ...val, days: value })
      },
    },
    items: {
      get() {
        return this.value?.items || []
      },
      set(value) {
        const val = this.value || {}
        this.$emit('input', { ...val, items: value })
      },
    },
  },
  mounted() {
    if (!this.value?.days?.length) {
      this.initDays()
    }
  },
  methods: {
    initDays() {
      const startDate = new Date(this.parent.startDate)
      const endDate = new Date(this.parent.endDate)
      const days = []

      let date = startDate
      while (+date <= +endDate) {
        days.push({
          date: date.toISOString().split('T')[0],
          name: date.toDateString().split(' ')[0],
          rooms: [],
          times: [],
        })

        date = new Date(date.setDate(date.getDate() + 1))
      }

      this.days = days
    },
    addRoom() {
      this.currentDay.rooms.push(this.roomName)
      this.roomName = ''
    },
    addTime() {
      let time = this.timeName
      const minutes = time[0] === '0'
      time = Number(time.replace(/[^0-9]/g, ''))

      if (time < 24 && !minutes) {
        time = time * 100
      }

      let times = [...this.currentDay.times, time]
      times = times.sort((a, b) => a - b)
      this.currentDay.times = times

      this.timeName = ''
    },
    getItem(room, time, date, field) {
      const item = this.items.find(
        (item) => item.room === room && item.time === time && item.date === date
      )

      if (!item) {
        return ''
      }

      if (!field) {
        return item
      }

      return item[field] || ''
    },
    setItem(room, time, date, changes) {
      const index = this.items.findIndex(
        (item) => item.room === room && item.time === time && item.date === date
      )

      if ('name' in changes && !changes.name) {
        if (index !== -1) {
          const items = [...this.items]
          items.splice(index, 1)
          this.items = items
        }

        return
      }

      const items = [...this.items]

      if (index === -1) {
        items.push(this.formatItem({ room, time, date, ...changes }))
      } else {
        items[index] = this.formatItem(
          { ...items[index], ...changes },
          items[index + 1]?.time
        )
      }

      this.items = items
    },
    formatItem(item, endTime) {
      const newItem = { ...item }
      newItem.artist = newItem.artist || ''

      newItem.startDate = +new Date(
        `${item.date}T${this.formatTime(item.time)}`
      )

      newItem.endDate = endTime
        ? +new Date(`${item.date}T${this.formatTime(endTime)}`)
        : this.parent.endDate

      newItem.venue = this.parent.venue
      newItem.parentId = this.parent.id
      newItem.org = {
        username: newItem.artist || this.parent.org.username,
      }
      newItem.eventType = item.eventType || 'Workshop'
      newItem.styles = {
        [item.style]: {
          selected: true,
          level: 'Beginner',
        },
      }

      return newItem
    },
    formatTime(time) {
      const timeString = time.toString()
      const hours = timeString.slice(0, -2)
      const minutes = timeString.slice(-2)

      return `${hours.padStart(2, '0')}:${minutes.padEnd(2, '0')}`
    },
    getTime(time, timeIndex) {
      // show time range
      // const nextTime = this.currentDay.times[timeIndex + 1]

      //  nextTime
      //   ? `${this.formatTime(time)} - ${this.formatTime(nextTime)}`
      //   : `${this.formatTime(time)} - end`

      return this.formatTime(time)
    },
  },
  setup() {
    const { eventTypeList: allTypes } = useEvents()

    const eventTypeList = allTypes.filter((t) => t.festival)

    return {
      eventTypeList,
    }
  },
}
</script>

<template>
  <div>
    <TPopup
      v-if="unlocking"
      title="Unlock All Videos"
      @close="unlocking = false"
    >
      <div class="p-4 max-w-sm">
        <div class="text-sm text-gray-700">
          Get unlimited access to all our dance tutorials with a premium
          membership. Perfect your moves, learn at your pace, and elevate your
          dancing!
        </div>
        <div class="flex justify-center gap-4 mt-4">
          <TButton
            label="Subscribe Now for €10/month"
            variant="primary"
            to="https://buy.stripe.com/dR6bKLcCqfkPedO5kk"
          />
        </div>
      </div>
    </TPopup>

    <div class="rounded overflow-hidden">
      <WTeaserBig
        header="Salsa Lady Styling"
        description="Elegance, majesty, expression. Amazing cuban dancer Yarima Rodríguez shares her secrets for mastering Lady Styling in Son Cubano, helping you enhance your dance technique and unleash your inner grace."
        class="p-4"
      >
        <template slot="preheader">
          <div class="flex justify-center gap-1 text-xs uppercase">
            <div class="text-primary">
              Online
            </div>
            <div>·</div>
            <div>
              Salsa Cubana · Son
            </div>
          </div>
        </template>
        <template slot="subheader">
          <div class="flex justify-center gap-1 text-xs my-2">
            <div>
              2 hours
            </div>
            <div>·</div>
            <div>
              10 views
            </div>
          </div>
          <div
            v-if="!premium"
            class="flex flex-col justify-center items-center"
          >
            <TButton
              class="my-2 no-underline"
              padding="px-32 py-2"
              variant="primary"
              @click="unlockAll()"
              >Unlock All Videos</TButton
            >
            <div class="text-xs">
              €10/month • Unsuscribe anytime
            </div>
          </div>
          <div v-if="premium" class="flex flex-col justify-center items-center">
            <TButton
              class="my-2 no-underline"
              variant="secondary"
              to="/settings"
              >Manage Subscription</TButton
            >
          </div>
        </template>
      </WTeaserBig>

      <mux-player
        :autoplay="false"
        ref="player"
        :playback-id="activeChapter.id"
        :metadata-video-title="activeChapter.title"
        :title="activeChapter.title"
        metadata-viewer-user-id="user-id-vue3007"
        accent-color="#F1023D"
      />

      <TCollapseItem open class="border-b mt-[-5px]" :title="statusLine">
        <div class="border divide-y overflow-hidden">
          <TPlayControls
            v-for="(chapter, index) in chapters"
            :key="chapter.id"
            :title="`${index + 1}. ${chapter.title}`"
            :current="current"
            :video-id="chapter.id"
            :duration="chapter.duration"
            :locked="chapter.locked"
            @click.native="switchVideo(chapter.id)"
          />
        </div>
      </TCollapseItem>
    </div>

    <section class="p-4 border-t border-primary">
      <div class="space-y-2">
        <h3 class="uppercase text-xs text-primary font-extrabold">
          Meet Your Instructor
        </h3>
        <WProfile username="zensual.art" hide-role class="border-none" />
      </div>
    </section>

    <section class="p-4 border-t border-primary">
      <h3 class="uppercase text-xs text-primary font-extrabold py-4">
        Why Choose This Course?
      </h3>
      <div class="flex gap-4 items-start mb-4">
        <div>
          <HeartIcon class="mt-1 text-primary w-6" />
        </div>
        <div>
          <div class="text-lg font-bold">Expert Guidance</div>
          <div class="text-sm text-gray-700 has-links">
            Benefit from Yarima's expertise in Cuban dance, crafted into
            detailed, easy-to-follow video tutorials.
          </div>
        </div>
      </div>
      <div class="flex gap-4 items-start mb-4">
        <div>
          <HeartIcon class="mt-1 text-primary w-6" />
        </div>
        <div>
          <div class="text-lg font-bold">Learn at Your Pace</div>
          <div class="text-sm text-gray-700 has-links">
            Access the entire course content at once and progress through the
            lessons at your own pace.
          </div>
        </div>
      </div>
      <div class="flex gap-4 items-start mb-4">
        <div>
          <HeartIcon class="mt-1 text-primary w-6" />
        </div>
        <div>
          <div class="text-lg font-bold">Global Access</div>
          <div class="text-sm text-gray-700 has-links">
            Enjoy the convenience of accessing the course from anywhere in the
            world, allowing you to learn from any location and on any device.
          </div>
        </div>
      </div>
    </section>

    <section class="p-4 border-t border-primary">
      <h3 class="uppercase text-xs text-primary font-extrabold py-4">
        What You Will Learn
      </h3>
      <div class="flex gap-4 items-start mb-4">
        <div>
          <HeartIcon class="mt-1 text-primary w-6" />
        </div>
        <div>
          <div class="text-lg font-bold">Core Techniques of Lady Styling</div>
          <div class="text-sm text-gray-700 has-links">
            Master the fundamental movements and stylistic nuances specific to
            Son Cubano.
          </div>
        </div>
      </div>
      <div class="flex gap-4 items-start mb-4">
        <div>
          <HeartIcon class="mt-1 text-primary w-6" />
        </div>
        <div>
          <div class="text-lg font-bold">Enhanced Dance Mechanics</div>
          <div class="text-sm text-gray-700 has-links">
            Improve your body alignment, elegance in hand movements, and
            precision in footwork.
          </div>
        </div>
      </div>
      <div class="flex gap-4 items-start mb-4">
        <div>
          <HeartIcon class="mt-1 text-primary w-6" />
        </div>
        <div>
          <div class="text-lg font-bold">Performance and Expression</div>
          <div class="text-sm text-gray-700 has-links">
            Elevate your dance expression, learning to convey stories and
            emotions seamlessly through your movements.
          </div>
        </div>
      </div>
    </section>

    <section v-if="!premium" class="p-4 border-t border-primary">
      <h3 class="uppercase text-xs text-primary font-extrabold py-4">
        Who Should Enroll?
      </h3>
      <div class="text-sm text-gray-700 has-links">
        This course is perfect for dancers with some experience in Son Cubano
        who want to enhance their lady styling skills. If you're looking to
        refine your routines and learn at your own pace, this course is tailored
        for you. Join us to elevate your dance performance with stylish,
        polished moves.
      </div>
    </section>

    <WTeaserBig
      v-if="!premium"
      header="Upgrade to Premium"
      description="Step into the world of Son Cubano and transform your dance technique. Register today to start learning immediately and at your own pace!"
      button="Unlock All Videos"
      button-after="Starting at €10/month for all classes and sessions"
      class="p-4 border-t"
    />
  </div>
</template>

<script>
import '@mux/mux-player'
import { HeartIcon } from '@vue-hero-icons/outline'

export default {
  name: 'MuxDemo',
  layout: 'full',
  components: {
    HeartIcon,
  },
  data: () => ({
    unlocking: false,
    premium: false,
    current: 'sMFZnbe01Tf9Idx01roKDhfkRX1CrgCEL2A702vA00uqUNI',
    chaptersData: [
      {
        id: 'sMFZnbe01Tf9Idx01roKDhfkRX1CrgCEL2A702vA00uqUNI',
        title: 'Intro',
        duration: '2:10',
      },
      {
        id: 'sDfd00Ix01fTI1SOUr4KSDlxBa7Y9Znnj01G8beV01o1Oww',
        title: 'Real-Time Phrase',
        duration: '0:56',
      },
      {
        id: 'qtayNhaSo1ZK3f9tV4ptW6qytQJvcfjgPARgOwTdC7A',
        title: 'Warm-up (part 1)',
        duration: '7:04',
      },
      {
        id: 'KlVsP028ljS8mCfKAYuZAZaL02svlWvps9wxqNfM6009c4',
        title: 'Warm-up (part 2)',
        duration: '4:37',
        locked: true,
      },
      {
        id: 'bXTEloChop02wryBH01llZmFSRAissSaalytIJ7BsV01sw',
        title: 'Phrase (segment 1)',
        duration: '8:24',
        locked: true,
      },
      {
        id: 'fClgWWmDfettXAYVyvAKFshhg22BbyeQW01s1zcissX00',
        title: 'Phrase (segment 2)',
        duration: '7:43',
        locked: true,
      },
      {
        id: 'iB02CO2O54L1Ey017MYfSuqAFj35p8AURFRr01CIyAmZvA',
        title: 'Phrase (segment 3)',
        duration: '7:34',
        locked: true,
      },
      {
        id: 'CS8o1PCs2xFoXFTZ77PuOHRYU8g00f8rXtFCJaerHCpQ',
        title: 'Phrase (segment 4)',
        duration: '9:23',
        locked: true,
      },
      {
        id: '8D8uVRdXY52021wWuntp8545bPjAwjv00016P2fsvh6jDg',
        title: 'Continued Phrase (without music)',
        duration: '1:35',
        locked: true,
      },
      {
        id: 'cuPptg0000eW13qx84pv02m00IgntaKVQf8aaoKXzyolbFg',
        title: 'Details of the arms',
        duration: '4:23',
        locked: true,
      },
      {
        id: 'bn4U1NWEOhNCUeY3lZNUnjFkaY00ueW00qmd6P1UzFmOM',
        title: 'Details of the legs',
        duration: '1:31',
        locked: true,
      },
      {
        id: 'NA00aQiMyfYAs18A3ppGCogK3Q9hO0029HhYqgd3Ehe4Q',
        title: 'Stretching',
        duration: '16:02',
        locked: true,
      },
    ],
  }),
  computed: {
    chapters() {
      return this.chaptersData.map((chapter) => ({
        ...chapter,
        locked: this.premium ? false : chapter.locked,
      }))
    },
    activeChapter() {
      return this.chapters.find((chapter) => chapter.id === this.current)
    },
    statusLine() {
      const activeChapterIndex =
        this.chapters.findIndex((chapter) => chapter.id === this.current) + 1

      const totalChapters = this.chapters.length

      return `Chapter ${activeChapterIndex} of ${totalChapters}: ${this.activeChapter.title}`
    },
  },
  methods: {
    switchVideo(videoId) {
      if (this.chapters.find((chapter) => chapter.id === videoId).locked) {
        this.unlockAll()
        return
      }

      this.current = videoId
    },
    unlockAll() {
      this.$refs.player.pause()
      this.unlocking = true
    },
  },
}
</script>

<template>
  <div>
    <THeader show-logo class="md:hidden" />

    <div class="rounded overflow-hidden">
      <mux-player
        playback-id="exizM1SgPwP6Fw81egITz9sF1irYxvRL1nNsXr9bbiM"
        metadata-video-title="Placeholder (optional)"
        metadata-viewer-user-id="user-id-vue3007"
        accent-color="#F1023D"
      />
    </div>

    <div class="p-4 flex gap-2 border-b">
      <div>
        <div class="flex gap-1 text-xs uppercase">
          <div class="text-primary">
            Online
          </div>
          <div>·</div>
          <div>
            Lady Styling · Salsa Cubana · Son
          </div>
        </div>
        <h1 class="text-2xl font-bold leading-none">Ecstasy of Sensuality</h1>
        <div class="mt-1 flex gap-1 text-xs">
          <div>
            2 hours
          </div>
          <div>·</div>
          <div>
            10 chapters
          </div>
          <div>·</div>
          <div>
            2 students
          </div>
          <div>·</div>
          <div>
            10 views
          </div>
        </div>
      </div>
    </div>

    <div class="p-4 text-sm">
      <p>
        Elevate your dance skills with video course on Lady Styling in Son
        Cubano led by amazing Yarima Rodríguez! Discover the art of movement and
        sensuality. Perfect for dancers ready to transform their style.
      </p>
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

    <section class="p-4 border-t border-primary">
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

    <section class="p-4 border-t border-primary">
      <h3 class="uppercase text-xs text-primary font-extrabold py-4">
        Enroll Now!
      </h3>
      <div class="text-sm text-gray-700 has-links">
        Step into the world of Son Cubano and transform your dance technique.
        Register today to start learning immediately and at your own pace!
      </div>
    </section>
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
}
</script>

<template>
  <div
    v-if="!haveUsername"
    class="font-sans bg-white leading-normal tracking-tight antialiased min-h-screen flex flex-col mx-auto max-w-xl border-r border-l"
  >
    <header class="max-w-sm m-auto pt-8 pb-7 px-3">
      <img src="/img/brand.png" class="max-w-md m-auto" />
      <h1 class="text-3xl text-center font-extrabold px-3 pt-4">
        Share your social media instantly
      </h1>
      <img src="/img/screenshot.png" />
      <p class="max-w-sm m-auto text-center px-3 pb-6 text-lg font-medium">
        Turn a simple handshake into a lasting connection
      </p>

      <div class="max-w-max m-auto w-fit">
        <TButton
          type="primary"
          :to="'/signin?target=nfc/' + pageId + '?updateUsername=true'"
          :allow-guests="true"
          label="Link your Profile"
          class="w-64"
        />
      </div>
    </header>

    <TBenefits
      title="Power of VIP Cards"
      :benefits="[
        'Instant contact exchange',
        'Environmentally friendly',
        'Convenient and easy to use',
        'Affordable',
        'Don&rsquo;t have space constraints',
        'More secure',
      ]"
    />

    <section class="bg-gray-200 p-4 mb-6">
      <h2 class="text-3xl text-center font-extrabold p-3">How it works</h2>

      <div class="max-w-md m-auto">
        <div class="flex items-center">
          <TIcon name="tap-card" />
          <div class="ml-2">
            <h3 class="text-slate-700 text-bold text-lg">Tap the card</h3>
            <p class="text-gray-500 text-sm">
              Tap your VIP Card on your own phone device
            </p>
          </div>
        </div>

        <img src="/img/divider.png" class="my-1" />

        <div class="flex items-center">
          <TIcon name="phone" />
          <div class="ml-2">
            <h3 class="text-slate-700 text-bold text-lg">
              Create and link your profile
            </h3>
            <p class="text-gray-500 text-sm">
              Sign-in and create your WeDance profile so it can be linked to
              your VIP Card
            </p>
          </div>
        </div>

        <img src="/img/divider.png" class="my-1" />

        <div class="flex items-center">
          <TIcon name="card-network" />
          <div class="ml-2">
            <h3 class="text-slate-700 text-bold text-lg">Start networking</h3>
            <p class="text-gray-500 text-sm">
              Share your profile by tapping your VIP Card on other
              people&rsquo;s mobiles and start networking faster
            </p>
          </div>
        </div>
      </div>
    </section>

    <TBenefits
      title="Premium Membership"
      :benefits="[
        'Get special offers from organisers',
        'Exclusive discounts',
        'Access to online classes',
      ]"
    />

    <section class="max-w-md m-auto h-64 p-3 mt-8">
      <h2 class="text-3xl text-center font-extrabold mb-2">Follow us</h2>
      <p class="font-normal text-lg text-center">
        We regularly post event announcements and introduce new members on our
        social media.
      </p>
      <div class="max-w-md m-auto pb-16">
        <div class="flex justify-center gap-3 pt-8">
          <a href="https://www.instagram.com/WeDancePlatform/" target="_blank">
            <TIcon
              name="instagram"
              size="10"
              class="rounded-full p-2"
              style="box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06);"
            />
          </a>
          <a href="https://t.me/WeDanceTravel" target="_blank">
            <TIcon
              name="telegram"
              size="10"
              class="rounded-full p-2"
              style="box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06);"
            />
          </a>
          <a href="https://twitter.com/WeDancePlatform" target="_blank">
            <TIcon
              name="twitter"
              size="10"
              class="rounded-full p-2"
              style="box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06);"
            />
          </a>
          <a
            href="https://www.facebook.com/people/WeDance/100079633097491/"
            target="_blank"
          >
            <TIcon
              name="facebook"
              size="10"
              class="rounded-full p-2"
              style="box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06);"
            />
          </a>
        </div>
      </div>
    </section>
  </div>
  <div v-else>
    Page have username
  </div>
</template>

<script>
import { db } from '~/plugins/firebase'
import { useDoc } from '~/use/doc'
import { useAuth } from '~/use/auth'

export default {
  layout: 'empty',
  async asyncData({ redirect, route }) {
    const { softUpdate } = useDoc('nfc-card')
    let username = ''

    const pageId = route.params.landing
    if (Object.prototype.hasOwnProperty.call(route.query, 'updateUsername')) {
      if (route.query.updateUsername) {
        username = useAuth().username.value

        softUpdate(pageId, { username })

        redirect(302, `/${username}?tryPremium=true`)
      }
    }
    const collection = await db
      .collection('nfc-card')
      .doc(pageId)
      .get()

    const haveUsername = collection.data().username !== ''

    return {
      haveUsername,
      pageId,
    }
  },
}
</script>

<template>
  <div>
    <div class="flex justify-center pt-4">
      <TIcon name="undraw_online_ad" />
    </div>
    <div class="p-4">
      <h1 class="text-3xl font-extrabold text-center">
        Boost Your Dance Event
      </h1>
      <div class="text-center text-lg text-gray-700">
        Add an event in seconds by importing from Facebook, Google Calendar,
        Teamup, Apple Calendar, or manually.
      </div>
      <div class="flex justify-center py-4">
        <TButton type="primary" to="/events/-/import">Add Your Event</TButton>
      </div>
      <section class="mt-16 border-t border-primary">
        <h3 class="uppercase text-xs text-primary font-extrabold py-4">
          Discoverability
        </h3>
        <div class="flex gap-4 items-start mb-4">
          <div>
            <SearchCircleIcon class="mt-1 text-primary w-6" />
          </div>
          <div>
            <div class="text-lg font-bold">
              Appear on Google Search
            </div>
            <div class="text-sm text-gray-700 has-links">
              Your event will be prominently featured on major search engines
              like Google, Bing, and Yandex. We are getting in the
              <strong class="font-bold">top 10</strong>, see for yourself:
              <a href="https://www.google.com/search?q=salsa+parties+munich"
                >salsa parties munich</a
              >,
              <a href="https://www.google.com/search?q=kizomba+courses+havana"
                >kizomba courses havana</a
              >,
              <a href="https://www.google.com/search?q=bachata+parties+augsburg"
                >bachata parties augsburg</a
              >. In 2023 we had
              <strong class="font-bold">14k unique visitors</strong>.
            </div>
          </div>
        </div>
        <div class="flex gap-4 items-start mb-4">
          <div>
            <ShareIcon class="mt-1 text-primary w-6" />
          </div>
          <div>
            <div class="text-lg font-bold">Social Media Reach</div>
            <div class="text-sm text-gray-700 has-links">
              Free publicity on our city-based social media networks. For
              example in Munich we have
              <strong class="font-bold">5k+ followers</strong> on
              <a href="https://intagram.com/WeDanceMunich">Instagram</a>,
              <a href="https://t.me/WeDanceMunich">Telegram</a>,
              <a href="https://www.facebook.com/WeDanceMunich/">Facebook</a>. We
              are <router-link to="/get-involved">expanding</router-link> to
              other cities.
            </div>
          </div>
        </div>
      </section>
      <section class="mt-16 border-t border-primary">
        <h3 class="uppercase text-xs text-primary font-extrabold py-4">
          Promotion
        </h3>
        <div class="flex gap-4 items-start mb-4">
          <div>
            <GiftIcon class="mt-1 text-primary w-6" />
          </div>
          <div>
            <div class="text-lg font-bold">Instagram Lottery</div>
            <div class="text-sm text-gray-700 has-links">
              Boost your event’s visibility with our Instagram Lottery
              Promotions. Engage audiences with exciting chances to win event
              tickets, encouraging likes, comments, and shares to widen your
              reach and create a buzz. See examples for
              <a href="https://www.instagram.com/reel/C4LfvvqCMVR/"
                >@theremixdancefestival</a
              >,
              <a href="https://www.instagram.com/reel/C3GWchmCNbF/"
                >@fiestavenezolanamunich</a
              >,
              <a href="https://www.instagram.com/reel/C2Kh68wC6Wj/"
                >@salsaclubmunich</a
              >.
            </div>
          </div>
        </div>
        <div class="flex gap-4 items-start mb-4">
          <div>
            <SpeakerphoneIcon class="mt-1 text-primary w-6" />
          </div>
          <div>
            <div class="text-lg font-bold">Influencer Marketing</div>
            <div class="text-sm text-gray-700">
              Boost your event with our network of influencers and promoters,
              with transparent and trackable pricing.
            </div>
          </div>
        </div>
      </section>
      <section class="mt-16 border-t border-primary">
        <h3 class="uppercase text-xs text-primary font-extrabold py-4">
          Engagement
        </h3>
        <div class="flex gap-4 items-start mb-4">
          <div>
            <HeartIcon class="mt-1 text-primary w-6" />
          </div>
          <div>
            <div class="text-lg font-bold">Social Proof</div>
            <div class="text-sm text-gray-700">
              Enhance your event's credibility with our Social Proof Toolkit.
              Showcase customer reviews, track event views, display guest
              counts, and highlight artists to build trust and interest in your
              event. This toolkit effectively demonstrates the popularity and
              quality of your event to potential attendees.
            </div>
          </div>
        </div>
        <div class="has-links mb-4">
          <img src="/img/party-example.png" alt="Event Page Example" />
          <div class="pt-1 text-center text-xs text-gray-500">
            <a href="https://wedance.vip/events/tU302ySRZT1LfwZMZASm">Party</a>
            with 27 guests and 299 views
          </div>
        </div>
        <div class="flex gap-4 items-start mb-4">
          <div>
            <BookmarkIcon class="mt-1 text-primary w-6" />
          </div>
          <div>
            <div class="text-lg font-bold">Interactive Scheduling</div>
            <div class="text-sm text-gray-700">
              Enable attendees to bookmark and schedule your events through city
              calendars and your own event programming.
            </div>
          </div>
        </div>
        <div class="has-links">
          <img src="/img/program-example.png" alt="Event Page Example" />
          <div class="pt-1 text-center text-xs text-gray-500">
            <a href="https://wedance.vip/events/TdFbu1f3j8r0gEba09Cf"
              >Festival</a
            >
            with program
          </div>
        </div>
      </section>
      <section class="mt-16 border-t border-primary">
        <h3 class="uppercase text-xs text-primary font-extrabold py-4">
          Community
        </h3>
        <div class="flex gap-4 items-start mb-4">
          <div>
            <LinkIcon class="mt-1 text-primary w-6" />
          </div>
          <div>
            <div class="text-lg font-bold">Build Connections</div>
            <div class="text-sm text-gray-700">
              'Connect' button on your page let attendees sign up to hear about
              your events first. Use this to send them updates and invite them
              to join your social media, like WhatsApp or Instagram, for the
              latest news and event info.
            </div>
          </div>
        </div>

        <div class="flex gap-4 items-start mb-4">
          <div>
            <UserGroupIcon class="mt-1 text-primary w-6" />
          </div>
          <div>
            <div class="text-lg font-bold">Guest Lists</div>
            <div class="text-sm text-gray-700">
              Elevate your event's profile with our Guest List feature. When
              attendees join your event’s Guest List, it not only highlights
              your event on their profiles but also lists it under their
              upcoming events. This visibility draws more attention to your
              event, creating a buzz within the community.
            </div>
          </div>
        </div>

        <div class="flex gap-4 items-start mb-4">
          <div>
            <StarIcon class="mt-1 text-primary w-6" />
          </div>
          <div>
            <div class="text-lg font-bold">Reviews</div>
            <div class="text-sm text-gray-700">
              Attendee feedback is showcased across various sections:
              prominently on the Event and Organizer pages with star ratings and
              review counts, within user 'Stories,' and on the city's 'Ask
              Locals' page. This extensive exposure ensures that positive
              experiences at your events are seen and appreciated widely,
              enhancing your reputation and drawing more attendees.
            </div>
          </div>
        </div>
      </section>
      <section class="mt-16">
        <div class="text-center text-lg text-gray-700">
          Bring your dance event to the spotlight with WeDance. From easy setup
          to boosting visibility, we provide all you need for a successful
          event. Join us and make your event a memorable experience.
        </div>
        <div class="flex justify-center py-4">
          <TButton type="primary" to="/events/-/import">Add Your Event</TButton>
        </div>
      </section>
    </div>
    <HubspotChat />
  </div>
</template>

<script>
import {
  ShareIcon,
  SearchCircleIcon,
  SpeakerphoneIcon,
  BookmarkIcon,
  HeartIcon,
  StarIcon,
  GiftIcon,
  LinkIcon,
  UserGroupIcon,
} from '@vue-hero-icons/outline'

export default {
  layout: 'full',
  components: {
    ShareIcon,
    SearchCircleIcon,
    SpeakerphoneIcon,
    BookmarkIcon,
    HeartIcon,
    StarIcon,
    GiftIcon,
    LinkIcon,
    UserGroupIcon,
  },
}
</script>

<style scoped>
.has-links a {
  @apply text-primary underline;
}

.has-links a:hover {
  @apply no-underline;
}
</style>

<template>
  <div>
    <div class="bg-orange-100 flex justify-center pt-4">
      <TIcon name="find-partner" />
    </div>
    <div class="p-4">
      <h1 class="text-3xl font-extrabold text-center">
        Find Dance Partner
      </h1>
      <div class="text-center text-xl text-gray-700 mb-4">
        Create your profile to start searching for dance partners in your city
      </div>
      <div class="flex gap-4 items-start mb-4">
        <div>
          <UserCircleIcon class="mt-1 text-primary w-6" />
        </div>
        <div>
          <div class="text-lg font-bold">Complete Your Profile</div>
          <div class="text-sm text-gray-700">
            Add your photo and describe the type of dance partner you are
            seeking.
          </div>
        </div>
      </div>
      <div class="flex gap-4 items-start mb-4">
        <div>
          <MailIcon class="mt-1 text-primary w-6" />
        </div>
        <div>
          <div class="text-lg font-bold">Connect with Dancers</div>
          <div class="text-sm text-gray-700">
            Once your profile is set, browse and select up to 5 dancers. Send
            them an invitation, which they can accept or decline.
          </div>
          <div class="text-sm text-orange-500">
            Your invitation expires in 24 hours or once another invitation is
            accepted.
          </div>
        </div>
      </div>
      <div class="flex gap-4 items-start mb-4">
        <div>
          <ClockIcon class="mt-1 text-primary w-6" />
        </div>
        <div>
          <div class="text-lg font-bold">Invitation Timeline</div>
          <div class="text-sm text-gray-700">
            Your profile remains active for a week. You'll receive an email to
            reactivate it.
          </div>
          <div class="text-sm text-orange-500">
            If your invitation is accepted, both profiles will be deactivated
            for search, allowing you to focus on your new dance partnership
          </div>
        </div>
      </div>
      <div class="flex justify-center py-4">
        <TButton type="primary" to="/find-partner/profile">Get Started</TButton>
      </div>
    </div>
  </div>
</template>

<script>
import { MailIcon, UserCircleIcon, ClockIcon } from '@vue-hero-icons/outline'

export default {
  components: {
    MailIcon,
    UserCircleIcon,
    ClockIcon,
  },
}
</script>

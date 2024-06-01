<template>
  <div>
    <div class="p-4">
      <h1 class="text-3xl font-extrabold text-center">
        Support
      </h1>
      <div class="text-center text-lg text-gray-700">
        Have a question about WeDance or an issue? Get in touch and we’ll help
        you out.
      </div>
    </div>

    <w-teaser
      title="Customer Care"
      description="If you need help with something related to your account (can't login, wrong email, etc.) please email us and we will do everything we can to take care of you."
      button="Contact Us"
      href="mailto:support@wedance.vip"
      background="bg-red-100"
    ></w-teaser>

    <div class="mt-4 flex gap-4">
      <w-teaser
        title="Bugs"
        description="If you find a bug that you'd like to report for us to fix, please open an issue on GitHub."
        button="Report bug"
        href="https://github.com/we-dance/platform/issues/new?assignees=razbakov&labels=bug&template=bug.yml&title=%5BBug%5D%3A+"
        background="bg-white"
      ></w-teaser>

      <w-teaser
        title="Features"
        description="If you have a feature you'd like us to consider adding, please share your idea as a discussion on GitHub."
        button="Discuss Ideas"
        href="https://github.com/we-dance/platform/discussions"
        background="bg-white"
      ></w-teaser>
    </div>

    <HubspotChat />
  </div>
</template>

<template>
  <div>
    <div class="bg-dark text-white py-16">
      <div class="mt-8 px-4 mx-auto max-w-2xl text-center">
        <h1 class="text-4xl font-bold leading-tight">
          Find dance partner
        </h1>
        <p class="mt-2 text-xl">
          There are 52 other dancers looking for a partner
        </p>
        <div>
          <TButton class="mt-4 mr-4" type="primary" to="/signin"
            >Start now</TButton
          >
        </div>
      </div>
    </div>

    <div class="p-4 max-w-2xl mx-auto">
      <h2 class="mt-8 mb-10 text-3xl font-serif leading-tight text-center">
        How does it work?
      </h2>
      <div>
        <div class="flex my-10">
          <div class="p-8 flex justify-center items-center text-5xl font-bold">
            1
          </div>
          <div class="px-8 flex items-center justify-start">
            <div>
              <h2 class="font-bold text-xl">Create your profile</h2>
              <p>
                What do you want other dancers to know about you? That's a place
                to share your passion to dance. Present yourself, don't be shy!
                What is important in your partner?
              </p>
            </div>
          </div>
        </div>

        <div class="flex my-10">
          <div class="p-8 flex justify-center items-center text-5xl font-bold">
            2
          </div>
          <div class="px-8 flex items-center justify-start">
            <div>
              <h2 class="font-bold text-xl">See dancers around</h2>
              <p>
                Read profiles of others and contact them if you feel you are a
                good match.
              </p>
            </div>
          </div>
        </div>

        <div class="flex my-10">
          <div class="p-8 flex justify-center items-center text-5xl font-bold">
            3
          </div>
          <div class="px-8 flex items-center justify-start">
            <div>
              <h2 class="font-bold text-xl">Get recommendations</h2>
              <p>
                Once a week our robot will try to connect best matches. It's
                still up to you what to do next.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'public'
}
</script>

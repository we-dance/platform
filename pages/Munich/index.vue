<template>
  <div>
    <portal to="title">
      <h1 class="ml-1 font-lato text-lg font-bold">
        Munich
      </h1>
    </portal>

    <div class="flex border-b divide-x text-center text-sm">
      <router-link
        to="/Munich"
        class="px-4 py-2 uppercase flex-grow text-primary border-b border-primary"
      >
        News
      </router-link>
      <router-link to="/Munich/events" class="px-4 py-2 uppercase flex-grow"
        >Events</router-link
      >
      <router-link to="/Munich/community" class="px-4 py-2 uppercase flex-grow"
        >Community</router-link
      >
    </div>

    <TPostList />
  </div>
</template>

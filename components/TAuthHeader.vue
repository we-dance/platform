<template>
  <TwTabs
    :tabs="[
      {
        name: 'Login',
        to: localePath('/signin'),
        current: $route.path.includes('/signin'),
      },
      {
        name: 'Register',
        to: localePath('/register'),
        current: $route.path.includes('/register'),
      },
    ]"
  />
</template>
<script>
export default {}
</script>

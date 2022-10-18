<template>
  <main>
    <THeader title="Events" />
    <div>Redirecting to {{ targetCity }}</div>
  </main>
</template>

<script>
import { onMounted, ref } from 'vue-demi'
import { useCities } from '~/use/cities'
import { useDoc } from '~/use/doc'
import { useRouter } from '~/use/router'

export default {
  name: 'Events',
  setup() {
    const { currentCity } = useCities()
    const { router } = useRouter()
    const { find: findCity, exists: cityExists, doc: city } = useDoc('cities')
    const { find: findProfile, exists: profileExists, create } = useDoc(
      'profiles'
    )
    const targetCity = ref('')

    onMounted(async () => {
      if (!currentCity.value) {
        router.push('/cities')

        return
      }

      await findCity('location.place_id', currentCity.value)

      if (!cityExists.value) {
        console.log('City is not listed')

        return
      }

      await findProfile('username', city.value.name)

      if (!profileExists.value) {
        console.log(`Creating profile for ${city.value.name}`)

        await create({
          username: city.value.name,
          name:
            city.value.location.locality + ', ' + city.value.location.country,
          type: 'City',
          place: currentCity.value,
        })
      }

      targetCity.value = city.value.name
      router.push(`/${targetCity.value}`)
    })

    return {
      targetCity,
    }
  },
}
</script>

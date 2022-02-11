<template>
  <div class="block h-screen w-full">
    <input ref="place" v-model="value" class="h-5 w-1/2 bg-gray-200" />
    <button class="bg-blue-500" @click="save">{{ title }}</button>
    <div id="map" class="mt-5 h-1/2 w-1/2 bg-gray-500"></div>
  </div>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/firestore'
import { getGoogle } from '~/use/google'

export default {
  data: () => ({
    value: '',
    result: '',
    title: 'Save',
  }),
  methods: {
    save() {
      this.getDateFromText(this.value)
    },
    async getDateFromText(input) {
      const google = await getGoogle()
      const sydney = new google.maps.LatLng(-33.867, 151.195)
      const map = new google.maps.Map(document.getElementById('map'), {
        center: sydney,
        zoom: 15,
      })
      const service = new google.maps.places.PlacesService(map)
      const request = {
        query: input,
        fields: ['place_id', 'formatted_address', 'name'],
      }

      let doc
      service.findPlaceFromQuery(request, async function (results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          console.log(results[0].name)
          const firestore = firebase.firestore()
          const collection = firestore.collection('venues')
          doc = await collection.doc(results[0].place_id).get()
          if (!doc.exists) {
            await collection.doc(results[0].place_id).set({
              name: results[0].name,
              id: results[0].place_id,
              rooms: '',
              map: '',
              address: results[0].formatted_address,
              createdAt: Date.now(),
            })
            doc = await collection.doc(results[0].place_id).get()
          }
        } else {
          console.log('failed :(')
        }
      })
      console.log(doc)
      return doc
    },
  },
}
</script>

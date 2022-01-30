import firebase from 'firebase/app'
import 'firebase/firestore'
import { get } from 'lodash'
import { createGlobalState, when } from '@vueuse/core'
import { computed, ref } from '@nuxtjs/composition-api'
import { useAuth } from '~/use/auth'
import { useDoc } from '~/use/doc'
import { getArrayFromHash } from '~/utils'

export async function cache(name, keyField, check, fields) {
  const db = firebase.firestore()
  const collection = await db.collection(name).get()

  const items = {}

  for (const doc of collection.docs) {
    const item = doc.data()
    item.id = doc.id
    const keyValue = get(item, keyField)

    if (check && !check(item)) {
      continue
    }

    if (!fields) {
      items[keyValue] = item
      continue
    }

    for (const field of fields) {
      if (item[field]) {
        items[keyValue] = items[keyValue] || {}
        items[keyValue][field] = item[field]
      }
    }
  }

  return items
}

export async function warmup() {
  const db = firebase.firestore()

  const profiles = await cache('profiles', 'id', (d) => d.username, [
    'username',
    'photo',
    'height',
    'weight',
    'bio',
    'community',
    'locales',
  ])
  const cities = await cache('cities', 'location.place_id', false, [
    'name',
    'location',
  ])

  await db
    .collection('app')
    .doc('v2')
    .set({
      profiles,
      cities,
    })
}

export async function cacheCity(placeId, data) {
  const db = firebase.firestore()
  await db
    .collection('app')
    .doc('v2')
    .update({ [`cities.${placeId}`]: data })
}

export const useCache = createGlobalState(() => {
  const db = firebase.firestore()
  const result = ref({})

  db.collection('app')
    .doc('v2')
    .get()
    .then((doc) => {
      result.value = doc.data()
    })

  return result
})

export const posterLabelColors = {
  profiles: 'bg-green-500',
  events: 'bg-red-500',
  posts: 'bg-orange-500',
}

export const getCityLabel = (doc) => `${doc.name}, ${doc.location.country}`

export const useApp = () => {
  const db = firebase.firestore()
  const { uid, profile, updateProfile } = useAuth()
  const { create, update } = useDoc('cities')

  const cache = useCache()

  const cities = computed(() =>
    cache.value ? getArrayFromHash(cache.value.cities) : []
  )

  const getPosterLabelColor = (collection, type) => {
    return posterLabelColors[collection] || 'bg-indigo-500'
  }

  const read = (collection, id, field) => {
    if (
      !cache.value ||
      !collection ||
      !id ||
      !cache.value[collection] ||
      !cache.value[collection][id]
    ) {
      return ''
    }

    if (!field) {
      return cache.value[collection][id]
    }

    return cache.value[collection][id][field]
  }

  const mapDetails = (item) => {
    return {
      ...item,
      createdByUsername: item.createdBy
        ? read('profiles', item.createdBy, 'username')
        : '',
    }
  }

  const getCityHistory = async () => {
    if (!uid.value) {
      return []
    }

    await when(profile).not.toBeNull()
    await when(cache).not.toBeNull()

    if (!profile.value.cities) {
      return []
    }

    const favCities = profile.value.cities

    return cities.value.filter((c) => favCities[c.location.place_id])
  }

  const getCommunity = async (placeId) => {
    const snapshot = await db
      .collection('cities')
      .where('location.place_id', '==', placeId)
      .get()

    if (!snapshot.docs.length) {
      return false
    }

    const result = {
      ...snapshot.docs[0].data(),
      id: snapshot.docs[0].id,
    }

    return result
  }

  const addCommunity = async (address) => {
    const community = await getCommunity(address.place_id)

    if (!community) {
      const item = {
        name: address.locality.replace(' ', ''),
        telegram: '',
        hits: 1,
        status: 'requested',
        location: address,
      }

      await create(item)

      await cacheCity(address.place_id, {
        name: item.name,
        location: item.location,
      })
    } else {
      await update(community.id, { hits: parseInt(community.hits || 1) + 1 })
    }
  }

  const removeCityHistory = async (placeId) => {
    await updateProfile({
      [`cities.${placeId}`]: firebase.firestore.FieldValue.delete(),
    })
  }

  const addCityHistory = async (address) => {
    if (!address?.place_id) {
      return
    }

    const placeId = address.place_id

    if (
      uid.value &&
      (!profile.value.cities || !profile.value.cities[placeId])
    ) {
      await updateProfile({
        [`cities.${placeId}`]: true,
      })
    }

    await addCommunity(address)
  }

  const getPlace = (placeId) => {
    if (!placeId) {
      return {
        placeId: '',
        name: 'Anywhere',
        loaded: true,
      }
    }

    if (!cache.value) {
      return {
        placeId,
        name: '<City>',
        loaded: false,
      }
    }

    return cache.value.cities[placeId]
  }

  const getCity = (placeId) => {
    if (!placeId) {
      return ''
    }

    if (!cache.value?.cities) {
      return ''
    }

    return cache.value.cities[placeId]?.name
  }

  return {
    read,
    cache,
    cities,
    getPosterLabelColor,
    mapDetails,
    getCityHistory,
    addCityHistory,
    getCity,
    removeCityHistory,
    getPlace,
  }
}

export const useFullItems = (docs) => {
  const { mapDetails } = useApp()

  const items = computed(() => (docs.value ? docs.value.map(mapDetails) : []))

  return {
    items,
  }
}

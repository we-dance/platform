import Vue from 'vue'
import features from 'platform-detect'
import ls from 'local-storage'
import { utm } from 'url-utm-params'
import { isSameDay } from 'date-fns'
import { toRefs } from '@vue/composition-api'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import clean from 'lodash-clean'
import useRouter from '~/use/router'
import { getDateObect } from '~/utils'

const state = Vue.observable({
  loading: true,
  signingIn: false,
  uid: null,
  profile: null,
  account: null,
  initialized: false,
  marketing: null,
  error: null
})

export default () => {
  const { router, route } = useRouter()

  if (window) {
    setMarketing()

    const uid = ls('uid')

    if (uid) {
      state.uid = uid
    }
  }

  const isAdmin = () => !!state.uid && !!state.account && !!state.account.admin

  if (!state.initialized) {
    firebase.auth().onAuthStateChanged(setUser)

    if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
      signInWithEmailLink()
    }

    state.initialized = true
  }

  const isAccountConfirmed = () =>
    !!state.uid && !!state.account && !!state.account.confirmed

  const firestore = firebase.firestore()

  function getReferrer() {
    const payload = document.referrer

    if (!payload) {
      return ''
    }
    if (payload.includes('firebaseapp.com')) {
      return ''
    }
    if (payload.includes('localhost')) {
      return ''
    }
    if (payload.includes('we-dance.app')) {
      return ''
    }
    if (payload.includes('wedance.netlify.app')) {
      return ''
    }

    return payload
  }

  function setMarketing() {
    state.marketing = ls('marketing')

    const languages = window?.navigator?.languages || []
    const languageString = languages.length
      ? languages[0]
      : window?.navigator?.userLanguage || window?.navigator?.language || ''

    const [language, locale] = languageString
      .replace('-', '_')
      .toLowerCase()
      .split('_')

    const width =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth

    const height =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight

    const marketing = {
      updatedAt: new Date(),
      timezone: new Date().toString().match(/([A-Z]+[+-][0-9]+)/)[1],
      referrer: getReferrer(),
      ref: router?.currentRoute?.query?.ref || '',
      fbclid: router?.currentRoute?.query?.fbclid || '',
      gclid: router?.currentRoute?.query?.gclid || '',
      utms: utm(document.location.href),
      language,
      locale,
      languages,
      mode: clean(features),
      screen: {
        width,
        height
      }
    }

    if (!state.marketing) {
      state.marketing = marketing
      ls('marketing', marketing)
    }

    ls('session', marketing)
  }

  function can(action, collection, object) {
    if (isAdmin()) {
      return true
    }
    if (action === 'add') {
      return !!state.uid
    }
    if (action === 'edit') {
      return !object || object.createdBy === state.uid
    }
    if (action === 'remove') {
      return object && object.createdBy === state.uid
    }
  }

  async function setUser(user) {
    if (user) {
      state.uid = user.uid
      ls('uid', user.uid)
    } else {
      state.loading = false
      state.uid = null
    }

    if (!state.uid) {
      ls.remove('uid')
      state.account = null
      state.profile = null
      return
    }

    const account = await loadAccount()

    if (!account) {
      const newAccount = {
        createdBy: state.uid,
        createdAt: +new Date(),
        name: user.displayName ?? '',
        email: user.email ?? '',
        photo: user.photoURL ?? '',
        timezone: new Date().toString().match(/([A-Z]+[+-][0-9]+)/)[1],
        marketing: state.marketing
      }

      await firestore
        .collection('accounts')
        .doc(state.uid)
        .set(newAccount)

      await loadAccount()
    }

    const lastLoginAt = new Date()

    const pwaUsed = state.account.pwaUsed || features.pwa

    const daysUsed =
      (state.account.daysUsed || 0) +
      (isSameDay(getDateObect(state.account.lastLoginAt), lastLoginAt) ? 0 : 1)

    await firestore
      .collection('accounts')
      .doc(state.uid)
      .update({
        lastLoginAt,
        daysUsed,
        pwaUsed
      })

    if (!state.account.marketing) {
      await firestore
        .collection('accounts')
        .doc(state.uid)
        .update({
          marketing: {
            ...state.marketing,
            existing: true
          }
        })
    }

    await loadProfile()
  }

  async function getAccount() {
    if (!state.account) {
      await loadAccount()
    }

    return state.account
  }

  async function loadAccount() {
    state.loading = true

    const doc = await firestore
      .collection('accounts')
      .doc(state.uid)
      .get()

    if (!doc.exists) {
      return false
    }

    state.account = doc.data()
    state.loading = false

    return true
  }

  async function loadProfile() {
    if (!state.uid) {
      state.profile = null
      return
    }

    state.loading = true

    const doc = await firestore
      .collection('profiles')
      .doc(state.uid)
      .get()

    if (!doc.exists) {
      const profile = {
        createdBy: state.uid,
        createdAt: +new Date()
      }

      await firestore
        .collection('profiles')
        .doc(state.uid)
        .set(profile)

      state.profile = profile
    } else {
      state.profile = doc.data()
    }

    state.loading = false
  }

  async function updateProfile(data) {
    if (!state.uid) {
      return
    }

    state.loading = true

    const changes = {
      updatedAt: +new Date(),
      ...data
    }

    await firestore
      .collection('profiles')
      .doc(state.uid)
      .update(changes)

    loadProfile()
  }

  async function updateAccount(data) {
    if (!state.uid) {
      return
    }

    state.loading = true

    const changes = {
      updatedAt: +new Date(),
      ...data
    }

    await firestore
      .collection('accounts')
      .doc(state.uid)
      .update(changes)

    await loadAccount()
  }

  async function signOut() {
    state.loading = true

    await firebase.auth().signOut()
    setUser(null)

    state.loading = false
    state.signingIn = false
    state.error = null
  }

  async function signInAnonymously() {
    await firebase.auth().signInAnonymously()
  }

  async function signInWithEmailLink() {
    const link = window.location.href

    state.signingIn = true

    const email = route.query.email

    try {
      await firebase.auth().signInWithEmailLink(email, link)
    } catch (e) {
      state.error = e
    }

    state.signingIn = false
  }

  async function sendSignInLinkToEmail(email) {
    const connector = window.location.href.includes('?') ? '&' : '?'
    const url = window.location.href + connector + 'email=' + email
    const actionCodeSettings = {
      url,
      handleCodeInApp: true
    }

    try {
      await firebase.auth().sendSignInLinkToEmail(email, actionCodeSettings)
    } catch (e) {
      state.error = e
    }
  }

  function signInWithGoogle() {
    state.signingIn = true

    const provider = new firebase.auth.GoogleAuthProvider()
    provider.addScope('https://www.googleapis.com/auth/userinfo.email')
    firebase.auth().signInWithRedirect(provider)
  }

  return {
    ...toRefs(state),
    updateProfile,
    updateAccount,
    setUser,
    signInWithGoogle,
    sendSignInLinkToEmail,
    signOut,
    isAccountConfirmed,
    isAdmin,
    getAccount,
    can,
    signInAnonymously,
    signInWithEmailLink
  }
}

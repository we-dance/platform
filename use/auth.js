import Vue from 'vue'
import features from 'platform-detect'
import ls from 'local-storage'
import { utm } from 'url-utm-params'
import { isSameDay } from 'date-fns'
import { computed, toRefs } from '@nuxtjs/composition-api'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import { useRouter } from '~/use/router'
import { getDateObect, getLanguages } from '~/utils'
import { useDoc } from '~/use/doc'

const state = Vue.observable({
  loading: true,
  profileLoaded: false,
  signingIn: false,
  uid: null,
  profile: null,
  username: null,
  account: null,
  initialized: false,
  marketing: null,
  error: null,
  showAuthPopup: false,
  authTargetQuery: null,
  guest: false,
  featureFindPartner: false,
})

export const useAuth = () => {
  const { router, route } = useRouter()

  function toggleGuest() {
    state.guest = !state.guest
    if (state.guest) {
      alert(
        'You are now browsing as a guest. Reload page to become editor again.'
      )
    }
  }

  const isAdmin = (forceCheck = false) => {
    if (state.guest) {
      return false
    }

    const permission = !!state.uid && !!state.account && !!state.account.admin

    if (forceCheck) {
      return permission
    }

    return ls('admin') && permission
  }

  const isEditor = () =>
    !!state.uid && !!state.account && !!state.account.editor

  if (!state.initialized && process.client) {
    getRedirectResult().then(() => {
      firebase.auth().onAuthStateChanged(setUser)

      if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
        signInWithEmailLink()
      }
    })

    state.initialized = true

    setMarketing()

    const uid = ls('uid')

    if (uid) {
      state.uid = uid
    }
  }

  if (!ls('invitedBy')) {
    ls('invitedBy', router?.currentRoute?.query?.r || '')
  }

  const username = computed(() => state.profile?.username)

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
    if (payload.includes('wedance.vip')) {
      return ''
    }
    if (payload.includes('wedance.netlify.app')) {
      return ''
    }

    if (payload.includes('wedance-4abe3.firebaseapp.com')) {
      return ''
    }

    return payload
  }

  function setMarketing() {
    state.marketing = ls('marketing')
    ls('invitedBy', router?.currentRoute?.query?.r || '')

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
      invitedBy: router?.currentRoute?.query?.r || '',
      from: router?.currentRoute?.query?.from || '',
      promo: router?.currentRoute?.query?.promo || '',
      fbclid: router?.currentRoute?.query?.fbclid || '',
      gclid: router?.currentRoute?.query?.gclid || '',
      utms: utm(document.location.href),
      start: document.location.href,
      screen: {
        width,
        height,
      },
    }

    if (!state.marketing) {
      state.marketing = marketing
      ls('marketing', marketing)
    }

    ls('session', marketing)
  }

  function can(action, collection, object) {
    if (state.guest) {
      return false
    }

    if (!object || !object.createdBy) {
      return true
    }

    if (isAdmin()) {
      return true
    }

    const add = !!state.uid
    let edit = object.createdBy === state.uid

    if (
      collection === 'profiles' &&
      object.team?.length &&
      object.team.find((member) => member.id === state.uid)
    ) {
      edit = true
    }

    if (collection === 'events') {
      if (object.artistsList?.includes(state.username)) {
        edit = true
      }

      if (object.org?.id === state.uid) {
        edit = true
      }

      if (object.venue?.username === state.username) {
        edit = true
      }
    }

    const remove = object.createdBy === state.uid

    const actions = {
      add,
      edit,
      remove,
    }

    return actions[action]
  }

  async function setUser(user) {
    if (user) {
      state.uid = user.uid
      state.showAuthPopup = false
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
    const isNewUser = !account

    if (isNewUser) {
      const newAccount = {
        createdBy: state.uid,
        createdAt: +new Date(),
        name: user.displayName ?? '',
        email: user.email ?? '',
        photo: user.photoURL ?? '',
        timezone: new Date().toString().match(/([A-Z]+[+-][0-9]+)/)[1],
        zone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        invitedBy: ls('invitedBy') || '',
      }

      await firestore
        .collection('accounts')
        .doc(state.uid)
        .set(newAccount)

      await loadAccount()
    }

    await loadProfile()

    const lastLoginAt = new Date()
    const pwaUsed =
      state.profile?.pwaUsed || state.account?.pwaUsed || features.pwa
    const daysUsed =
      (state.profile?.daysUsed || state.account?.daysUsed || 0) +
      (isSameDay(
        getDateObect(state.profile?.lastLoginAt || state.account?.lastLoginAt),
        lastLoginAt
      )
        ? 0
        : 1)

    await firestore
      .collection('profiles')
      .doc(state.uid)
      .update({
        lastLoginAt: +lastLoginAt,
        pwaUsed,
        daysUsed,
      })

    await updateTimeZone()
    await loadProfile()

    firestore.collection('marketing').add({
      uid: state.uid,
      isNewUser,
      target: ls('target'),
      ...state.marketing,
    })
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
    state.showAuthPopup = false
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
        id: state.uid,
        createdBy: state.uid,
        createdAt: +new Date(),
        locales: getLanguages(),
        timezone: new Date().toString().match(/([A-Z]+[+-][0-9]+)/)[1],
        invitedBy: ls('invitedBy'),
        username: ls('username'),
        visibility: 'Members',
        type: 'Dancer',
        name: ls('username'),
        gender: ls('gender'),
        place: ls('place'),
      }

      await firestore
        .collection('profiles')
        .doc(state.uid)
        .set(profile)

      ls.remove('username')
      ls.remove('gender')
      ls.remove('place')

      state.profile = profile
    } else {
      state.profile = doc.data()
      state.profile.id = doc.id
      state.username = state.profile.username
    }

    state.loading = false
    state.profileLoaded = true
  }

  async function updateProfile(data) {
    if (!state.uid) {
      return
    }

    state.loading = true

    const changes = {
      updatedAt: +new Date(),
      ...data,
    }

    await firestore
      .collection('profiles')
      .doc(state.uid)
      .update(changes)

    await loadProfile()
  }

  async function updateEmail(email) {
    const user = firebase.auth().currentUser
    await user.updateEmail(email)
  }

  async function updatePassword(password) {
    const user = firebase.auth().currentUser
    await user.updatePassword(password)
  }

  async function updateAccount(data) {
    if (!state.uid) {
      return
    }

    state.loading = true

    const changes = {
      updatedAt: +new Date(),
      ...data,
    }

    await firestore
      .collection('accounts')
      .doc(state.uid)
      .update(changes)

    await loadAccount()
  }

  async function deleteAccount() {
    const { remove: removeAccount } = useDoc('accounts')
    const { remove: removeProfile } = useDoc('profiles')

    await removeProfile(state.uid)
    await removeAccount(state.uid)
    const user = firebase.auth().currentUser
    await user.delete()
    await signOut()
  }

  async function signOut() {
    state.loading = true

    await firebase.auth().signOut()
    setUser(null)

    state.loading = false
    state.signingIn = false
    state.error = null
    state.profileLoaded = false
  }

  async function signInAnonymously() {
    await firebase.auth().signInAnonymously()
  }

  async function signInWithEmailLink() {
    const link = window.location.href

    state.signingIn = true

    const email = ls('email') || route.query.email

    try {
      await firebase.auth().signInWithEmailLink(email, link)
    } catch (e) {
      state.error = e

      throw e
    }

    state.signingIn = false
  }

  async function sendSignInLinkToEmail(email) {
    ls('email', email)

    const url = window.location.origin + '/signin?email=' + email
    const actionCodeSettings = {
      url,
      handleCodeInApp: true,
    }

    try {
      await firebase.auth().sendSignInLinkToEmail(email, actionCodeSettings)
      return true
    } catch (e) {
      state.error = e
      return false
    }
  }

  async function sendPasswordResetEmail(email) {
    try {
      await firebase.auth().sendPasswordResetEmail(email)
      return true
    } catch (e) {
      state.error = e
      return false
    }
  }

  async function createUserWithEmailAndPassword(
    email,
    password,
    username,
    place,
    gender
  ) {
    try {
      ls('username', username)
      ls('place', place)
      ls('gender', gender)
      const firebaseUser = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
      firebaseUser.sendEmailVerification()
    } catch (e) {
      state.error = e
    }
  }
  async function updateTimeZone() {
    const { zone } = await getAccount()
    if (!zone) {
      await updateAccount({
        zone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      })
    }
  }
  async function signUserIn(email, password) {
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password)
    } catch (e) {
      state.error = e
    }
  }

  function signInWithGoogle() {
    state.signingIn = true

    const provider = new firebase.auth.GoogleAuthProvider()
    provider.addScope('profile')
    provider.addScope('email')
    firebase.auth().signInWithRedirect(provider)
  }

  function signInWithGooglePopup() {
    state.signingIn = true

    const provider = new firebase.auth.GoogleAuthProvider()
    provider.addScope('profile')
    provider.addScope('email')
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(function(result) {
        const user = result.user
        setUser(user)
        state.signingIn = false
      })
  }

  function signInWithFacebook() {
    state.signingIn = true

    const provider = new firebase.auth.FacebookAuthProvider()
    firebase.auth().signInWithRedirect(provider)
  }

  async function getRedirectResult() {
    try {
      const result = await firebase.auth().getRedirectResult()
      setUser(result.user)
    } catch (error) {
      state.error = error
      throw error
    }
  }

  return {
    ...toRefs(state),
    username,
    updateTimeZone,
    getRedirectResult,
    updateProfile,
    updateAccount,
    setUser,
    signOut,
    isAccountConfirmed,
    isAdmin,
    isEditor,
    getAccount,
    can,
    signInAnonymously,
    signUserIn,
    signInWithGoogle,
    signInWithGooglePopup,
    signInWithFacebook,
    sendSignInLinkToEmail,
    signInWithEmailLink,
    updatePassword,
    updateEmail,
    createUserWithEmailAndPassword,
    deleteAccount,
    sendPasswordResetEmail,
    toggleGuest,
    loadProfile,
  }
}

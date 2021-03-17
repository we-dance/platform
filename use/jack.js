import firebase from 'firebase/app'
import 'firebase/firestore'
import { createGlobalState } from '@vueuse/core'
import { useFirestore } from '@vueuse/firebase'

const db = firebase.firestore()

export const useApp = createGlobalState(() =>
  useFirestore(db.collection('app'))
)

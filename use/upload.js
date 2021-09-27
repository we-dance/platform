import firebase from 'firebase/app'
import 'firebase/storage'
import { v4 as uuidv4 } from 'uuid'
import { useAuth } from '~/use/auth'

export const useUpload = () => {
  const { uid } = useAuth()

  function upload(file, onChange) {
    const id = uuidv4()

    const metadata = {
      uploadedBy: uid.value,
    }

    return new Promise((resolve) => {
      const ref = `media/${uid.value}/${id}`
      const uploadTask = firebase
        .storage()
        .ref()
        .child(ref)
        .put(file, metadata)

      uploadTask.on(
        'state_changed',
        (sp) => {
          if (onChange) {
            onChange(sp)
          }
        },
        null,
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            resolve({
              url: downloadURL,
              path: ref,
              name: file.name,
              size: file.size,
              updatedAt: file.lastModified,
            })
          })
        }
      )
    })
  }

  return {
    upload,
  }
}

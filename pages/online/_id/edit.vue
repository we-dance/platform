<template>
  <div class="bg-dark md:py-4 min-h-screen">
    <div
      class="mx-auto w-full max-w-lg md:rounded md:border md:shadow bg-white"
    >
      <TForm
        v-model="item"
        :edit-creator="isAdmin()"
        :fields="courseFields"
        show-cancel
        vertical
        class="bg-white p-4 space-y-4"
        @save="saveItem"
        @cancel="cancel"
      />
    </div>
  </div>
</template>

<script>
import 'firebase/firestore'
import { useAuth } from '~/use/auth'
import { useDoc } from '~/use/doc'
import { useRouter } from '~/use/router'
import { useCourses } from '~/use/courses'

export default {
  name: 'CourseEdit',
  layout: 'empty',
  middleware: ['auth'],
  methods: {
    cancel() {
      this.$router.go(-1)
    },
    async saveItem(data) {
      let result

      if (data.id) {
        this.$track('update_course')
        result = await this.update(data.id, data)
      } else {
        this.$track('create_course')
        result = await this.create(data)
      }

      this.view(result.id)
    },
    view(id) {
      if (!id) {
        this.$router.push(this.localePath(`/${this.profile?.username}`))
      }

      this.$router.push(this.localePath(`/online/${id}`))
    },
  },
  setup() {
    const { courseFields } = useCourses()
    const { can, profile, isAdmin, uid } = useAuth()
    const { params } = useRouter()

    const collection = 'courses'

    const { doc: item, load, update, create, remove, loading } = useDoc(
      collection
    )

    if (params.id !== '-') {
      load(params.id)
    }

    return {
      loading,
      item,
      can,
      collection,
      update,
      create,
      remove,
      profile,
      isAdmin,
      uid,
      courseFields,
    }
  },
}
</script>

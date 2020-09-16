<template>
  <main>
    <div class="mb-4">
      <TButton @click="importAsset">Update styles</TButton>
    </div>
    <TCardList
      :collection="collection"
      :title="title"
      :add="add"
      :fields="fields"
      :item-label="getLabel"
    >
      <template v-slot:default="{ item }">
        <div class="rounded bg-white mb-4 shadow border p-4">
          <div class="text-xs">
            {{ getLabel(item) }}
          </div>
        </div>
      </template>
    </TCardList>
  </main>
</template>

<script>
import stylesAsset from '~/assets/content/styles'
import { camelize } from '~/utils'
import useDoc from '~/use/doc'

export default {
  setup() {
    const collection = 'styles'
    const title = 'Dance Styles'
    const add = 'Add'
    const fields = [
      {
        name: 'id'
      },
      {
        name: 'name'
      },
      {
        name: 'active'
      },
      {
        name: 'alternativeNames'
      },
      {
        name: 'countryOfOrigin'
      },
      {
        name: 'danceStyleFamily'
      },
      {
        name: 'danceStyleRegion'
      },
      {
        name: 'isGroupDance'
      },
      {
        name: 'isPartnerDance'
      },
      {
        name: 'mainGenre'
      },
      {
        name: 'musicGenres'
      },
      {
        name: 'nameOfGenresRelatedTo'
      },
      {
        name: 'root'
      },
      {
        name: 'timing'
      },
      {
        name: 'type'
      }
    ]

    const getLabel = (item) => item.id

    const { set } = useDoc(collection)

    return {
      set,
      collection,
      title,
      add,
      fields,
      getLabel
    }
  },
  methods: {
    importAsset() {
      const names = Object.keys(stylesAsset)
      const styles = {}

      names.forEach((name) => {
        let id = camelize(name)
        id = id.charAt(0).toUpperCase() + id.slice(1)

        const item = {
          id,
          name
        }

        const properties = Object.keys(stylesAsset[name])
        properties.forEach((propertyName) => {
          const propertyId = camelize(propertyName)
          item[propertyId] = stylesAsset[name][propertyName]
        })

        this.set(id, item)
        styles[id] = item
      })
    }
  }
}
</script>

<style scoped>
h4 {
  font-size: 16px;
  font-weight: bold;
  margin: 0.5em 0;
}
.genre-item {
  background: #eee;
  margin: 5px;
  -webkit-user-select: none;
  cursor: pointer;
}
.kid {
  background: #ddd;
}
.genre-item-label {
  color: #333;
  font-size: 18px;
}
.active {
  background: #333;
}

.active .genre-item-label {
  color: #fff;
}
</style>

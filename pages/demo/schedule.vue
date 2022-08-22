<template>
  <div>
    <TForm v-model="data" :fields="schema" class="p-10" />
  </div>
</template>

<script>
import { ref } from '@nuxtjs/composition-api'
export default {
  setup() {
    const data = ref({
      name: 'Salsa Party',
      artists: [
        {
          youtube: '',
          username: 'AnnaMil',
          id: '8yp79cUd0jZtnVn34NxhBuMpxrx1',
          facebook: 'https://facebook.com/annamilite88',
          photo:
            'https://firebasestorage.googleapis.com/v0/b/wedance-4abe3.appspot.com/o/media%2F8yp79cUd0jZtnVn34NxhBuMpxrx1%2F73281681-98ab-4760-a079-f86a5419664e?alt=media&token=44127e9d-11d7-42fd-bcdb-ed39fc4c0652',
          bio: '🎼 Music - Lover & Passionate - Dancer 💃',
          instagram: 'https://instagram.com/milite_anna',
          name: 'Anna',
          tiktok: '',
        },
        {
          facebook: '',
          id: 'SIdi7ZEbwxq66shZD2nq',
          tiktok: '',
          photo:
            'https://storage.googleapis.com/download/storage/v1/b/wedance-4abe3.appspot.com/o/share%2Fiansalvadorlopez.png?generation=1655237409450420&alt=media',
          bio:
            '📍BLN 🇩🇪 Origin 🇵🇭°Professional dancer•Certified Choreographer•Artist of 30 dance-styles•@islaphotoart 📲•Winner of:🏆Streetdance 64x🏆Salsa 12x',
          instagram: 'https://instagram.com/iansalvadorlopez',
          youtube: '',
          username: 'iansalvadorlopez',
          name: 'Ian Salvador Lopéz',
        },
        {
          instagram: 'https://instagram.com/andresyyessica',
          username: 'andresyyessica',
        },
        {
          tiktok: '',
          id: '2Zzu2Isxrq7m71el3Hep',
          bio:
            '🕺Professional Bachata Dancer\n🥇World Bachata Champion 🏆\nCurso trucos para el social link en destacadas\nI teach you BACHATA tricks and dips int-adv👇',
          username: 'marcelobachata',
          youtube: '',
          instagram: 'https://instagram.com/marcelobachata',
          photo:
            'https://storage.googleapis.com/download/storage/v1/b/wedance-4abe3.appspot.com/o/share%2Fmarcelobachata.png?generation=1655306706192930&alt=media',
          facebook: '',
          name: 'Marcelobachata',
        },
        {
          username: 'indre_gatelyte',
          instagram: 'https://instagram.com/indre_gatelyte',
        },
        {
          instagram: 'https://instagram.com/alexandros_y_elena_bachata',
          username: 'alexandros_y_elena_bachata',
        },
        {
          name: 'Roger Cracco',
          youtube: '',
          id: 'nFoGQ083iObzRswv20lw',
          facebook: '',
          tiktok: '',
          photo:
            'https://storage.googleapis.com/download/storage/v1/b/wedance-4abe3.appspot.com/o/share%2Fcavalierecracco.png?generation=1655307334235041&alt=media',
          bio:
            '📍London\n#bachata #dance teacher\n🇻🇪🇮🇹🇬🇧 #wanderlust 🗺️\nLearning to be thankful around the world 🌍\nWork #smart, #train hard',
          username: 'cavalierecracco',
          instagram: 'https://instagram.com/cavalierecracco',
        },
        { instagram: 'https://instagram.com/lynn.996', username: 'lynn.996' },
        {
          instagram: 'https://instagram.com/emersonalaraofficial',
          username: 'emersonalaraofficial',
        },
        {
          name: 'Babsi',
          tiktok: '',
          username: 'babsi.bachata',
          youtube: '',
          id: 'TlDa57DcY05cwPD7IfwM',
          bio:
            'Bachata Sensual Instructor - Certified by @korkeyjudith_oficial\n@lunazul.dance\n@salsa.bachata.regensburg\n📍 Regensburg, Munich, Germany',
          photo:
            'https://storage.googleapis.com/download/storage/v1/b/wedance-4abe3.appspot.com/o/share%2Fbabsi.bachata.png?generation=1655307171323443&alt=media',
          facebook: '',
          instagram: 'https://instagram.com/babsi.bachata',
        },
        {
          facebook: '',
          instagram: 'https://instagram.com/lunazul.dance',
          youtube: '',
          id: 'UELqqwR9m6mfe3jyNn3t',
          tiktok: '',
          name: 'lunazul.dance',
          bio: '',
          username: 'lunazul.dance',
          photo: '',
        },
        {
          name: 'Migo',
          tiktok: '',
          bio: '',
          instagram: 'https://instagram.com/migo.bachatero',
          youtube: '',
          photo:
            'https://storage.googleapis.com/download/storage/v1/b/wedance-4abe3.appspot.com/o/share%2Fmigo.bachatero.png?generation=1644349620686392&alt=media',
          id: 'O7gLklMu43ExEP1YA6RZ',
          username: 'migo.bachatero',
          facebook: '',
        },
        {
          username: 'becca.bachatera',
          instagram: 'https://instagram.com/becca.bachatera',
        },
        {
          youtube: '',
          username: 'Silviadominicanbeat',
          photo:
            'https://firebasestorage.googleapis.com/v0/b/wedance-4abe3.appspot.com/o/media%2FNVtSLOLOIGSvCRWwfrfzx5ARV7f1%2Fabc0f540-c623-444a-97e8-dba4abf376e2?alt=media&token=f892ad8e-c3c7-4bb7-b180-cf4b34281555',
          name: 'Silvia',
          facebook: '',
          id: 'NVtSLOLOIGSvCRWwfrfzx5ARV7f1',
          tiktok: '',
          instagram: 'https://www.instagram.com/spndanceandevents/',
          bio: '',
        },
        {
          username: 'laura.delvecchio87',
          id: '6cksnCDd4uBaP3LZOhkG',
          instagram: 'https://instagram.com/laura.delvecchio87',
          facebook: '',
          bio:
            'Del Vecchio Dance - Dance Studio\nDance/Fitness/Lifestyle/Mindsetinspiration',
          name: 'Laura Del Vecchio',
          photo:
            'https://firebasestorage.googleapis.com/v0/b/wedance-4abe3.appspot.com/o/media%2FtvR012ArEpQhCJdPHh6G7sLuqoO2%2F940a7ab4-a7df-445c-a0f3-70e7a65a6c4a?alt=media&token=23669c3d-2ddf-4b92-b2c8-87112b072fbf',
          tiktok: '',
          youtube: '',
        },
        {
          instagram: 'https://instagram.com/sophieklara_',
          username: 'sophieklara_',
        },
      ],
      schedule: [
        {
          name: 'Check-in',
          startDate: '19:00',
          endDate: '2022-08-16 20:00',
          description: '',
        },
        {
          name: 'Doors close',
          startDate: '23:59',
          description: 'This is a test description',
        },
      ],
    })
    const schema = [
      {
        name: 'name',
        component: 'TInput',
      },
      {
        name: 'schedule',
        component: 'TInputArray',
        children: {
          component: 'TInputEvent',
        },
      },
      {
        name: 'artists',
        component: 'TInputArray',
        children: {
          component: 'TInputProfile',
        },
        labelPosition: 'top',
      },
    ]
    return { data, schema }
  },
}
</script>

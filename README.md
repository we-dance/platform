# WeDancePlatform

https://wedance.vip/

- Sign in (Google or magic link)
- Create profile
- Feed (list of posts)
- Community (list of profiles)

Admin:

- Reports
- Tags
- Profiles
- Accounts
- Emails

## Built with

- [Vue Composition Api](https://composition-api.vuejs.org/)
- [Firebase](https://firebase.google.com/)
- [Nuxt.js](https://nuxtjs.org)
- [Tailwind CSS](https://tailwindcss.com/)

## Setup

```bash
# install dependencies
yarn install

# serve with hot reload at localhost:3000
yarn dev
```

## Deploy

### App

- Enable Maps API in Google API
- Deploy to Netlify with env:

```
NUXT_ENV_GOOGLE_API_KEY=
NUXT_ENV_GOOGLE_FIREBASE_API_KEY=
```

### Mailgun

- Create mailgun account
- Create domain and setup DNS
- Create API key
- Init Firebase
- Deploy Firebase
- Enable Pub/Sub, Scheduler, Build API in cloud.google.com
- Setup hooks in Mailgun
- Create firestore index (send test mail, see logs, find link to create index)

```bash
firebase functions:config:set mailgun.key="" mailgun.domain="" mailgun.host=""
```

# GutenAbend

Online Kantine - https://gutenabend.netlify.com/

- Sign in (Google or magic link)
- Create an account
- Manage meetups (add, edit, remove)
- Manage ideas (add, edit, remove)
- RSVP (record a response, see list)

## Built with

- [Vue Composition Api](https://composition-api.vuejs.org/)
- [Firebase](https://firebase.google.com/)
- [Nuxt.js](https://nuxtjs.org)
- [Tailwind CSS](https://tailwindcss.com/)

## Installation

```bash
# install dependencies
yarn install

# serve with hot reload at localhost:3000
yarn dev
```

## Configuration

Mailgun

```bash
firebase functions:config:set mailgun.key="" mailgun.domain="" mailgun.host=""
```

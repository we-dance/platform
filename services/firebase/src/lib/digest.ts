const { createSSRApp } = require('vue');
const { renderToString } = require('vue/server-renderer');
import mjml2html = require('mjml');
import * as fs from 'fs';
import * as moment from 'moment';
import { firestore } from '../firebase';

export async function renderEmail(type: string, data: any, customUtms = {}) {
  const template = fs.readFileSync(`./src/templates/${type}.mjml`, 'utf8');

  const defaultUtms = {
    campaign: type,
    medium: 'email',
    source: 'newsletter',
  };

  const utm = {
    ...defaultUtms,
    ...customUtms,
  };

  const app = createSSRApp({
    data: () => {
      return data;
    },
    template,
    methods: {
      link(url: string, utmContent = '') {
        return (
          url +
          '?utm_campaign=' +
          utm.campaign +
          '&utm_medium=' +
          utm.medium +
          '&utm_source=' +
          utm.source +
          '&utm_content=' +
          utmContent
        );
      },
    },
  });

  app.config.compilerOptions.isCustomElement = (tag: any) =>
    tag.startsWith('mj');

  return mjml2html(await renderToString(app)).html;
}

export async function getWeeklyData(city: string) {
  const time = new Date();
  const today = time.toISOString().slice(0, 10);
  time.setDate(time.getDate() + 7);
  const sevenDaysFromNow = time.toISOString().slice(0, 10);

  const data = [];
  let cityProfile: any = {};

  const profileDocs = (
    await firestore.collection('profiles').where('username', '==', city).get()
  ).docs;

  for (const doc of profileDocs) {
    cityProfile = { id: doc.id, ...doc.data() };
  }

  const eventDocs = (
    await firestore
      .collection('posts')
      .where('startDate', '>', today)
      .where('startDate', '<', sevenDaysFromNow)
      .where('place', '==', cityProfile.place)
      .get()
  ).docs;

  for (const doc of eventDocs) {
    const event = {
      id: doc.id,
      ...doc.data(),
    } as any;

    data.push(event);
  }

  const events: any = {
    intro:
      'Hope you had a great weekend and are ready with your dancing shoes on for a fantastic week ahead.',
    title: `${city} Dance Calendar`,
    links: {
      telegram: cityProfile.telegram,
      instagram: cityProfile.instagram,
      facebook: cityProfile.facebook,
      addEvent: 'https://wedance.vip/events/-/edit',
      city: `https://wedance.vip/${city}`,
    },
    days: data.map((event) => ({
      day: moment(event.startDate).format('dddd'),
      date: moment(event.startDate).format('D MMM'),
      events: [
        {
          title: event.name,
          organizer: event.org.name,
          venue: event.venue?.name,
          format: event.eventType,
          time: moment(event.startDate).format('hh:mm'),
          link: event.link,
          cover: event.cover,
          styles: Object.keys(event.styles),
        },
      ],
    })),
  };

  return events;
}

export async function getSubscribers(cityProfile: any) {
  const recipients = {} as any;

  const subscribers = Object.keys(cityProfile.watch?.list);

  for (let subscriber of subscribers) {
    const profilesOfSubscriber = (
      await firestore
        .collection('profiles')
        .where('username', '==', subscriber)
        .get()
    ).docs;

    if (profilesOfSubscriber.length !== 1) {
      continue;
    }

    const profileId = profilesOfSubscriber[0].id;

    const accountDoc = await firestore
      .collection('accounts')
      .doc(profileId)
      .get();

    if (!accountDoc.exists) {
      continue;
    }

    const account = accountDoc.data();

    recipients[profileId] = {
      name: account?.name,
      email: account?.email,
    };
  }

  return recipients;
}

function getNextMonday() {
  const nextMonday = moment()
    .add(1, 'weeks')
    .day('Monday')
    .hour(18)
    .minute(0)
    .second(0);
  const formattedDate = nextMonday.format('MMMM DD, YYYY hh:mm A');
  return formattedDate;
}

export async function scheduleWeeklyEmails() {
  const cityDocs = (
    await firestore.collection('profiles').where('type', '==', 'City').get()
  ).docs;

  const nextMonday = getNextMonday();

  for (let cityDoc of cityDocs) {
    const cityProfile = cityDoc.data();

    if (!cityProfile.watch?.list) {
      continue;
    }

    const weeklyEmailDetails = await getWeeklyData(cityProfile.username);
    const html = await renderEmail('weekly', weeklyEmailDetails);
    const recipients = await getSubscribers(cityProfile);

    await firestore.collection('emails').add({
      status: 'scheduled',
      scheduledAt: nextMonday,
      createdAt: Date.now(),
      from: `WeDance <noreply@wedance.vip>`,
      subject: 'Weekly Newsletter',
      recipients,
      content: html,
    });
  }

  return null;
}

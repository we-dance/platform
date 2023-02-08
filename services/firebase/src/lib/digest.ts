const { createSSRApp }  = require('vue');
const { renderToString } = require('vue/server-renderer');
import mjml2html = require("mjml")
import * as fs from "fs"; 
import { firestore } from "../firebase";


export async function renderEmail(type: string, data:any, customUtms = {}) {
  const template = fs.readFileSync(`./templates/${type}.mjml`, "utf8");

  const defaultUtms = {
    campaign: type,
    medium: "email",
    source: "newsletter",
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
      link(url:string, utmContent = "") {
        return (
          url +
          "?utm_campaign=" +
          utm.campaign +
          "&utm_medium=" +
          utm.medium +
          "&utm_source=" +
          utm.source +
          "&utm_content=" +
          utmContent
        );
      },
    },
  });

  app.config.compilerOptions.isCustomElement = (tag:any) => tag.startsWith("mj");

  return  mjml2html(await renderToString(app)).html;
}

export async function getWeeklyData(city:string) {

  const today = new Date().toISOString().slice(0,10)
  const then = new Date();
  then.setDate(then.getDate() + 7);
  const sevenDaysFromNow = then.toISOString().slice(0,10); 

  const cityDocs = (await firestore
  .collection('profiles') 
  .where('username', '==', city)
  .get()
).docs

  const cityData: any = []; 

  for(const doc of cityDocs ) {
    const city = {
      id: doc.id, 
      ...doc.data()
    } as any 
    cityData.push(city)
  } 
  
  
  const eventDocs = (
    await firestore
      .collection('posts') 
      .where('startDate', '>', today)
      .where('startDate','<', sevenDaysFromNow) 
      .where('place','==',cityData[0].place)
      .get()
  ).docs


  const data = []

  for (const doc of eventDocs) {
    const event = {
      id: doc.id,
      ...doc.data(),
    } as any

    data.push(event)
  }
    
  const events: any = {
    intro:'Hope you had a great weekend and are ready with your dancing shoes on for a fantastic week ahead.', 
    title:'Munich Dance Calendar', 
    links: {
      telegram: "https://t.me/WeDanceMunich",
      instagram: "https://instagram.com/WeDanceMunich",
      facebook: "https://fb.com/WeDanceMunich",
      addEvent: "https://wedance.vip/events/-/edit",
      city: "https://wedance.vip/Munich",
    },
    days: data.map(event=>({
      title:event.name,
      organizer:event.org.name, 
      venue:event.venue?.name, 
      format:event.eventType, 
      time:event.startDate, 
      link:event.link, 
      cover:event.cover, 
      styles:Object.keys(event.styles)
    }))
  }

  return events; 
}

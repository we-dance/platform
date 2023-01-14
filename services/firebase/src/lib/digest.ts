const { createSSRApp }  = require('vue');
const { renderToString } = require('vue/server-renderer');
import mjml2html = require("mjml")
import * as fs from "fs"; 


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

  return mjml2html(await renderToString(app)).html;
}


export async function getWeeklyData(city:string) {
  const data = {
    intro:
      "Hope you had a great weekend and are ready with your dancing shoes on for a fantastic week ahead.",
    title: "Munich Dance Calendar",
    links: {
      telegram: "https://t.me/WeDanceMunich",
      instagram: "https://instagram.com/WeDanceMunich",
      facebook: "https://fb.com/WeDanceMunich",
      addEvent: "https://wedance.vip/events/-/edit",
      city: "https://wedance.vip/Munich",
    },
    days: [
      {
        day: "Monday",
        date: "11 Nov",
        events: [
          {
            title: "Kizomba Party",
            organizer: "circulo",
            venue: "Circulo Tanzschule",
            format: "Party",
            time: "21:30",
            link: "https://wedance.vip/events/C7YH4kKw5xz9QEARnSxI",
            cover:
              "https://firebasestorage.googleapis.com/v0/b/wedance-4abe3.appspot.com/o/media%2FtvR012ArEpQhCJdPHh6G7sLuqoO2%2Fc4439150-5e5c-4bbb-9f96-1ac1910f80bf?alt=media&token=64366542-00c1-43b8-a3cb-5f72f47a7f4c",
            styles: ["Bachata", "Kizomba"],
          },
          {
            title: "Bachata Party",
            organizer: "circulo",
            venue: "Circulo Tanzschule",
            format: "Party",
            time: "21:30",
            link: "https://wedance.vip/events/C7YH4kKw5xz9QEARnSxI",
            cover:
              "https://firebasestorage.googleapis.com/v0/b/wedance-4abe3.appspot.com/o/media%2FtvR012ArEpQhCJdPHh6G7sLuqoO2%2Fc4439150-5e5c-4bbb-9f96-1ac1910f80bf?alt=media&token=64366542-00c1-43b8-a3cb-5f72f47a7f4c",
            styles: ["Bachata", "Kizomba"],
          },
        ],
      },
      {
        day: "Tuesday",
        date: "12 Nov",
        events: [
          {
            title: "Kizomba Party",
            organizer: "circulo",
            venue: "Circulo Tanzschule",
            format: "Party",
            time: "21:30",
            link: "https://wedance.vip/events/C7YH4kKw5xz9QEARnSxI",
            cover:
              "https://firebasestorage.googleapis.com/v0/b/wedance-4abe3.appspot.com/o/media%2FtvR012ArEpQhCJdPHh6G7sLuqoO2%2Fc4439150-5e5c-4bbb-9f96-1ac1910f80bf?alt=media&token=64366542-00c1-43b8-a3cb-5f72f47a7f4c",
            styles: ["Bachata", "Kizomba"],
          },
          {
            title: "Bachata Party",
            organizer: "circulo",
            venue: "Circulo Tanzschule",
            format: "Party",
            time: "21:30",
            link: "https://wedance.vip/events/C7YH4kKw5xz9QEARnSxI",
            cover:
              "https://firebasestorage.googleapis.com/v0/b/wedance-4abe3.appspot.com/o/media%2FtvR012ArEpQhCJdPHh6G7sLuqoO2%2Fc4439150-5e5c-4bbb-9f96-1ac1910f80bf?alt=media&token=64366542-00c1-43b8-a3cb-5f72f47a7f4c",
            styles: ["Bachata", "Kizomba"],
          },
          {
            title: "Salsa Party",
            organizer: "circulo",
            venue: "Circulo Tanzschule",
            format: "Party",
            time: "21:30",
            link: "https://wedance.vip/events/C7YH4kKw5xz9QEARnSxI",
            cover:
              "https://firebasestorage.googleapis.com/v0/b/wedance-4abe3.appspot.com/o/media%2FtvR012ArEpQhCJdPHh6G7sLuqoO2%2Fc4439150-5e5c-4bbb-9f96-1ac1910f80bf?alt=media&token=64366542-00c1-43b8-a3cb-5f72f47a7f4c",
            styles: ["Bachata", "Kizomba"],
          },
        ],
      },
    ],
  };

  return data;
}

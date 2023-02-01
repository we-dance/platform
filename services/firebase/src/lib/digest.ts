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

  const eventDocs = (
    await firestore
      .collection('events')
      .get()
  ).docs
  
  let data;
  for (const doc of eventDocs) {
     data = {
      id: doc.id,
      ...doc.data(),
    };
  }
  return data; 
}

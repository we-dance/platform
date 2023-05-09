import * as mailgun from 'mailgun-js'
import * as MarkdownIt from 'markdown-it'

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
})

const getHtml = (content: any) => {
  return md.render(content)
}

export default async (data: any) => {
  const mg = mailgun({
    apiKey: String(process.env.MAILGUN_KEY),
    domain: String(process.env.MAILGUN_DOMAIN),
    host: String(process.env.MAILGUN_HOST),
  })

  const jobs: Promise<any>[] = []

  const uids = Object.keys(data.recipients)
  uids.forEach((uid) => {
    const job = mg.messages().send({
      from: data.from,
      to: `${data.recipients[uid].name} <${data.recipients[uid].email}>`,
      subject: data.subject,
      html: data.html || getHtml(data.content),
      'v:uid': uid,
      'v:campaignId': data.id,
      'v:type': data.type,
    })
    jobs.push(job)
  })

  return await Promise.all(jobs)
}

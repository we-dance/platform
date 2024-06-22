import axios from 'axios'

const POSTHOG_PERSONAL_API_KEY = String(process.env.POSTHOG_PERSONAL_API_KEY)
const PROJECT_ID = String(process.env.POSTHOG_PROJECT_ID)
const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${POSTHOG_PERSONAL_API_KEY}`,
}

export default async function posthog(path: string) {
  const params = new URLSearchParams()

  // Define the event we're interested in
  params.append(
    'events',
    JSON.stringify([
      {
        id: '$pageview',
        math: 'total',
        name: '$pageview',
        type: 'events',
        order: 0,
      },
    ])
  )

  // Display format
  params.append('display', 'BoldNumber')
  params.append('date_from', 'all')

  // Define the properties to filter by URL
  params.append(
    'properties',
    JSON.stringify({
      type: 'AND',
      values: [
        {
          key: '$current_url',
          type: 'event',
          value: path,
          operator: 'icontains',
        },
      ],
    })
  )

  // Make fetch request
  const apiUrl = `https://us.posthog.com/api/projects/${PROJECT_ID}/insights/trend?${params}`

  const response = await axios(apiUrl, {
    headers,
  })

  console.log(response.data.result[0].aggregated_value)
}

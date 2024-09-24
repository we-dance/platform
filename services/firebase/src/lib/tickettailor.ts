const axios = require('axios')
const TICKET_TAILOR_API_KEY = String(process.env.TICKET_TAILOR_API_KEY)

export default async function tickettailor() {
  const response = await axios.get(
    'https://api.tickettailor.com/v1/event_series',
    {
      headers: {
        Accept: 'application/json',
      },
      auth: {
        username: TICKET_TAILOR_API_KEY,
        password: '',
      },
    }
  )
  console.log(response.data.data[1])
}

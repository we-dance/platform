export const getBrowserLocation = async () => {
  const promise = new Promise((resolve, reject) => {
    window.navigator.geolocation.getCurrentPosition(resolve, reject)
  })

  return await promise
}

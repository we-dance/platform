class Stats {
  constructor() {
    this.stats = {}
    this.history = []
    this.total = 0
  }

  get(field) {
    return this.stats[field]
  }

  add(collection, count = 1, method = '', source = '') {
    if (!this.stats[collection]) {
      this.stats[collection] = 0
    }

    this.history.push({
      time: new Date(),
      method,
      collection,
      count,
      source,
    })

    this.stats[collection] += count
    this.total += count
  }
}

const appStats = new Stats()

if (window) {
  window.stats = appStats
}

export default appStats

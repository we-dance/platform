import { sum } from '../utils'

describe('sum', () => {
  it('should return the sum of numbers', () => {
    sum(1, 2).should.equal(3)
    sum(2, 2).should.equal(4)
  })
})

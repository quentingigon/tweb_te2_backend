const { expect } = require('chai')

describe('String', function () {
  it('should tranform name', function () {
    const name = 'gigon'.replace('o', 'a')
    expect(name).to.equal('gigan')
  })
})